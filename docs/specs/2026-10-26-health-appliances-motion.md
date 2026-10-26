# Sensor Health, DWD-only Warnings, Running Appliances and Motion Spec

Status: approved

## Goal

The dashboard should say when something it relies on stops working, before that causes a
wrong reading (an offline window sensor kept the airing timer running for a whole cycle).
It should warn about weather only from official DWD warnings. It should show when the
washer, dryer or dishwasher is running. And small, state-driven animations should make the
card feel more polished without becoming noisy.

## Context

- **Offline window sensors today** (`src/logic/overview.ts`, `nowItems`): when a room's
  `window` entity is `unavailable`, Aktuell shows a grey item `Fenstersensor prüfen`,
  text `<room> · Sensor nicht erreichbar`, tap opens the room, action `1 h ignorieren`.
  The action writes the entity into `input_text.fenster_ignorieren` (`window_snooze`)
  via `snoozeValue()` in `src/logic/window-state.ts`. The new sensor warnings copy this
  pattern.
- **Alarmo** exposes its sensors only through the WebSocket command
  `{type: 'alarmo/sensors'}`, which works for admins. Verified 2026-10-26: it returns a map
  keyed by entity id with `type` (`motion`, `door`, `tamper`, …) and `enabled`. The
  `alarm_control_panel` attributes carry no sensor list.
- **Backups:** core `backup` integration;
  `sensor.backup_letztes_erfolgreiches_automatisches_backup` (device_class `timestamp`,
  integration `backup`).
- **DWD:** `weatherWarnings()` in `src/logic/weather.ts` already reads the
  `dwd_weather_warnings` sensors. Aktuell shows `Warnung:` / `Unwetterwarnung:` items from
  them. Two fallbacks remain and are to be removed:
  - the Aktuell item `Sturmböen` (`gusts` ≥ `STORM_KMH` 60 in `overview.ts`);
  - `stormHint()` in the weather sheet (gusts now or a forecast day ≥ `STORM_GUST` 60).
- **Appliances:** `input_boolean.{waschmaschine,trockner,spulmaschine}_fertig` exist (done
  flags, set by an HA automation). Measured power sensors are `sensor.<x>_power` (W);
  Powercalc sensors `sensor.<x>_device_power` also exist and must not be used.
- **Existing animations:** sheet rise/fade (`components/ui.ts`), energy flow dashes
  (`pages/energy.ts`), the airing pulse (`pages/climate.ts`). All honour
  `prefers-reduced-motion`.

## Requirements

### Sensor health (Aktuell)

1. *Watched sensors* are the union of:
   - every enabled Alarmo sensor from `alarmo/sensors` (all types except `tamper`);
   - every room's temperature sensor (`room.temperature`);
   - the front door (`ent(config, 'front_door')`);
   - every entity listed in a new option `health.extra: [entity_ids]`;
   - minus entities in `health.exclude: [entity_ids]`.
2. A watched sensor is *offline* when its state is `unavailable` (same rule as windows,
   no delay). `unknown` does not count.
3. A sensor the existing window loop already warns about (a room's `window` entity, except
   the front door, which that loop skips) is skipped; the existing item stays as it is. The
   front door therefore gets its own `Türsensor prüfen` item.
   Group windows (e.g. a room `window` that is a group of three contacts): Alarmo lists the
   members, not the group. A member gets its own item while the group is still `on`/`off`.
   When the group itself is `unavailable` (all members down), the room item covers it and
   its members are skipped, so nothing is reported twice. Members come from the group's
   `entity_id` attribute.
4. Each offline sensor gives one grey Aktuell item, exactly like the window one:
   - title by kind: `Fenstersensor prüfen` (Alarmo type `window`, or `door` whose id/name
     does not contain `tur`/`tür`), `Türsensor prüfen` (`door` with `tur`/`tür`, and the
     front door), `Bewegungsmelder prüfen` (`motion`), `Temperatursensor prüfen` (room
     temperature), `Sensor prüfen` (anything else);
   - text `<area or room name> · Sensor nicht erreichbar`;
   - action `1 h ignorieren`, the same `input_text.fenster_ignorieren` snooze.
     Snoozed sensors are hidden until the snooze ends;
   - tap: the room sheet when the sensor maps to a room, else HA's more-info.
5. More than 3 offline sensors collapse into one item `<n> Sensoren offline`, text = the
   names joined with ` · `, no action, tap opens more-info of the first sensor.
6. Visible to every user (like the window items). When `alarmo/sensors` fails (non-admin,
   no Alarmo), only the other sources in req. 1 are watched. No error is shown.
7. The Alarmo list loads once when the card starts and is refreshed every 30 min.

### Backup warning (Aktuell)

8. Source: the `backup` integration's sensor with `translation_key`
   `last_successful_automatic_backup`, else the option `entities.backup_last`.
9. When it is older than 36 h, a tech user (see `isTechUser`) sees a red Aktuell item
   `Backup veraltet`, text `letztes erfolgreiches vor <duration>` (`durationText`).
   Tap opens more-info of the sensor. The backup item also counts as a Technik problem
   (red dot, headline). The Technik sheet gets a `Backup` row above the printer row:
   `letztes erfolgreiches <heute HH:MM | gestern HH:MM | D.M. HH:MM>`, red with
   `vor <duration>` when older than 36 h.
10. `unknown`/`unavailable`/missing sensor: no item.

### DWD only

11. Remove the `Sturmböen` Aktuell item, `STORM_KMH`, `stormHint()`, `STORM_GUST` and the
    storm row in the weather sheet. Weather warnings come only from `weatherWarnings()`.
12. The `gusts` entity option has no other user, so it is removed from the entity defaults
    and the README. An old config that still sets `entities.gusts` loads without error
    (the key is ignored).

### Running appliances

13. Appliances are auto-detected from `input_boolean.<slug>_fertig` with a matching
    `sensor.<slug>_power`. A new option `appliances: [{name, power, done}]` overrides the
    detection.
14. An appliance is *running* while its power is ≥ 10 W, or was ≥ 10 W at some point in the
    last 15 min (pauses, dishwasher drying), and its done flag is `off`. Only power readings
   newer than the done flag's `last_changed` count, so after "OK" the appliance needs a new
   ≥ 10 W reading before it shows as running again. The start time is
    the first ≥ 10 W reading after the last stretch of ≥ 15 min below 10 W. It comes from
    one history fetch (last 6 h) when the card loads, then from live states.
15. A running appliance gives an Aktuell item (half width), colour blue:
    - title `<name> läuft`;
    - text `seit HH:MM · <power> W`;
    - an animated icon (req. 18);
    - tap opens more-info of the power sensor.
16. The running item and the existing `<name> fertig` item never show at the same time
    (done wins).

### Motion

17. All animations are CSS only, run only while the state they show is true, and stop
    under `prefers-reduced-motion: reduce`. No animation loops faster than 0.6 s per cycle.
    Nothing animates for attention alone.
18. Animations:
    - **Air purifier** (fan icon, Räume tile, room card, Klima purifier icon): rotation
      while `on`. Speed by level (Stufe 1/2/3 or `percentage`): 2.4 s / 1.4 s / 0.8 s per
      turn; `auto`/`sleep` at 2.4 s.
    - **Washer / dryer:** drum ring rotation in the running item icon (1.2 s) with a slight
      tumble.
    - **Dishwasher:** spray dots pulsing in the running item icon.
    - **Robby:** status bubble icon with a small back-and-forth wobble while `cleaning`.
    - **Heating:** a slow glow (3 s breathe) on the orange room circle of heating room
      pills (Klima). No new flame icon; the layout stays as approved.
    - **Weather icon** (Übersicht pill and weather sheet head):
      - falling drops while the condition is `rainy`, `pouring` or `lightning-rainy`;
      - falling flakes for `snowy` / `snowy-rainy`;
      - slow cloud drift for `cloudy` / `partlycloudy`;
      - a slow sun ray rotation (20 s) for `sunny`;
      - a short flash every ~6 s for `lightning`.
    - **Dehumidifier** (Räume tile): the droplet bobs while `on`.
19. Icons that animate get their own SVG parts (drum, drops, rays) so only that part moves.
    The rest of the icon stays still.

### General

20. All copy German, code English. No real names, hostnames or serials in code, tests or
    docs.

## Design

- New logic modules (pure, unit-tested):
  - `src/logic/health.ts`: watched-sensor collection and offline items (reqs. 1–7).
  - `src/logic/appliances.ts`: detection and run detection (reqs. 13–16).
- Backup: extend `technikItems()` / `technikProblems()` in `src/logic/technik-now.ts`.
- Alarmo sensors and the appliance history are loaded by the card (like `heating()`) and
  passed in through `PageContext` (`alarmoSensors()`, `applianceRuns()`), so the logic stays
  pure.
- Animations live with the components that draw the icons. Shared keyframes go into
  `baseStyles` (`src/styles.ts`). Animated icon variants go into `src/icons.ts` as small
  template helpers (e.g. `animatedIcon('drum', …)`).
- Left to the builder: exact SVG paths, easing, the split of the weather icon into parts.

## Error handling

- `alarmo/sensors` rejects or times out: treat as an empty list and retry at the next
  30-min refresh.
- History fetch fails: appliance runs fall back to live state only (running = power ≥ 10 W
  now; no `seit`, text is `<power> W`).
- Snooze helper missing: items without the `1 h ignorieren` action (as windows do today).

## Testing

- Unit tests:
  - health items for each source, kind titles, window dedup, snooze, the > 3 collapse;
  - backup at 35 h / 37 h / unknown, non-tech user;
  - no storm item at gusts 90 km/h, DWD item still shown;
  - appliance running / pause within 15 min / stopped / done wins / no history.
- Render tests (template text): the animation classes appear only in the matching state,
  e.g. `spin` on a purifier only when `on` and `rain` on the weather icon only when rainy.
- Existing tests changed with the owner's approval (2026-10-26), because the gust fallback
  is removed:
  - `test/robby-weather.test.ts:35-38` (stormHint): deleted;
  - `test/entities.test.ts:11` (`gusts` default): deleted;
  - `test/entities.test.ts:27-28` (storm item): rewritten so an old config with
    `entities.gusts` loads and gives no storm item;
  - `test/overview.test.ts:112`: only the storm assertion removed, battery and filter checks
    stay.
- Visual check on `start-v2` at 390 px, dark, in Chrome, and with reduced motion enabled.

## Out of scope

- Firmware/HA update notices, device-health list in Technik, battery warnings changes.
- Sound, haptics, or any animation on numbers changing.
- Controlling appliances.
- Weather animations for the forecast rows (only the current-condition icon).

## Assumptions

- Sensor warnings are visible to every user (like windows); the backup warning only to tech
  users. My call: a backup is technical, sensors affect everyone.
- One item per offline sensor, collapsed above 3. My call, so a Zigbee outage does not
  flood Aktuell.
- The 10 W / 15 min run thresholds. My call; they cover dishwasher drying phases.
- Offline is immediate (no debounce), as the windows do today, per the owner's "exactly
  like the window sensors".
