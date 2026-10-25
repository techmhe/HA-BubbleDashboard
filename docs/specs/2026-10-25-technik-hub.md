# Technik Hub Spec

Status: approved

## Goal

Bring the technical side of the home (3D printer, Pi-hole, guest WLAN, self-hosted services) into the card without cluttering it for people who don't care about it. Technical things appear on the Übersicht only when they need attention, or while a print is running. Everything else sits behind a small Technik button that only selected users see. Success: a running print, a finished or failed print, a service that is down, or ad blocking left off show up in "Aktuell" by themselves; the Technik sheet answers "is everything OK?" at a glance; nobody else in the household ever sees any of it.

## Context

- The card is Lit 3 + TypeScript, one bundle, with pages in `src/pages/`, bottom sheets in `src/sheets/`, pure logic in `src/logic/` (tested with Vitest), and sheet routing via `SheetState` in `src/pages/context.ts` and `src/ha-start-dashboard.ts`.
- "Aktuell" items come from `nowItems()` in `src/logic/overview.ts` (`NowItem`, optional `action`, `tap`).
- Entity defaults live in `ENTITY_DEFAULTS` (`src/logic/entities.ts`). The repo is public, so defaults and fixtures use placeholder names (Max, Anna, Musterstadt).
- The check is `npm run check` (typecheck + tests + build); there is no `.claude/verify.sh`.
- Approved mockups: `docs/design/technik-hub/` (`*.dc.html`: markup and inline styles are the reference; the `{{ }}` bindings need the canvas runtime and are not meant to render on their own). Boards:
  - `Main`: Übersicht with the Technik button and Aktuell items.
  - `AktuellItems`: every technical Aktuell variant.
  - `Drucker`, `DruckerFertig`, `DruckerFehler`, `DruckerAus`: the printer sheet states.
  - `Netz`: the Technik sheet with a problem.
  - `NetzAn`: the Technik sheet with everything OK, top part.
- A 3D printer-card variant was explored and rejected; do not build it.

### What Home Assistant provides (verified 2026-10-25 on the live system)

**Printer (Bambu Lab X2D, HACS `ha-bambulab`, platform `bambu_lab`, cloud MQTT mode).** Entities carry stable `translation_key`s on `hass.entities`:
- **Printer device:** `print_status`, `stage`, `print_progress`, `remaining_time`, `end_time`, `current_layer`, `total_layers`, `subtask_name`, `print_weight`, `speed_profile`, `cover_image`.
- **Temperatures:** `left_nozzle_temp`, `right_nozzle_temp`, `nozzle_temp`, `bed_temp`, `chamber_temp`.
- **Problems and other:** `hms_errors`, `print_error`, `online`, `door_open`, `chamber_light`, `camera`.
- **AMS device:** `tray` (×4), `humidity`, `humidity_index`, `ams_temp`, `drying`, `remaining_drying_time`, `active_tray`.
- **Value details:**
  - `print_status` is an enum: `failed, finish, idle, init, offline, pause, prepare, running, slicing, unknown`.
  - `stage` is an enum with about 80 options.
  - `hass.formatEntityState(stateObj)` returns the German label.
  - `remaining_time` is in hours (device_class duration).
  - `end_time` is a timestamp.
  - A tray's attributes include `color` (`#RRGGBBAA`), `type`, `name`, `active`, `empty`, `remain` (%).
- **Missing today:** pause, resume and stop buttons, and a camera entity. The printer plug is a separate switch with power and energy sensors.

**Uptime Kuma (HA core, platform `uptime_kuma`).**
- One device per monitor (device name = monitor name, 21 monitors).
- Each device has a `status` sensor (enum `down, up, pending, maintenance`) and a `cert_days_remaining` sensor (days; only HTTP monitors). It also has `response_time` and uptime sensors, which are unused.
- The `tags` sensors are disabled.
- Three monitors are DNS checks named `DNS (…)`.

**Pi-hole (platform `pi_hole`).**
- `switch.pi_hole` turns blocking on and off.
- `pi_hole.disable` (field `duration`, `HH:MM:SS`, target the switch) pauses blocking.
- `sensor.*` with `translation_key` `percent_ads_blocked`.

**Guest WLAN (platform `unifi`).**
- `switch.<wlan>` (`translation_key` `wlan_control`) and `sensor.<wlan>` (`wlan_clients`).
- `image.<wlan>_qr_code` and `button.<wlan>_regenerate_password` exist on the device but are **disabled** in the registry. The owner has to enable them; the card hides what is missing.

**Current user.** `hass.user` has `id`, `name`, `is_admin`.

## Requirements

### Visibility (`technik.users`)

1. New card option `technik.users`: a list of HA user ids or user names (compared case-insensitively against `hass.user.id` and `hass.user.name`).
2. A user is a *tech user* when listed. Without `technik.users`, every admin (`hass.user.is_admin`) is a tech user.
3. `technik: false` turns the whole feature off for everyone.
4. Non-tech users see no Technik button, no technical Aktuell item and cannot open the Technik or printer sheet. Nothing else changes for them.

### Sources and auto-detection (config keys under `technik:`)

5. `printer`: device id of the printer. Default: the first device that has a `bambu_lab` entity with `translation_key` `print_status`. Printer entities are looked up by `translation_key` among the `bambu_lab` entities of that device; AMS entities among the `bambu_lab` entities of devices whose `tray` entities exist. Use the first AMS only.
6. `printer_plug`, `printer_plug_power`, `printer_plug_energy`: plug switch, its power sensor and its energy sensor. No auto-detection. Without `printer_plug` there is no power button and no "aus" state.
7. `pihole`: switch entity. Default: the first `switch` with platform `pi_hole`.
8. `guest_wifi`: the WLAN switch. Default: the first `unifi` switch with `translation_key` `wlan_control` whose entity_id contains `guest`. The QR image, regenerate button and client sensor are the entities on the same device with `translation_key` `qr_code`, `regenerate_password` and `wlan_clients` (or, if those keys are missing, the domain `image` / `button` / `sensor` on that device).
9. `services`: Uptime Kuma monitors are every `uptime_kuma` sensor with `translation_key` `status`. The display name is the device's `name_by_user ?? name`.
   - `services_exclude: [names]` hides monitors.
   - `service_groups: { <group name>: <regex on monitor name> }` merges monitors into one row. Default `{ DNS: '^DNS\\b' }`.
10. Every source is optional. A missing source hides its section. The Technik button is hidden when no source exists.

### Übersicht

11. Technik button: a 52 px round button left of the weather pill, with a plain server icon (mockup `Main`). It opens the Technik sheet.
12. The button shows a 12 px red dot when at least one *problem* exists. Problems are:
    - a service or group down (debounced, req. 16);
    - Pi-hole blocking off for ≥ 70 min;
    - a printer error.
13. Technical Aktuell items (tech users only) come after all existing items. Copy and colours follow mockup `AktuellItems`:
    - **Print running** (`print_status` in `running, prepare, init, slicing, pause` without error), purple:
      - title `3D-Druck · <progress> %`;
      - text `<subtask_name> · fertig um HH:MM`;
      - remaining time right-aligned as `H:MM h`;
      - a 3 px progress bar along the bottom edge;
      - tap opens the printer sheet;
      - while paused, the title is `3D-Druck pausiert · <progress> %`.
    - **Print finished** (`print_status` `finish`, `end_time` < 12 h ago (fallback `last_changed`), not dismissed), green:
      - title `3D-Druck fertig`;
      - text `<subtask_name> · Bett <bed>°, noch abkühlen` while `bed_temp` ≥ 35, else `<subtask_name> · kann entnommen werden`;
      - action `OK` dismisses it.
    - **Print error** (`print_status` `failed` with `end_time` < 12 h ago (fallback `last_changed`) and not dismissed, or `hms_errors` / `print_error` on), red:
      - title `3D-Druck angehalten`;
      - text = the first `hms_errors` attribute entry `1-Error` without its code prefix, else the `print_error` attribute `error`, else `Fehler am Drucker`;
      - tap opens the printer sheet;
      - only when caused by `failed` alone: action `OK` dismisses it (stored per `end_time` like "fertig"); an active HMS or print error cannot be dismissed and stays until it clears.
    - **Service down**, red:
      - one down: title `<name> nicht erreichbar`, text `seit <duration>`;
      - several down: title `<n> Dienste nicht erreichbar`, text `<names joined by ' · '>`;
      - tap opens the Technik sheet.
    - **Werbeblocker aus** (Pi-hole switch `off` for ≥ 70 min), red:
      - text `Pi-hole · seit <time>`;
      - action `Einschalten` (`switch.turn_on`).

### Technik sheet (mockups `Netz`, `NetzAn`)

14. Head: title `Technik`. Subtitle `<n> Meldungen` in red when problems exist, else `alles in Ordnung`.
15. **Werbeblocker row:**
    - Off: red, `Werbeblocker aus`, `Pi-hole · seit <time>`, button `Einschalten`.
    - On: green, `Werbeblocker an`, `heute <percent_ads_blocked rounded> % aller Anfragen blockiert`, buttons `5 min pausieren` / `1 h pausieren` (`pi_hole.disable` with `00:05:00` / `01:00:00`).
    - While a pause started from this card is running: yellow row `Pausiert noch m:ss` with `Fortsetzen` (`switch.turn_on`). Pause end time is kept in card memory only.
16. **Dienste card:**
    - Header: `Dienste`, right `<ok> von <total> ok · Uptime Kuma`.
    - Rows list only problems:
      - down: red, `down seit <duration>`;
      - pending: yellow, `prüft …`;
      - cert < 7 days on an up monitor: orange, `Zertifikat <n> Tage`.
    - Then a collapsed row `<n> weitere erreichbar ›` that expands to all remaining monitors (green, sorted by name).
    - With no problems, only `Dienste · alle <total> erreichbar`, expandable.
    - Maintenance counts as OK and is never listed as a problem.
    - A group row shows the group name and `<down> von <members> down`. A group is down (a problem, red) as soon as any member is down; its state otherwise is its worst member (pending, then cert). `<ok> von <total>` counts monitors, not rows.
    - Debounce: a monitor counts as down only when its `status` has been `down` for ≥ 3 min (`last_changed`). Before that it shows as pending.
17. **Gäste-WLAN card:**
    - QR image (only when the image entity is available);
    - name `Gäste-WLAN`;
    - state dot plus `an · <clients> Gerät(e)` / `aus`;
    - `Ausschalten` / `Einschalten` (`switch.turn_off` / `turn_on`);
    - a regenerate-password icon button with a confirm dialog (only when the button entity is available).
18. **Printer row** at the bottom: icon, `3D-Drucker`, the status line from req. 22, and a round power button for the plug (same lock as req. 21). Tap on the row opens the printer sheet.
19. No NAS card, no WLAN client counts card.

### Printer sheet (mockups `Drucker`, `DruckerFertig`, `DruckerFehler`, `DruckerAus`)

20. The sheet state is derived in this order:
    - `off`: plug configured and `off`.
    - `starting`: plug on, `print_status` `offline`/`unavailable`/`unknown`, plug on for < 5 min.
    - `disconnected`: same, but ≥ 5 min; without a plug, `offline`/`unavailable` is always `disconnected` (text `Keine Verbindung zum Drucker.`).
    - `error`: req. 13 error rule.
    - `printing`: running/prepare/init/slicing/pause.
    - `finished`: `finish`.
    - `idle`: otherwise.
21. Plug power button:
    - Locked (dimmed, lock badge, no action) in `printing` and `error`, and while any nozzle temperature is ≥ 50 °C.
    - Turning off asks for confirmation; turning on does not.
22. Head subtitle per state:
    - `Druckt · <stage label>` / `Pausiert · <stage label>`
    - `Fertig`, `Fehler`, `Bereit`, `Aus`
    - `startet …`, `nicht verbunden`
    - Labels come from `hass.formatEntityState`.
23. **`printing`:**
    - Hero ring with `<progress> %` and `Schicht <current>/<total>` (layer shown only here). Next to it the cover image (`cover_image` entity picture, fallback cube icon), `subtask_name`, `<weight> g`, `fertig um HH:MM`, `noch <h> h <mm> min`.
    - Status row: dot, `Druckt` / `Pausiert` and `· Arbeitsschritt: <stage label>`, right `speed_profile` label.
    - Controls grid: Pause/Fortsetzen and Stopp only when matching button entities exist on the printer device (translation_key matching `/pause|resume|stop/`; Stopp requires hold-to-confirm), plus Licht (`chamber_light` toggle) and Strom (locked).
    - 4 temperature pills (Düse L, Düse R, Bett, Druckraum; values ≥ 50 ° in orange).
    - AMS card.
    - Plug row `Steckdose · <power> W`.
    - Live camera on top only when a `camera` entity exists on the printer device.
24. **`finished`:** green check hero with `fertig um <end_time HH:MM>`, `subtask_name`, `<weight> g`; bed hint row while `bed_temp` ≥ 35 (`Druckbett <t>°` / `noch abkühlen lassen · unter 35° entnehmen`); Licht and Strom tiles; note `Düse ist abgekühlt (<t>°) · Ausschalten frei` when unlocked.
25. **`error`:**
    - Red banner with the error text from req. 13.
    - Progress ring (grey), name, `Schicht <n> von <total> · angehalten`.
    - Fortsetzen/Abbrechen buttons when resume/stop buttons exist, else the text `Am Drucker oder in Bambu Handy fortsetzen.`
    - Licht tile, Strom tile (locked).
26. **`off` / `starting` / `disconnected` / `idle`:**
    - Mockup `DruckerAus` layout: centred icon, status text, `Einschalten` button (off only).
    - For `starting`: `Drucker startet, das dauert etwa 1 min.`
    - For `disconnected`: `Steckdose an, aber keine Verbindung zum Drucker.`
    - `idle` additionally shows the AMS card, Licht and Strom.
    - Last print row (`subtask_name`, `end_time`) when known.
    - `Diesen Monat` energy row only when a plug energy sensor is configured (`printer_plug_energy`), using the existing statistics helper.
27. **AMS card:**
    - title `AMS`;
    - right: `trocknet · noch <remaining_drying_time>` while `drying` is on, else `<humidity> % Feuchte`;
    - 4 slots: colour circle from `color`, `type`, `name`;
    - active slot gets the purple ring; empty slots dashed with `leer`;
    - remaining % under the name when `remain_enabled`.

### Housekeeping

28. README documents the `technik` options, auto-detection, visibility and the two disabled UniFi entities.
29. No real names, hostnames or serials in code, tests or docs (repo PII rule).

## Design

- New logic modules (pure, unit-tested):
  - `src/logic/technik.ts`: tech-user check, source detection, services + groups + debounce, Pi-hole and guest WLAN state, problem count, Technik Aktuell items.
  - `src/logic/printer.ts`: entity lookup by translation_key, state derivation (req. 20), power lock (req. 21), AMS slots.
- New sheets `src/sheets/technik.ts` and `src/sheets/printer.ts`; new `SheetState` ids `{ id: 'technik' }` and `{ id: 'printer' }`.
- `NowItem` gets optional `progress?: number` (0–1, bottom bar) and `value?: string` (right-aligned text). Existing items are unaffected. Technical items have no button except `OK` (fertig) and `Einschalten` (Pi-hole); the others open their sheet on tap. All technical item ids are added to `WIDE` in `nowLayout()` so they render full width.
- `NowTap` gains `'technik'` and `'printer'`.
- `nowItems()` appends the technical items only for tech users. The Übersicht header renders the button.
- `hass.formatEntityState` is optional on the `HomeAssistant` type; fall back to the raw state.
- `HomeAssistant.user` gains `id` and `is_admin`; `HassEntityRegistryEntry` gains `translation_key`.
- Pause state for Pi-hole and dismissed "fertig" items: card memory, plus `localStorage` (wrapped in try/catch) for the dismissal, keyed by the job's `end_time`.
- Visual reference: `docs/design/technik-hub/`. Spacing, radii and colours are the existing design tokens in `src/styles.ts`.
- Left to the builder: component split inside the sheets, icon paths, exact CSS.

## Error handling

- Any missing or `unavailable` entity renders `–` or hides its element; it never throws.
- The service-call failure path is the existing `ctx.call` (toast).
- A printer device with no `print_status` means no printer section.
- Unknown `print_status` values map to `idle`.
- Regex errors in `service_groups` are ignored (that group is skipped).

## Testing

Vitest, new fixture `test/fixture-technik.ts`:
- a fake printer device `x2d_musterdrucker` with translation-keyed entities;
- an AMS with 4 trays;
- plug `switch.drucker_steckdose`;
- Pi-hole, a guest WLAN and 6 Kuma monitors including 3 `DNS (…)`;
- users Max (admin) and Anna.

Tests prove:
- tech-user rules (list by id/name, admin default, `technik: false`);
- every printer state in req. 20, including the 5 min boundary;
- the power lock incl. 50 °C;
- the service debounce at 3 min, groups, cert < 7 d, maintenance;
- Pi-hole 60 min rule;
- every technical Aktuell item and its absence for non-tech users;
- the problem count;
- that existing Aktuell items are unchanged.

`npm run check` green.

## Out of scope

- Pause/stop/camera wiring beyond showing them when entities exist.
- Switching the printer to LAN mode.
- A NAS card.
- WLAN client counts.
- Response-time charts.
- Uptime Kuma tag grouping.
- The rejected 3D printer card.
- Changing any HA config (enabling the UniFi QR/password entities is the owner's step).
- Anti-goal: anything technical visible to a non-tech user.

## Assumptions

- Technical Aktuell items sort after the household ones (my call; the mockup showed the print first only as an example).
- Pi-hole "off" becomes a problem after 70 min: the longest pause is 1 h, plus a grace period for the integration's polling; the integration does not expose a pause end.
- Pi-hole pause countdown is per device (card memory); other phones just see "aus".
- "Print finished" and a `failed`-only error stay at most 12 h after `end_time`; dismissal is per browser.
- The DNS group is red when any member is down, because both DNS servers sit behind the VRRP address (owner's answer).
- Error banner sub-line is `seit HH:MM` from `last_changed`; no repair hint line.
- "Diesen Monat" is the calendar month in kWh, no price.
- The power lock threshold is a nozzle temperature of 50 °C.
- A monitor down < 3 min shows as pending.
- Without `technik.users`, admins are tech users.
- Only the first AMS unit is shown.
