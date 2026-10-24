# Start Dashboard

A phone-first Home Assistant dashboard in **one self-contained Lovelace card**
(`custom:ha-start-dashboard`). It renders the approved mockups in `design/` with live data:
Übersicht, Klima, Räume, Energie and Schutz, with pop-ups as bottom sheets inside the card.
UI language is German.

No dependency on Bubble Card, button-card or a theme: the card owns its layout, colours and
font, and does not wrap itself in `ha-card`.

## Status

| Milestone | Content | State |
|---|---|---|
| 1 | Scaffold, build, release, **Übersicht** (status bubbles, Aktuell, Zusammenfassung, alarm sheet) | done |
| 2 | **Klima**, room card, history graph, all rooms, airing | done |
| 3 | **Räume** + long-press sheets (light, plug/switch, purifier, dehumidifier) | done |
| 4 | **Energie** (live flow, today, consumers) + **Schutz** (alarm, door camera, windows & doors) | done |
| 5 | **Robby** and **weather** pop-ups | done |


## Layout decision: one panel view, internal tab bar

The card is meant for **a single panel view** (`panel: true`). It renders the mockup's
segmented tab bar itself and switches pages internally, so switching tabs never reloads
an HA view and the bar looks exactly like the mockup. `page:` sets the tab shown first;
`nav: false` hides the bar if you prefer one HA view per tab.

Gestures:

- **Tab bar**: tap a tab, or slide your finger along the bar. A glass lens follows the
  finger, with a light haptic tick per tab; the page switches on release.
- **Long-press**: opens the device pop-up; the click a phone sends when the finger lifts
  is swallowed, so the new pop-up does not close right away.
- **Pop-ups**: close with the ✕, by tapping outside, or by pulling the sheet down at its
  grabber or header (or anywhere when the content is scrolled to the top). A short pull
  springs back; a pull of a quarter of the sheet (80–140 px) or a quick flick closes it.
- **Stacked pop-ups**: a pop-up opened from another one (weather → chart, room → history
  or device, device → power chart) sits on top of it; the one underneath stays visible, shrunk and dimmed. Pulling
  down or tapping outside goes back one level, ✕ closes all.
- **Scrolling**: switching tabs starts the new page at the top; tapping the current tab
  scrolls it back up.

```yaml
views:
  - title: Start
    path: start
    panel: true
    cards:
      - type: custom:ha-start-dashboard
```

## Installation

### HACS

HACS → ⋮ → Custom repositories → `https://github.com/techmhe/HA-BubbleDashboard`, type
**Dashboard**, then download "Start Dashboard". HACS registers the resource
(`/hacsfiles/HA-BubbleDashboard/ha-start-dashboard.js`) itself.

HACS installs from the GitHub releases of this repository.

### Manual / direct resource

Copy `dist/ha-start-dashboard.js` from a release to `/config/www/ha-start-dashboard/`
and add the resource (Settings → Dashboards → ⋮ → Resources):

```
/local/ha-start-dashboard/ha-start-dashboard.js?v=0.1.0   (JavaScript module)
```

Bump the `?v=` query on every update so browsers and the companion app fetch the new file.

## Configuration

Everything is optional. Rooms, lights and devices are derived from the HA registries.

```yaml
type: custom:ha-start-dashboard
page: overview          # overview | climate | rooms | energy | security
nav: true               # internal tab bar
load_font: true         # inject the Rubik web font into the page
header: hide            # HA toolbar: hide | blend (transparent) | default; back in edit mode (?edit=1)
entities:               # override any entity/script; defaults shown are this home's
  weather: weather.musterstadt
  gusts: sensor.musterstadt_windboen
  alarm: alarm_control_panel.alarmo
  vacuum: vacuum.robby
  vacuum_status: sensor.robby_status
  vacuum_quick: button.robby_eg_saugen          # long-press on the Robby bubble
  front_door: binary_sensor.fenstersensor_haustur_contact
  grid_import: sensor.stromverbrauch_shelly_messung
  grid_export: sensor.ruckeinspeisung_shelly_messung
  waste: sensor.naechster_abfalltermin
  heating: input_boolean.heizbetrieb
  outdoor_temp: sensor.aussen_temperature
  outdoor_dew: sensor.aussen_taupunkt_messung
  ac: climate.flur_1_og_klimaanlage
  airing_timer: timer.luften
  airing_duration: sensor.stossluften_dauer
  airing_start: script.luften_starten
  preset_all: script.heizung_preset_alle
  all_rooms_apply: script.alle_raume_anwenden
  all_rooms_temperature: input_number.alle_raume_temperatur
  all_rooms_selection: input_text.alle_raume_auswahl
  all_rooms_duration: input_select.alle_raume_dauer
  delayed_off: script.gerat_verzogert_ausschalten   # fields entity, minutes
  house_power: sensor.hausverbrauch
  pv_power: sensor.solar_total_power                  # + solar power sensors of the energy dashboard
  battery_power: sensor.marstek_venus_a_ac_leistung     # > 0 = battery feeds the house
  battery_soc: sensor.marstek_venus_a_batterie_ladezustand
  pv_today: sensor.pv_heute                            # fallback; normally energy dashboard statistics
  import_today: sensor.netzbezug_heute
  export_today: sensor.einspeisung_heute
  untracked_power: sensor.stromverbrauch_nicht_erfasst
  camera: camera.doorbell01
  camera_motion: binary_sensor.doorbell01_bewegung
  camera_person: binary_sensor.doorbell01_person
  vacuum_battery: sensor.robby_batterie
  vacuum_error: sensor.robby_staubsauger_fehler
  vacuum_map: select.robby_ausgewahlte_karte
  vacuum_mode: select.flur_eg_robby_reinigungsmodus      # vacuum / vac_and_mop / mop
  vacuum_mop: select.robby_wischmopp_intensiat           # mild / standard / intense
  vacuum_selection: input_text.robby_raumauswahl
  vacuum_passes: input_number.robby_durchgange
  vacuum_map_script: script.robby_karte_wahlen           # field karte
  vacuum_room_script: script.robby_raum_umschalten       # field segment
  vacuum_clean_script: script.robby_auswahl_reinigen
  filter_alarms:
    - binary_sensor.flur_1_og_klimaanlage_filteralarm
    - binary_sensor.klima_eg_filter_cleaning_reminder
vacuum_maps:            # Robby rooms per map: segment id -> chip name
  EG: { 16: Küche, 17: Wohnen, 18: Flur, 19: Essen }
  OG: { 16: Büro 1, 17: Büro 2, 18: Flur, 19: WC, 20: Bad }
  Schlafzimmer: { 0: Schlafz. }
vacuum_programs:        # programme tiles; without button → vacuum.start
  - { tag: EG, name: Saugen, color: '#64d2ff', button: button.robby_eg_saugen }
  - { tag: Alle, name: Karte komplett, color: '#7ee8a0' }
pollen: []              # default: every sensor.pollenflug_*
warnings: []            # DWD warning sensors; default: every dwd_weather_warnings sensor
exclude:                # entity ids or integrations (platforms) to leave out
  openings: []          # always excluded: versatile_thermostat, bambu_lab
  consumers: []
names:                  # display-name overrides
  switch.nspanelbuerom_relay_1: Deckenlampe
  switch.nspanelbueroa_relay_1: Deckenlampe
  light.abzugshaube_lichter: Abzugshaube
  light.arbeitszimmer_max_stehlampe_grp: Stehlampe
  light.arbeitszimmer_max_fjallbo_led: Fjällbo LED
rooms:                  # omit for auto-detection
  - slug: arbeitszimmer_max           # sensor.<slug>_temperature/_humidity/_luftung
    name: Büro Max
    climate: climate.vtherm_arbeitszimmer_max
    pm25: sensor.luftreiniger_max_pm25
    purifier: fan.luftreiniger_max
    window: binary_sensor.fenstersensor_arbeitszimmer_max_contact
    areas: [arbeitszimmer_von_max]
    power: [sensor.arbeitszimmer_max_leistung]  # optional, see Räume
    icon: desk                           # desk, bath, bed, door, sofa, pot, tree, home
```

The v0.1 top-level keys `weather`, `alarm`, `vacuum`, `front_door` and `ac` still work;
`entities:` wins when both are set. All service calls put entities in `target:` (never
`entity_id` inside `data:`), following the HA best practices.

### Room auto-detection

Without `rooms:`, every `sensor.<slug>_luftung` becomes a room. For each room the card
looks up the area (`<slug>` as area id, or the area of `sensor.<slug>_temperature`), then
`climate.vtherm_<slug>` (or any climate entity in the area), a `pm25` sensor, a `fan` and a
window/opening binary sensor in the area. Name and floor come from the area. Where the
auto-detection guesses wrong (e.g. Küche & Esszimmer spans two areas), list the room
explicitly; a configured room still auto-fills the fields you leave out.

### What Übersicht shows

- **Status bubbles**: Robby (tap: details, hold: *EG saugen* with confirm), Licht (count of
  lights labelled `dashboard_gerat`, groups excluded; tap: Räume filtered *An*, hold: all off
  with confirm), Energie (grid import or export in W; tap: Energie), Alarm (tap: alarm sheet,
  hold: arm away with confirm). Long-press = 500 ms with haptic feedback.
- **Aktuell** (two columns: urgent items and items with a button full width first, the rest as
  half tiles) shows only what applies, else *Alles ruhig*: alarm triggered, front door open
  ≥ 5 min, DWD warnings in force (else gusts ≥ 60 km/h), airing recommended (*Start* → `script.luften_starten`) or
  running, windows open ≥ 20 min, appliance done (`input_boolean.*_fertig`, *OK* turns it
  off), Robby error / consumable at ≤ 0 min, waste the day before and on the day,
  filter alarms and `*filter_life` < 10 %, batteries < 15 % (skipping Robby, phones, `_plus`).
  Filters and batteries open the *Wartung* sheet: *Getauscht* presses the device's Battery
  Notes `*_battery_replaced` button, *Erledigt* a filter reset button on the device (where
  none exists, the sheet says to reset it on the device).
- **Zusammenfassung**: one pill per room with temperature, humidity, *heizt* / *lüften*, and
  an air-quality dot only for rooms with a PM2.5 sensor (green ≤ 12, yellow ≤ 35, red > 35).

### What Klima shows

- Header: how many rooms heat, worst air quality, *Zentralheizung* toggle
  (`input_boolean.heizbetrieb`).
- Outdoor pill (`sensor.aussen_temperature`, weather humidity, `sensor.aussen_taupunkt_messung`
  vs. the rooms' mean dew point) with the airing minutes (`sensor.stossluften_dauer`);
  tap → airing sheet.
- *Alle Räume*: presets via `script.heizung_preset_alle`; tune icon → *Alle Räume einstellen*
  (sets `input_number.alle_raume_temperatur`, `input_text.alle_raume_auswahl`,
  `input_select.alle_raume_dauer`, then runs `script.alle_raume_anwenden`).
- Rooms per floor with −/Soll/+, state *heizt* / *lüften* / *Soll erreicht* / *Aus*, AQ dot and
  purifier fan icon. The AC (`ac:`, default `climate.flur_1_og_klimaanlage`) sits in its
  area's floor with Kühlen / Trocknen / Aus; tap opens the AC sheet: target −/+, modes,
  fan, presets, swing, the device's switches (outdoor quiet mode first), self-cleaning,
  power from `ac_power` (default `sensor.klimaanlage_power`).
- −/+ change the target optimistically and send one `climate.set_temperature` after 0.7 s
  without taps (instead of `script.heizung_schritt` per tap, which drops fast repeated taps).

### What Räume shows

- Header: lights and other devices that are on; *Licht aus* turns off every labelled light
  that is on. Filter *Alle* / *An* / one per floor (the Licht bubble opens *An*).
- One card per room: the climate rooms plus every other area with a `dashboard_gerat`
  device (e.g. Garten), EG first, rooms without a floor last. Card: *x von y an*, a pill with
  temperature · humidity · room power (tap → room card), the area's scenes, and a 3-column
  device grid (lights in their current colour or white tone, else yellow; devices green;
  unavailable dashed; tile shows brightness or
  current power).
- Room power: `power:` from the room config, else `sensor.<slug>_leistung`, else the sum of
  `sensor.<area>_leistung` and `sensor.<part of slug>_leistung` (Küche & Esszimmer = kuche +
  esszimmer). Only sensors labelled `raumverbrauch` count when any carry that label;
  `raumverbrauch_ignorieren` excludes one.
- Device power: the device's measured `*_power` sensor, else Powercalc's `*_device_power`.
- Tap toggles. Long-press (500 ms) opens a sheet by type:
  - dimmable / colour light: brightness slider (in the colour the light shows now: its colour
    or its white tone), colour temperature (`color_temp_kelvin`,
    range from the light), colour swatches (`hs_color`), *Lesen* / *Gemütlich* /
    *Farbschleife* (only if the light has a `colorloop` effect);
  - plug, switch, on/off lamp, fan without presets: toggle, current power (→ the card's power chart), *Ausschalten in*
    30 min / 1 h / 2 h / time via `delayed_off` (`script.gerat_verzogert_ausschalten`);
  - air purifier (fan with presets): Auto / Schlaf / Manuell, *Stufe* only in Manuell
    (`fan.set_percentage`), PM2.5 chip of the room;
  - dehumidifier: toggle, target humidity −/+ (debounced `humidifier.set_humidity`), the
    device's modes, *Ausschalten in* 1 / 2 / 4 h / time.
  From the room card the same sheets open with a way back to the room.

### What Energie shows

- Headline with the part of day and where the power comes from now.
- Live flow PV — Haus — Netz (animated dashes in the direction of flow; import orange,
  export blue) with the battery as a node below the house: a ring shows the charge level, a
  vertical line runs up while it feeds the house and down while it charges (*Akku liefert* /
  *Akku lädt*). Each node opens a chart: PV and grid in kWh per hour/day, Haus = consumption
  (PV + import + battery out − export − battery in), Akku = kWh charged and discharged
  per hour/day (opens on 7 days). *Energie-Dashboard ›*
  opens HA's `/energy`.
- PV now = `pv_power` plus the solar power sensors of HA's energy dashboard.
- *Heute* from the energy dashboard statistics (all solar sources, grid import/export since
  midnight), falling back to the daily utility meters: PV, Netzbezug, Eingespeist,
  consumption (PV + import + battery discharge − export − battery charge; the battery comes
  from the energy dashboard's battery source), autarky and PV self-use. Tiles open a chart (kWh per
  hour for 24 h, per day for 7 / 30 days); the two split bars open autarky / self-use in
  percent per hour or day.
- *Aktuell*: every `*_power` sensor that sits in an area, one per device (measured
  before Powercalc), without the grid meter, PV, battery and house devices, phase and PoE
  readings; plus *Nicht erfasst*. Largest first, all values positive. Tap → chart from the
  device's energy statistic (energy dashboard entry or the device's energy sensor), else
  mean power. The top six are shown; *Alle anzeigen* lists every consumer above 1 W.

### What Schutz shows

- Headline: open count or *Alles ruhig* and *x von y zu*.
- Alarm pill with *zuletzt ausgelöst* (Alarmo's `last_triggered`) and buttons for the other
  modes (Abwesend / Zuhause / Nacht / Aus); the shield opens the alarm sheet.
- Door camera live via HA's `ha-camera-stream` (muted by default; sound and fullscreen
  buttons; on iPhone fullscreen opens HA's camera dialog), motion and person chips,
  *Verlauf* → more-info of the motion sensor.
- Windows & doors: binary sensors with class window/door/opening/garage_door grouped by
  floor and area, groups excluded; interior doors go into `exclude.openings`. Door or window icon comes from the name (*Tür*), since
  many contacts are classed as `door`. Green = closed, red = open, dashed = unavailable.

### Robby and weather pop-ups

- **Robby** (Robby bubble, Robby items in *Aktuell*): status + battery, Start/Pause,
  Station, Orten; consumables (*fällig* at ≤ 0 min, else hours; tap resets via the
  vacuum's *Verbrauchsmaterial zurücksetzen* button after a confirm); six programme tiles
  (`button.press`, *Karte komplett* = `vacuum.start`); *Selbst auswählen*: map tabs
  (`vacuum_map_script`), room chips (`vacuum_room_script`, selection read from
  `vacuum_selection`), mode tiles, suction (`vacuum.set_fan_speed`, hidden for mop only),
  water (hidden for vacuum only), passes 1×/2×, *N Räume starten* (`vacuum_clean_script`).
  All state lives in HA, so the Bubble build and the card stay in sync.
- **Weather** (weather pill, storm item): now with today's range and rain, chips (humidity,
  wind + direction, pressure, UV, visibility; tap → chart of the last 24 h from history and
  the next 24 h from the hourly forecast), DWD warnings (current and advance, from the core
  `dwd_weather_warnings` integration; repeats of one type are merged into one row with the
  highest level and the full time span; compact rows, tap shows the DWD text) or else a storm
  hint (gusts ≥ 60 km/h now or the first forecast day), 6 slots every 2 h, 7 days on a shared
  temperature scale (tap a day → its rain, sunshine, wind and gusts, humidity, UV, 3-hourly
  slots and temperature curve as far as the hourly forecast reaches), pollen.
  Forecasts come from `weather.get_forecasts` (hourly + daily), cached for 15 minutes.

Room card: −/+ target, *heizt · Ventile x %* (`valve_open_percent`), presets with
`preset_temperatures`, the area's scenes (an active scene glows: every entity still matches
the stored scene state, read from the scene config for UI scenes; otherwise the last
activated scene while its entities stay untouched), PM2.5 / dew point / window facts, airing status +
start, and the room's devices (`dashboard_gerat` + purifier; tap toggles). The
temperature pill opens the history sheet: 24 h / 7 days (hourly means) / 30 days (daily
means) from long-term statistics, falling back to raw history.
Tapping the dew point fact opens a dew point chart (24 h / 3 days / 7 days from history): the
room line, the outdoor dew point, and green bands where the room's `sensor.<slug>_luftung` said
"Jetzt lüften" (dark) or "Lüften möglich" (light).

## Development

```bash
npm install
npm run dev        # preview with mocked data: http://127.0.0.1:5173/ (?busy, ?calm, ?page=climate)
npm test           # vitest: status logic
npm run check      # typecheck + tests + build
```

The build writes one ES module, `dist/ha-start-dashboard.js` (Lit bundled, no runtime
imports). `dist/` is committed so releases and direct resource URLs work without a build.

Release: bump `version` in `package.json`, `npm run check`, commit, tag `vX.Y.Z`, push `main`
and the tag to both remotes, then `gh release create vX.Y.Z` on GitHub **without** attaching
the file. HACS then reads `dist/ha-start-dashboard.js` at the tag. Downloading an attached
release asset currently fails in HACS 2.0.5 (aiohttp `LineTooLong` on GitHub's asset redirect).
