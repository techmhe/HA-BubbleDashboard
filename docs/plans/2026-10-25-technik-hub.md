# Technik Hub Implementation Plan

Status: ready
Spec: docs/specs/2026-10-25-technik-hub.md
Branch: plan/technik-hub
Review: final

**Goal:** Technik button, Technik sheet, printer sheet and technical "Aktuell" items, visible only to tech users.
**Architecture:**
- Pure logic lives in two new modules: `src/logic/technik.ts` (visibility, sources, services, Pi-hole, guest WLAN, Aktuell items) and `src/logic/printer.ts` (entity lookup, state, lock, AMS).
- Two new sheets render the logic: `src/sheets/technik.ts` and `src/sheets/printer.ts`.
- The Übersicht gets the button and appends the technical items.
- Card-held state (dismissals, Pi-hole pause end) is exposed through `PageContext`.

**Tech stack:** Lit 3, TypeScript 5.9, Vite, Vitest.

## Global constraints

- UI copy is German, exactly as in the spec. Code, comments and commits are English, Conventional Commits.
- No real names, hostnames or serials anywhere. Fixtures use Max, Anna, Musterstadt and `x2d_musterdrucker`. Before every commit:
  the private PII grep (real names, town, hostnames, email, serials) over `src test README.md dev` prints nothing.
- No new dependencies.
- Entities are found by `platform` + `translation_key` on `hass.entities`, never by German entity_id fragments.
- Non-tech users see nothing technical: no button, no items, no sheet.
- Visual reference: `docs/design/technik-hub/*.dc.html`. Reuse the tokens and `sheet()`/`icon()` from `src/components/ui.ts`.
- Check command: `npm run check` (typecheck, vitest, build). Expected: exit 0.

## Review focus

1. **Entity unavailable or missing.** Any printer, Kuma, Pi-hole or UniFi entity reads `unavailable`/`unknown` or is absent. Expect `–` or a hidden element, no exception, no false problem. Test in Task 3 (services) and Task 4 (printer).
2. **HA restart or printer reconnect.** `print_status` `last_changed` is fresh while `end_time` is old. Expect a "fertig" or `failed` item older than 12 h to stay hidden. Test in Task 4.
3. **Kuma monitor flapping.** A monitor goes down at T and comes up at T+2 min. Expect no red dot and no Aktuell item, pending in the sheet only. Test in Task 2.
4. **Bad `service_groups` regex.** A user sets `{ X: '([' }`. Expect that group skipped, everything else rendering. Test in Task 2.
5. **Non-tech user with an active problem.** Anna is logged in, a monitor is down and the printer has an error. Expect zero technical items and no button. Test in Task 5.

## Tasks

- [x] **Task 1: Types, config and visibility**

  **Files:** modify `src/types.ts`; create `src/logic/technik.ts`; create `test/fixture-technik.ts`; test `test/technik.test.ts`
  **Interfaces:** produces
  - `TechnikConfig { users?: string[]; printer?: string; printer_plug?: string; printer_plug_power?: string; printer_plug_energy?: string; pihole?: string; guest_wifi?: string; services_exclude?: string[]; service_groups?: Record<string, string> }`
  - `CardConfig.technik?: TechnikConfig | false`
  - `HomeAssistant.user?: { id?: string; name: string; is_admin?: boolean }`
  - `HomeAssistant.formatEntityState?(s: HassEntity): string`
  - `HassEntityRegistryEntry.translation_key?: string | null`
  - `isTechUser(hass: HomeAssistant, config: CardConfig): boolean`
  - fixture `techHass(over?: Record<string, Def>, user?: 'max' | 'anna'): HomeAssistant` built on `makeHass` from `test/fixture.ts`; `Def`'s `reg` gains `translation_key`.

  1. Write the fixture `test/fixture-technik.ts`:
     - device `drucker` (name `x2d_musterdrucker`) with `bambu_lab` entities carrying the translation keys listed in the spec context;
     - device `ams` with 4 `tray` sensors (attrs `color`, `type`, `name`, `active`, `empty`, `remain`, `remain_enabled`) plus `humidity`, `drying`, `remaining_drying_time`;
     - plug `switch.drucker_steckdose` with `sensor.drucker_steckdose_power` and `sensor.drucker_steckdose_energy`;
     - `switch.pi_hole` (platform `pi_hole`) and `sensor.pi_hole_anteil` (`percent_ads_blocked`);
     - guest WLAN device with `switch.gaeste_wlan` (`wlan_control`), `sensor.gaeste_wlan` (`wlan_clients`), `image.gaeste_wlan_qr_code` (`qr_code`), `button.gaeste_wlan_regenerate_password` (`regenerate_password`);
     - 6 Kuma devices `Nextcloud`, `Musterwiki`, `Home Assistant`, `DNS (pihole01)`, `DNS (pihole02)`, `DNS (VRRP)`, each with a `status` sensor and, for HTTP monitors, `cert_days_remaining`;
     - users: Max `{ id: 'u-max', name: 'Max', is_admin: true }`, Anna `{ id: 'u-anna', name: 'Anna', is_admin: false }`.
  2. Write the failing tests in `test/technik.test.ts`:
     ```ts
     it('treats listed users as tech users by id or name, case-insensitive', () => {
       expect(isTechUser(techHass({}, 'anna'), cfg({ technik: { users: ['anna'] } }))).toBe(true);
       expect(isTechUser(techHass({}, 'max'), cfg({ technik: { users: ['u-anna'] } }))).toBe(false);
     });
     it('defaults to admins', () => {
       expect(isTechUser(techHass({}, 'max'), cfg({}))).toBe(true);
       expect(isTechUser(techHass({}, 'anna'), cfg({}))).toBe(false);
     });
     it('is off for everyone with technik: false', () => {
       expect(isTechUser(techHass({}, 'max'), cfg({ technik: false }))).toBe(false);
     });
     ```
  3. Run `npx vitest run test/technik.test.ts`. Expected: FAIL, `isTechUser` not exported.
  4. Add the types and implement `isTechUser`.
  5. Run `npm run check`. Expected: exit 0.
  6. Commit: `feat(technik): config types and tech-user visibility`.

- [x] **Task 2: Uptime Kuma services**

  **Files:** modify `src/logic/technik.ts`; test `test/technik-services.test.ts`
  **Interfaces:** produces
  - `type ServiceKind = 'down' | 'pending' | 'cert' | 'ok'`
  - `interface ServiceRow { name: string; kind: ServiceKind; text: string; members?: number; down?: number }`
  - `interface Services { problems: ServiceRow[]; ok: ServiceRow[]; okMonitors: number; total: number; down: ServiceRow[] }`
  - `services(hass: HomeAssistant, config: CardConfig, now: Date): Services`
  - constants `SERVICE_DOWN_MIN = 3`, `CERT_WARN_DAYS = 7`

  1. Write failing tests, one `it` each, with these assertions:
     - A monitor `down` for 5 min gives `problems[0]` = `{ kind: 'down', text: 'down seit 5 min' }` and appears in `down`.
     - `down` for 2 min gives kind `pending`, text `prüft …`, and is not in `down`.
     - `pending` gives kind `pending`.
     - `maintenance` counts as OK and is not in `problems`.
     - An up monitor with `cert_days_remaining` 6 gives kind `cert`, text `Zertifikat 6 Tage`. A value of 7 is OK.
     - Default group: the three `DNS (…)` monitors become one row named `DNS`, `members: 3`. With one member down ≥ 3 min the row is kind `down`, text `1 von 3 down`, and it is in `down`.
     - `total` counts monitors (6) and `okMonitors` counts OK monitors.
     - `services_exclude: ['Musterwiki']` drops it from every list and from `total`.
     - `service_groups: { X: '([' }` does not throw and leaves the DNS monitors ungrouped (the default is replaced, not merged).
     - An `unavailable` status counts as `pending`.
  2. Run `npx vitest run test/technik-services.test.ts`. Expected: FAIL.
  3. Implement `services()`:
     - The display name is the device's `name_by_user ?? name`.
     - `ok` rows are sorted by name (`localeCompare('de')`).
     - Problem order: down, pending, cert.
     - Use the existing `durationText` for "seit".
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(technik): uptime kuma service rows`.

- [x] **Task 3: Pi-hole, guest WLAN, sources and problem count**

  **Files:** modify `src/logic/technik.ts`; test `test/technik-sources.test.ts`
  **Interfaces:** consumes `services()` (Task 2); the printer error comes in as the boolean `printerError` (Task 4 is not needed here). Produces:
  - `interface PiholeState { entity: string; kind: 'on' | 'off' | 'paused'; percent?: number; offSince?: number; remainingSec?: number; problem: boolean }`
  - `pihole(hass, config, now: Date, pauseUntil?: number): PiholeState | null`, with constant `PIHOLE_PROBLEM_MIN = 70`
  - `interface GuestWifi { entity: string; on: boolean; clients?: number; qr?: string; regenerate?: string }`
  - `guestWifi(hass, config): GuestWifi | null`
  - `hasTechnik(hass, config): boolean` (true when any source exists)
  - `technikProblems(hass, config, now, printerError: boolean): number`

  1. Write failing tests:
     - Switch `off` for 69 min gives `problem: false`; 70 min gives `problem: true`.
     - With `pauseUntil` in the future: `kind: 'paused'` and `remainingSec` set.
     - `on` gives `percent` from `percent_ads_blocked` rounded.
     - The `pihole` config overrides detection.
     - Guest WLAN is detected by `wlan_control` plus `guest` in the entity_id. `qr` and `regenerate` are undefined when those entities are missing from `hass.states`.
     - `technikProblems` = number of `services().down` rows + (Pi-hole problem ? 1 : 0) + (printerError ? 1 : 0).
     - `hasTechnik` is false for a hass without any of the platforms.
  2. Run `npx vitest run test/technik-sources.test.ts`. Expected: FAIL.
  3. Implement. `offSince` is the switch's `last_changed` in ms.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(technik): pi-hole, guest wlan and problem count`.

- [x] **Task 4: Printer logic**

  **Files:** create `src/logic/printer.ts`; test `test/printer.test.ts`
  **Interfaces:** produces
  - `type PrinterKind = 'off' | 'starting' | 'disconnected' | 'error' | 'printing' | 'finished' | 'idle'`
  - `interface Printer { device: string; e: Partial<Record<PrinterKey, string>>; ams?: string; plug?: string; plugPower?: string; plugEnergy?: string; controls: { pause?: string; resume?: string; stop?: string; camera?: string } }`, where `PrinterKey` is the union of the printer translation keys the spec lists
  - `findPrinter(hass, config): Printer | null`
  - `interface PrinterState { kind: PrinterKind; paused: boolean; failedOnly: boolean; jobKey?: string; errorText?: string; progress?: number; status: string }`
  - `printerState(hass, p: Printer, now: Date, dismissed: (key: string) => boolean): PrinterState`
  - `powerLocked(hass, p, s: PrinterState): boolean`, with constants `NOZZLE_LOCK_C = 50`, `START_GRACE_MIN = 5`, `JOB_MAX_H = 12`
  - `interface AmsSlot { color?: string; type: string; name: string; active: boolean; empty: boolean; remain?: number }`
  - `amsSlots(hass, p): AmsSlot[]`
  - `amsNote(hass, p): string`

  1. Write failing tests, one `it` per state from spec req. 20:
     - plug `off` gives `off`;
     - plug on 4 min + `offline` gives `starting` (status `startet …`); 5 min gives `disconnected`;
     - no plug + `unavailable` gives `disconnected`;
     - `running` gives `printing`, status `Druckt · <stage label>`, label via `formatEntityState`, falling back to the raw state;
     - `pause` without error gives `printing` with `paused: true`;
     - `hms_errors` on gives `error` with `failedOnly: false`, `errorText` from attr `1-Error` minus the code prefix;
     - `failed` with `end_time` 2 h ago gives `error` with `failedOnly: true`; 13 h ago gives `idle`;
     - `failed` with `dismissed(jobKey)` true gives `idle`;
     - `finish` gives `finished`;
     - unknown value gives `idle`.
     Plus:
     - `jobKey` equals the `end_time` state, or the `last_changed` fallback when `end_time` is unknown.
     - `powerLocked`: true in printing and in error; true at nozzle 50 °C in idle; false at 49 °C.
     - `amsSlots`: four slots, `#000000FF` becomes `#000000`, the active slot is flagged, an empty slot gives `empty: true`, `remain` is set only when `remain_enabled`.
     - `amsNote`: `trocknet · noch 2 h 10 min` while `drying` is on, else `55 % Feuchte`.
     - Controls: a `button` on the printer device with translation_key `pause` fills `controls.pause`; with none, all are undefined.
  2. Run `npx vitest run test/printer.test.ts`. Expected: FAIL.
  3. Implement. The device is `config.technik.printer` or the first device with a `bambu_lab` `print_status` entity. The AMS device is the one whose `bambu_lab` entities include `tray`, taking the first. The plug comes from config only.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(printer): state, power lock and AMS slots`.

- [x] **Task 5: Technical Aktuell items and card state**

  **Files:** modify `src/logic/overview.ts` (`NowItem`, `NowAction`, `NowTap`, `WIDE`); modify `src/logic/technik.ts`; modify `src/pages/context.ts`; modify `src/ha-start-dashboard.ts` (state + context); modify `src/pages/overview.ts` (`renderItem`, `itemTap`, item list); test `test/technik-now.test.ts`, plus one case appended to `test/now-layout.test.ts`
  **Interfaces:** consumes Tasks 1–4. Produces:
  - `NowItem.progress?: number`, `NowItem.value?: string`
  - `NowAction` gains `{ kind: 'dismiss'; label: string; key: string }`
  - `NowTap` gains `'technik' | 'printer'`
  - `technikItems(hass, config, now, ctx: { dismissed(key: string): boolean; pauseUntil?: number }): NowItem[]`
  - `PageContext.dismissed(key: string): boolean`, `PageContext.dismiss(key: string): void` (localStorage `hsd-dismissed`, try/catch, entries older than 48 h pruned)
  - `PageContext.piholePause?: number`, `PageContext.setPiholePause(until?: number): void`

  1. Write failing tests in `test/technik-now.test.ts`:
     - Printing at 63 % with end 23:40 and 1.2 h remaining gives id `print`, title `3D-Druck · 63 %`, text `Halterung · fertig um 23:40`, value `1:12 h`, progress `0.63`, tap `printer`.
     - Paused gives title `3D-Druck pausiert · 63 %`.
     - Finished with bed 41 gives id `print-done`, text `Halterung · Bett 41°, noch abkühlen`, action `{ kind: 'dismiss', label: 'OK' }`. With bed 30: `… · kann entnommen werden`.
     - `failed` only gives id `print-error` with a dismiss action. An HMS error gives the same id without an action.
     - One monitor down gives title `Nextcloud nicht erreichbar`, text `seit 5 min`, tap `technik`. Two down gives `2 Dienste nicht erreichbar`, text `Nextcloud · Musterwiki`.
     - Pi-hole off 70 min gives id `pihole`, text `Pi-hole · seit HH:MM` (or `gestern HH:MM`), service action `Einschalten` with `switch.turn_on`.
     - For Anna, `technikItems` returns `[]` even with all problems active.
     - In `now-layout.test.ts`: `nowLayout` renders `print`, `print-done`, `print-error`, `services`, `pihole` wide.
  2. Run `npx vitest run test/technik-now.test.ts test/now-layout.test.ts`. Expected: FAIL.
  3. Implement:
     - `technikItems` returns `[]` when `!isTechUser`.
     - Add the five ids to `WIDE`.
     - `renderOverview` appends `technikItems(...)` after `nowItems(...)`.
     - `renderItem` draws the right-aligned `value` and a 3 px bar for `progress` (mockup `AktuellItems`).
     - A `dismiss` action calls `ctx.dismiss(key)`.
     - `itemTap` maps `technik` and `printer` to `openSheet`.
  4. Run `npm run check`. Expected: exit 0; the existing Aktuell tests are unchanged and green.
  5. Commit: `feat(technik): technical Aktuell items`.

- [x] **Task 6: Technik button and Technik sheet**

  **Files:** create `src/sheets/technik.ts`; modify `src/pages/context.ts` (`SheetState` adds `{ id: 'technik' }` and `{ id: 'printer' }`); modify `src/ha-start-dashboard.ts` (`_renderSheets` cases; refuse to open both sheets for non-tech users); modify `src/pages/overview.ts` (header button); test `test/technik-sheet.test.ts`
  **Interfaces:** consumes `services`, `pihole`, `guestWifi`, `technikProblems`, `findPrinter`, `printerState`, `powerLocked`. Produces `technikSheet(ctx: PageContext): TemplateResult` and `technikHeadline(problems: number): { text: string; alert: boolean }`.

  1. Write failing tests:
     - `technikHeadline(0)` is `{ text: 'alles in Ordnung', alert: false }`; `technikHeadline(2)` is `{ text: '2 Meldungen', alert: true }`; `technikHeadline(1)` is `{ text: '1 Meldung', alert: true }`.
     - Render tests with `render()` from lit into a div:
       - Max sees `.tech-btn` and Anna does not.
       - The red dot is present with one monitor down for 5 min and absent with all up.
       - The sheet lists `Nextcloud` as a problem and shows `5 weitere erreichbar`. (Follow the existing render-test pattern in `test/overview.test.ts`.)
  2. Run `npx vitest run test/technik-sheet.test.ts`. Expected: FAIL.
  3. Implement per spec reqs. 11, 12, 14–19 and mockups `Main`, `Netz`, `NetzAn`:
     - Werbeblocker row with the three states. Pause calls `pi_hole.disable` with `{ duration: '00:05:00' | '01:00:00' }` on the switch, then `ctx.setPiholePause(now + ms)`. `Fortsetzen` calls `switch.turn_on` and clears the pause.
     - Dienste card. Expand state lives in `ctx.ui.servicesOpen`.
     - Gäste-WLAN card. The QR image src is the image entity's `entity_picture` attribute. Regenerate goes through `ctx.confirm` and then `button.press`.
     - Printer row at the bottom. Its power button uses `ctx.confirm` before `switch.turn_off`.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(technik): technik button and sheet`.

- [x] **Task 7: Printer sheet**

  **Files:** create `src/sheets/printer.ts`; modify `src/ha-start-dashboard.ts` (case `printer`); test `test/printer-sheet.test.ts`
  **Interfaces:** consumes Task 4. Produces `printerSheet(ctx: PageContext): TemplateResult`.

  1. Write failing render tests, one per kind:
     - `printing` shows `Schicht 182/290` exactly once in the sheet text. The Pause and Stopp buttons are absent without control entities and present when the fixture adds `button` entities with keys `pause`/`stop`.
     - `finished` shows `fertig um` plus the `end_time` HH:MM.
     - `error` with `failedOnly` shows `Am Drucker oder in Bambu Handy fortsetzen.`
     - `off` shows an `Einschalten` button that calls `switch.turn_on` on the plug.
     - `starting` shows `Drucker startet, das dauert etwa 1 min.`
     - The power button has the `locked` class while printing.
  2. Run `npx vitest run test/printer-sheet.test.ts`. Expected: FAIL.
  3. Implement spec reqs. 21–28 per mockups `Drucker`, `DruckerFertig`, `DruckerFehler`, `DruckerAus`:
     - The cover image is the `cover_image` entity's `entity_picture`.
     - Temperature pills at ≥ 50 ° use `#ffb37a`.
     - Stopp uses the existing `hold` directive plus `ctx.confirm`.
     - The camera uses `ha-camera-stream` only when `controls.camera` exists.
     - "Diesen Monat" uses `ctx.series` with the existing statistics loader for `printer_plug_energy` (calendar month, kWh).
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(printer): printer sheet`.

- [x] **Task 8: Docs and dev preview**

  **Files:** modify `README.md`; modify `dev/main.ts` (mock entities from the fixture shape so the dev preview shows the button, both sheets and the items)

  1. README:
     - a "Technik" section with the `technik:` options table (spec reqs. 1–10);
     - auto-detection;
     - visibility default (admins);
     - the note that UniFi's `QR-Code` and `Passwort neu generieren` entities are disabled by default and must be enabled;
     - pause/stop/camera only when ha-bambulab exposes them (LAN mode).
  2. Run `npm run check`. Expected: exit 0. Then run the PII grep from Global constraints. Expected: no output.
  3. Commit: `docs(technik): document technik options`.
