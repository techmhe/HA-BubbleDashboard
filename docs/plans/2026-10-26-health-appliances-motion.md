# Sensor Health, DWD-only Warnings, Running Appliances and Motion Implementation Plan

Status: done
Spec: docs/specs/2026-10-26-health-appliances-motion.md
Branch: plan/health-appliances-motion
Review: final

**Goal:** Aktuell warns about offline sensors and stale backups, and weather warnings come
only from DWD. Running appliances show as running, and state-driven micro-animations make
the card feel polished.
**Architecture:** Two new pure logic modules (`health.ts`, `appliances.ts`) feed `nowItems()`.
Their async inputs (Alarmo sensor list, appliance power history) are loaded by the card and
handed in through `PageContext`, like `heating()`. Animations are CSS keyframes in
`baseStyles` plus animated icon helpers in `src/components/motion.ts`.
**Tech stack:** Lit 3, TypeScript, Vite, Vitest (node env, `test/template-text.ts` for render
assertions).

## Global constraints

- UI copy German; code, comments, docs, commits English (Conventional Commits).
- No real names, town, hostnames, email or serials in `src test README.md dev docs`; fixtures
  use Max / Anna / Musterstadt.
- Never edit existing tests except the four named in Task 1.
- Every animation stops under `@media (prefers-reduced-motion: reduce)`; none loops faster
  than 0.6 s per cycle; animations run only while their state is true.
- Service calls put entities in `target`, never in `data`.
- Check command: `npm run check` (tsc + vitest + vite build). Expected: exit 0.

## Review focus

1. A group window where one of three contacts is `unavailable`: one item for that contact,
   no room item. All three unavailable: only the room item (Task 2 test
   `group window dedup`).
2. Ten sensors offline at once after a Zigbee restart: exactly one collapsed item, Aktuell
   not flooded (Task 2 test `collapses above three`).
3. A non-admin (Anna) on the dashboard: `alarmo/sensors` rejects, no error toast, room
   temperature and front door health still work (Task 2 test `alarmo rejected`).
4. A dishwasher in its 25-min low-power drying phase: still `läuft` while the last ≥ 10 W
   reading is < 15 min old. After "OK" on fertig with a 2-W standby trickle, it stays hidden
   (Task 4 tests `drying pause`, `after done`).
5. Reduced motion on: no running animation anywhere (Task 5 test `reduced motion` asserts
   that every new keyframe class sits under the reduce media query).

## Tasks

- [x] **Task 1: DWD-only weather warnings**

  **Files:** modify `src/logic/overview.ts` (storm branch ~l.201-210, `STORM_KMH`),
  `src/logic/weather.ts` (`STORM_GUST`, `stormHint`), `src/sheets/weather.ts` (storm row),
  `src/logic/entities.ts` (`gusts` default), `README.md` (gusts lines); tests
  `test/robby-weather.test.ts:35-38`, `test/entities.test.ts:11,27-28`,
  `test/overview.test.ts:112`, `test/warnings.test.ts`.
  **Interfaces:** removes `stormHint`, `STORM_GUST`, `STORM_KMH`, `ENTITY_DEFAULTS.gusts`.

  1. Add test `no gust fallback` in `test/warnings.test.ts`: hass with `sensor.musterstadt_windboen`
     = `90` and no DWD warnings gives no item with id `storm` from `nowItems`. With a DWD
     level-2 warning, the `warn` item is still there.
  2. Apply the approved test changes (spec "Testing"): delete the stormHint test
     (`robby-weather.test.ts:35-38`) and the `gusts` default assertion (`entities.test.ts:11`).
     Rewrite `entities.test.ts:27-28` so that `entities: { gusts: 'sensor.x' }` loads and
     `nowItems` has no `storm` item. Remove only the storm assertion in
     `overview.test.ts:112`.
  3. Run `npx vitest run test/warnings.test.ts`. Expected: FAIL (storm item present).
  4. Remove the fallback code, the constants, the sheet row and the `gusts` default. Keep
     `EntityKey` tolerant: an unknown `entities.gusts` key is ignored.
  5. Run `npm run check`. Expected: exit 0.
  6. Commit: `feat(weather): use DWD warnings only`.

- [x] **Task 2: Sensor health items**

  **Files:** create `src/logic/health.ts`; modify `src/types.ts` (`CardConfig.health`),
  `src/pages/context.ts` (`alarmoSensors`), `src/ha-start-dashboard.ts` (loader),
  `src/logic/overview.ts` (`nowItems` param + `WIDE` gets `health`), `src/pages/overview.ts`;
  test `test/health.test.ts`, fixture additions in `test/fixture-health.ts`.
  **Interfaces:** produces
  - `type AlarmoSensor = { entity_id: string; type: string; enabled: boolean }`;
  - `CardConfig.health?: { extra?: string[]; exclude?: string[] }`;
  - `PageContext.alarmoSensors(): AlarmoSensor[]` (cached, `[]` until loaded or on error);
  - `healthItems(hass, config, rooms: Room[], now: Date, alarmo: AlarmoSensor[]): NowItem[]`;
  - `nowItems(..., alarmo: AlarmoSensor[] = [])` appends `healthItems` after the window items.

  1. Write failing tests in `test/health.test.ts` (fixture: Alarmo list with motion, door,
     window and tamper types; a group window `binary_sensor.fenster_wohnzimmer` with three
     member contacts in its `entity_id` attribute):
     - `titles by kind`: unavailable motion → `Bewegungsmelder prüfen`; `door` with `tur` →
       `Türsensor prüfen`; `window` → `Fenstersensor prüfen`; room temperature →
       `Temperatursensor prüfen`; text `<room> · Sensor nicht erreichbar`.
     - `tamper ignored`, `unknown is not offline`, `health.exclude`/`health.extra`.
     - `room window dedup`: a room's single-contact `window` unavailable → no health item
       (the existing `sensor:` item stays); the front door unavailable → `Türsensor prüfen`.
     - `group window dedup`: one member unavailable → one item for it; group unavailable →
       no member items.
     - `snooze`: snoozed in `input_text.fenster_ignorieren` → hidden; action label
       `1 h ignorieren` writes `snoozeValue(...)`.
     - `collapses above three`: 4 offline → one item `4 Sensoren offline`, names joined
       with ` · `, no action.
     - `alarmo rejected`: `alarmo = []` still reports room temperature and front door.
  2. Run `npx vitest run test/health.test.ts`. Expected: FAIL, module missing.
  3. Implement `healthItems`. Item ids `health:<object_id>` and `health-many`; colour `C.grey`
     as the window item; tap `{ room: slug }` when the sensor maps to a room (area match or
     room temperature/window), else `{ more: entity_id }` (add `more` to `NowTap` if missing,
     handled in `itemTap` via `ctx.moreInfo`).
  4. Card loader: `hass.callWS({type: 'alarmo/sensors'})`, map to `AlarmoSensor[]`; reload
     every 30 min; on reject store `[]` silently.
  5. Run `npm run check`. Expected: exit 0.
  6. Commit: `feat(overview): warn about offline sensors`.

- [x] **Task 3: Backup warning**

  **Files:** modify `src/logic/technik.ts` (`backupState`), `src/logic/technik-now.ts`,
  `src/sheets/technik.ts` (row), `src/logic/entities.ts` (`backup_last` key); test
  `test/technik-backup.test.ts`.
  **Interfaces:** produces
  `backupState(hass, config, now): { entity: string; at: number; ageH: number; stale: boolean } | null`,
  `BACKUP_STALE_H = 36`; `technikProblems(...)` adds 1 when stale.

  1. Failing tests: sensor (platform `backup`, translation_key
     `last_successful_automatic_backup`) at 35 h → no item; at 37 h → tech user (Max) item
     `Backup veraltet`, text `letztes erfolgreiches vor 1 Tag 13 h` (whatever `durationText`
     gives for 37 h, asserted via `durationText(37*60)`); Anna → none; `unavailable` → none.
     Technik sheet text contains `Backup` and `vor` when stale and `letztes erfolgreiches
     heute HH:MM` when fresh; `technikHeadline` count includes it.
  2. Run `npx vitest run test/technik-backup.test.ts`. Expected: FAIL.
  3. Implement. Item id `backup` (add to `WIDE`), red, tap `{ more: entity }`. Sheet row sits
     above the printer row.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(technik): stale backup warning`.

- [x] **Task 4: Running appliances**

  **Files:** create `src/logic/appliances.ts`; modify `src/types.ts`
  (`CardConfig.appliances`), `src/pages/context.ts` (`applianceRuns`),
  `src/ha-start-dashboard.ts` (history loader), `src/logic/overview.ts`; test
  `test/appliances.test.ts`.
  **Interfaces:** produces
  - `interface Appliance { slug: string; name: string; power: string; done: string; kind: 'washer' | 'dryer' | 'dishwasher' | 'other' }`;
  - `findAppliances(hass, config): Appliance[]`;
  - `RUN_W = 10`, `PAUSE_MIN = 15`;
  - `type PowerPoint = { t: number; w: number }`;
  - `applianceRun(hass, a: Appliance, now: Date, history: PowerPoint[] | undefined): { running: boolean; since?: number; power: number } `;
  - `PageContext.applianceRuns(): Record<string, PowerPoint[]>` (keyed by power entity, 6 h
    of history loaded once, then extended from live state changes);
  - `nowItems` appends `appliance:<slug>` items (half width, `C.blue`, tap `{ more: power }`).

  1. Failing tests: detection from `input_boolean.<slug>_fertig` + `sensor.<slug>_power`,
     never `_device_power`; kind from slug (`waschmaschine` washer, `trockner` dryer,
     `spulmaschine` dishwasher); config override. Run cases: `running now` (2200 W, title
     `Spülmaschine läuft`, text `seit 18:05 · 2.209 W` with de-DE number format);
     `drying pause` (2 W now, last ≥ 10 W 12 min ago → running); `stopped` (last ≥ 10 W
     20 min ago → none); `done wins` (fertig `on` → only the fertig item); `after done`
     (fertig turned off 5 min ago, 2 W, earlier readings ≥ 10 W before that → none);
     `no history` (2200 W, history undefined → text `2.209 W`).
  2. Run `npx vitest run test/appliances.test.ts`. Expected: FAIL.
  3. Implement; `since` = first ≥ RUN_W point after the last gap ≥ PAUSE_MIN below RUN_W.
     Loader: one `history/history_during_period` call for all power entities
     (`minimal_response`, `no_attributes`, 6 h), cached; on error `{}`.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(overview): show running appliances`.

- [x] **Task 5: Device micro-animations**

  **Files:** create `src/components/motion.ts`; modify `src/styles.ts` (keyframes), the
  purifier/dehumidifier icon spots (`src/pages/rooms.ts`, `src/sheets/room.ts`,
  `src/pages/climate.ts`, `src/sheets/device.ts`: grep `purifier|fan\.|humidifier`), the
  Robby bubble (`src/pages/overview.ts`), the Klima heating circle (`src/pages/climate.ts`
  `.kroom.heat`), the appliance item icon (`src/pages/overview.ts` `renderItem`); test
  `test/motion.test.ts`.
  **Interfaces:** produces
  - `fanIcon(on: boolean, level: 1 | 2 | 3 | 'auto', size: number, stroke: string): TemplateResult`
    (class `spin s1|s2|s3`, 2.4 s / 1.4 s / 0.8 s);
  - `applianceIcon(kind: Appliance['kind'], running: boolean, size, stroke)` (drum `tumble`
    1.2 s; dishwasher `spray` pulse);
  - `dropIcon(on, size, stroke)` (`bob`);
  - CSS classes `wobble` (Robby cleaning) and `breathe` (3 s, heating circle).

  1. Failing tests: `fanIcon(true, 3, …)` text contains `spin s3`, `fanIcon(false, …)` has no
     `spin`. Purifier level mapping from `percentage`/`preset_mode` (reuse `purifierState`).
     Rooms page renders `spin` only for an `on` purifier. Robby bubble has `wobble` only
     when `cleaning`. Klima heating room has `breathe` only when heating. `reduced motion`:
     parse `baseStyles.cssText`; every class using `animation:` from this task also appears
     inside the `prefers-reduced-motion: reduce` block with `animation: none`.
  2. Run `npx vitest run test/motion.test.ts`. Expected: FAIL.
  3. Implement. Only the moving part of an icon (blades, drum, spray dots, droplet) carries
     the class; `transform-box: fill-box; transform-origin: center`.
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(ui): state-driven device animations`.

- [x] **Task 6: Animated weather icon**

  **Files:** modify `src/components/motion.ts` (`weatherAnim`), `src/components/ui.ts`
  (`SheetOptions.iconTemplate?: TemplateResult`, used instead of `iconPath` when set),
  `src/pages/overview.ts` (weather pill), `src/sheets/weather.ts` (head), `src/styles.ts`;
  test `test/motion.test.ts`.
  **Interfaces:** produces
  `weatherAnim(condition: string, size: number, stroke: string): TemplateResult`. Classes:
  `rain` (rainy, pouring, lightning-rainy), `snow` (snowy, snowy-rainy), `drift`
  (cloudy, partlycloudy), `rays` (sunny, 20 s), `flash` (lightning, every 6 s); other
  conditions are a static `weatherIcon` path.

  1. Failing tests: one assertion per class/condition pair above; `clear-night` and `fog`
     give no animation class; the weather sheet head uses the template (contains `rain` when
     rainy).
  2. Run `npx vitest run test/motion.test.ts`. Expected: FAIL.
  3. Implement with separate SVG groups (cloud body static, drops/flakes animated in a
     clipped area under the cloud).
  4. Run `npm run check`. Expected: exit 0.
  5. Commit: `feat(weather): animated weather icon`.

- [x] **Task 7: Docs, dev preview, visual check**

  **Files:** modify `README.md` (health options `health.extra/exclude`, backup row and
  36 h rule, `appliances:` option and run rule, animations and reduced motion, DWD-only),
  `dev/main.ts` (`?health` and `?appliances` flags: one offline Alarmo motion sensor, the
  dishwasher at 2 200 W, a rainy weather state).

  1. Update README and the dev flags.
  2. Run `npm run check`. Expected: exit 0. Run the PII grep. Expected: no output.
  3. Local preview at 390 px: check `?health`, `?appliances` and `?page=climate`. Then with
     reduced motion emulated (Chrome DevTools rendering), check that nothing moves.
  4. Commit: `docs: sensor health, appliances and animations`.
