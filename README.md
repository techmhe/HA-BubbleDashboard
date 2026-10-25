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
  precipitation: sensor.musterstadt_niederschlag   # DWD rain now (mm/h); optional
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
  window_snooze: input_text.fenster_ignorieren      # "1 h ignorieren" for window warnings
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
battery:                # home battery limits (SoC %); an idle battery shows *Reserve* / *voll*
  reserve: 25           # discharge stops here (e.g. the zero-feed-in automation's min SoC)
  full: 95              # charging stops here (default 100)
heating_check:          # stuck-valve check (defaults shown); `heating_check: false` turns it off
  hours: 2              # window the rise is measured over
  min_rise: 1           # K
  max_power: 150        # mean room power (W) above which appliances explain the warmth
  max_pv: 300           # mean PV power (W) above which the sun explains it
  max_hum_rise: 10      # humidity jump (points) that means a shower or cooking
  sunny: [badezimmer, schlafzimmer]  # rooms the sun warms; PV only rules out these (default: all)
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

## Home Assistant setup

The card only reads states and calls services; timers, pushes and other logic live in HA.
Everything is optional: a missing entity hides its part of the card. Entity ids below are
the defaults; each can be changed under `entities:` (see Configuration).

| What | Entities | Used for |
|---|---|---|
| Room sensors | `sensor.<slug>_temperature`, `_humidity`, `_taupunkt` (`state_class: measurement`) | pills, history and dew charts, heating check (needs statistics) |
| Airing per room | template `sensor.<slug>_luftung`: *Jetzt lüften* / *Lüften möglich* / *Nicht lüften* | room auto-detection, airing icon, *Jetzt lüften* item, dew chart bands |
| Room power | `sensor.<slug>_leistung` (label `raumverbrauch`, `state_class: measurement`) | Räume pill, heating check (appliances) |
| Outdoor | `sensor.aussen_temperature`, `sensor.aussen_taupunkt_messung`, weather entity | Klima outdoor pill |
| Airing | `timer.luften`, `sensor.stossluften_dauer` (minutes), `script.luften_starten` | countdown, airing sheet, *Start* |
| Window snooze | `input_text.fenster_ignorieren` (text helper, max 255) | *1 h ignorieren* on window warnings |
| Heating | VTherm climates (`preset_temperatures`, `valve_open_percent`, `sensor.<climate>_power_percent`), `input_boolean.heizbetrieb`, `script.heizung_preset_alle` | Klima, room card, heating check |
| All rooms | `input_number.alle_raume_temperatur`, `input_text.alle_raume_auswahl`, `input_select.alle_raume_dauer`, `script.alle_raume_anwenden` | *Alle Räume einstellen* |
| Devices | label `dashboard_gerat`; `script.gerat_verzogert_ausschalten` (fields `entity`, `minutes`) | Räume, room card, *Ausschalten in* |
| Appliances | `input_boolean.<name>_fertig`, switched on by your own automation | *fertig* item with *OK* |
| Waste | `sensor.naechster_abfalltermin` (attribute `daysTo`) | waste item |
| Energy | HA's energy dashboard (solar, grid with prices, battery, device consumption), grid/battery/house power sensors, `sensor.stromverbrauch_nicht_erfasst` | Energie page |
| Robby | vacuum, status/battery/error sensors, map/mode/mop selects, `input_text.robby_raumauswahl`, `input_number.robby_durchgange`, Robby scripts | Robby sheet |
| Maintenance | Battery Notes `*_battery_replaced` buttons, filter reset buttons | *Wartung* sheet |
| Weather | weather entity, core `dwd_weather_warnings`, `sensor.pollenflug_*` | weather sheet, warnings |

`script.luften_starten` starts the timer with the recommended duration:

```yaml
sequence:
  - action: timer.start
    target: { entity_id: timer.luften }
    data:
      duration:
        minutes: "{{ states('sensor.stossluften_dauer') | int(15) }}"
```

`sensor.stossluften_dauer` is a template on the outdoor temperature, e.g.
`{{ 5 if t < 0 else 10 if t < 15 else 20 if t < 20 else 25 }}`.

To start the countdown automatically when a window opens (and stop it when all are closed
again), add an automation like this; the card then shows the countdown on Übersicht and Klima:

```yaml
alias: "Lüften: Timer bei offenem Fenster"
mode: queued
triggers:
  - trigger: state
    entity_id: [binary_sensor.fenster_wohnzimmer, binary_sensor.fenster_bad]
    from: "off"
    to: "on"
    id: opened
  - trigger: state
    entity_id: [binary_sensor.fenster_wohnzimmer, binary_sensor.fenster_bad]
    from: "on"
    to: "off"
    id: closed
actions:
  - choose:
      - conditions:
          - condition: trigger
            id: opened
          - condition: state
            entity_id: timer.luften
            state: idle
        sequence:
          - action: script.luften_starten
      - conditions:
          - condition: trigger
            id: closed
          - condition: state
            entity_id: timer.luften
            state: active
          - condition: state
            entity_id: [binary_sensor.fenster_wohnzimmer, binary_sensor.fenster_bad]
            state: "off"
        sequence:
          - action: timer.cancel
            target: { entity_id: timer.luften }
```

Push messages ("Fenster schließen", airing finished) are HA automations too, sent only to
persons at home. If both a per-window push and a timer-finished push exist, give the
timer-finished one a condition that the per-window automation is not running
(`attribute: current`, `state: 0`) to avoid two pushes for the same window.

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
  ≥ 5 min, *Heizung prüfen* (see Heating check below), DWD warnings in force (else gusts ≥ 60 km/h), airing recommended (*Start* → `script.luften_starten`) or
  running (live countdown of `timer.luften` plus the open windows), *Fenster schließen* /
  *Fenstersensor prüfen* per room (see Airing states; *1 h ignorieren* via
  `input_text.fenster_ignorieren`), appliance done (`input_boolean.*_fertig`, *OK* turns it
  off), Robby error / consumable at ≤ 0 min, waste the day before and on the day,
  filter alarms and `*filter_life` < 10 %, batteries < 15 % (skipping Robby, phones, `_plus`).
  Filters and batteries open the *Wartung* sheet: *Getauscht* presses the device's Battery
  Notes `*_battery_replaced` button, *Erledigt* a filter reset button on the device (where
  none exists, the sheet says to reset it on the device).
- **Zusammenfassung**: one pill per room with temperature, humidity, *heizt* (only without a
  window mark) and the airing state as an icon (see Airing states), and
  an air-quality dot only for rooms with a PM2.5 sensor (green ≤ 12, yellow ≤ 35, red > 35).

### What Klima shows

- Header: how many rooms heat, worst air quality, *Zentralheizung* toggle
  (`input_boolean.heizbetrieb`).
- Outdoor pill (`sensor.aussen_temperature`, weather humidity, `sensor.aussen_taupunkt_messung`
  vs. the rooms' mean dew point) with the airing minutes (`sensor.stossluften_dauer`), or a
  live countdown while `timer.luften` runs; tap → airing sheet. The card does not start the
  timer on its own: an HA automation that runs `script.luften_starten` when a window opens
  makes the countdown appear automatically.
- *Alle Räume*: presets via `script.heizung_preset_alle`; tune icon → *Alle Räume einstellen*
  (sets `input_number.alle_raume_temperatur`, `input_text.alle_raume_auswahl`,
  `input_select.alle_raume_dauer`, then runs `script.alle_raume_anwenden`).
- Rooms per floor with −/Soll/+, state *heizt* / *Soll erreicht* / *Aus* or the airing state (*lüftet 3:12*, *offen 25 min*,
  *Sensor?*, *offen*), a chip for the airing state next to the name (see Airing states), AQ dot and
  purifier fan icon, and an orange *!* chip from the heating check. The AC (`ac:`, default `climate.flur_1_og_klimaanlage`) sits in its
  area's floor with Kühlen / Trocknen / Aus; tap opens the AC sheet: target −/+, modes,
  fan, presets, swing, the device's switches (outdoor quiet mode first), self-cleaning,
  power from `ac_power` (default `sensor.klimaanlage_power`).
- −/+ change the target optimistically and send one `climate.set_temperature` after 0.7 s
  without taps (instead of `script.heizung_schritt` per tap, which drops fast repeated taps).

### What Räume shows

- Header: lights and other devices that are on; *Licht aus* turns off every labelled light
  that is on. Filter *Alle* / *An* / one per floor, upper floor first (the Licht bubble opens
  *An*). *An* shows only the devices that are on, plus the room's *Aus* scene
  (`scene.*_off` / `scene.*_aus`) instead of all scenes, in a compact card: name, pill and
  *Aus* as a round power button in one row, then the devices.
- One card per room: the climate rooms plus every other area with a `dashboard_gerat`
  device (e.g. Garten), upper floors first (OG before EG), rooms without a floor last. Card: *x von y an*, a pill with
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
  *Akku lädt*); idle at its limits it says *Reserve* or *voll* (`battery:` in the config). Each node opens a chart: PV and grid in kWh per hour/day, Haus = consumption
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
- Cost tiles under *Heute*: *Stromkosten* (grid import), *Vergütung* (feed-in) and *Gespart
  (PV & Akku)* (locally covered consumption at the import price). Fixed prices come from the
  energy dashboard's grid source; with an entity price the card reads HA's cost statistics
  (`stat_cost`, else `<import stat>_cost` / `<export stat>_compensation`) and leaves out
  *Gespart*. Tap → grid cost in € per hour/day.
- *Aktuell*: every `*_power` sensor that sits in an area, one per device (measured
  before Powercalc), without the grid meter, PV, battery and house devices, phase and PoE
  readings; plus *Nicht erfasst*. Largest first, all values positive. Tap → mean power curve
  with average and energy used: 4 h (5-minute statistics), 24 h (hourly), 7 / 30 days
  (daily). The top six are shown; *Alle anzeigen* lists every consumer above 1 W.
- HA writes hourly statistics only after an hour has ended, so every energy chart, the
  24 h power curves and the *Heute* totals add the running hour from 5-minute statistics
  (bar 18–19 Uhr at 18:47 shows 18:00–18:45).

### What Schutz shows

- Headline: open count or *Alles ruhig* and *x von y zu*.
- Persons pill (top right, like the weather pill on Übersicht): every `person.*` with a
  device tracker (or `persons:` in the card config), picture or initials, a badge with the
  zone's icon (green = home, blue = another zone, grey = away). Tap → *Personen* sheet: HA's
  own map (`ha-map`, loaded via the map card) with persons and zones, plus one row per person
  with zone and *seit* time.
- The alarm icon (Schutz pill, Übersicht bubble, alarm sheet) shows the armed mode: car =
  Abwesend, house = Zuhause, moon = Nacht; the shield when disarmed or triggered.
- Alarm pill with *zuletzt ausgelöst* (Alarmo's `last_triggered`) and buttons for the other
  modes (Abwesend / Zuhause / Nacht / Aus); the shield opens the alarm sheet.
- Door camera live via HA's `ha-camera-stream` (muted by default; sound and fullscreen
  buttons; on iPhone fullscreen opens HA's camera dialog), motion and person chips,
  *Verlauf* → more-info of the motion sensor.
- Windows & doors: binary sensors with class window/door/opening/garage_door grouped by
  floor and area, groups excluded; interior doors go into `exclude.openings`. Door or window icon comes from the name (*Tür*), since
  many contacts are classed as `door`. Green = closed, red = open, dashed = unavailable.

### Robby and weather pop-ups

- **Robby** (Robby bubble, Robby items in *Aktuell*): status + battery (*Geladen* once docked at 100 %), Start/Pause,
  Station, Orten; consumables (*fällig* at ≤ 0 min, else hours; tap resets via the
  vacuum's *Verbrauchsmaterial zurücksetzen* button after a confirm); six programme tiles
  (`button.press`, *Karte komplett* = `vacuum.start`); *Selbst auswählen*: map tabs
  (`vacuum_map_script`), room chips (`vacuum_room_script`, selection read from
  `vacuum_selection`), mode tiles, suction (`vacuum.set_fan_speed`, hidden for mop only),
  water (hidden for vacuum only), passes 1×/2×, *N Räume starten* (`vacuum_clean_script`).
  All state lives in HA, so the Bubble build and the card stay in sync.
- **Weather** (weather pill, storm item): now with today's range and rain, chips (rain now,
  humidity, wind + direction, pressure, UV, visibility; tap → chart of the last 24 h from
  history and the next 24 h from the hourly forecast; rain as hourly bars, the past from the
  `precipitation` sensor's statistics, without the sensor only the forecast), DWD warnings (current and advance, from the core
  `dwd_weather_warnings` integration; repeats of one type are merged into one row with the
  highest level and the full time span; compact rows, tap shows the DWD text) or else a storm
  hint (gusts ≥ 60 km/h now or the first forecast day), 6 slots every 2 h, 7 days on a shared
  temperature scale (tap a day → its rain, sunshine, wind and gusts, humidity, UV, 3-hourly
  slots and temperature curve with hourly rain bars as far as the hourly forecast reaches), pollen.
  Forecasts come from `weather.get_forecasts` (hourly + daily), cached for 15 minutes.

Room card: −/+ target (the big number; the current temperature below as *Ist*), *heizt · Ventile x %* (`valve_open_percent`), presets with
`preset_temperatures`, the area's scenes (an active scene glows: every entity still matches
the stored scene state, read from the scene config for UI scenes; otherwise the last
activated scene while its entities stay untouched), PM2.5 / dew point / window facts (window by airing state), airing status +
start, and the room's devices (`dashboard_gerat` + purifier; tap toggles). The
temperature pill opens the history sheet: 24 h / 7 days (hourly means) / 30 days (daily
means) from long-term statistics, falling back to raw history.
Tapping the dew point fact opens a dew point chart (24 h / 3 days / 7 days from history): the
room line, the outdoor dew point, and green bands where the room's `sensor.<slug>_luftung` said
"Jetzt lüften" (dark) or "Lüften möglich" (light).

### Airing states

Each room has one airing state, shown the same way on Übersicht (icon on the pill), Klima
(chip and text) and in the room card (window fact):

| State | When | Look |
|---|---|---|
| Empfohlen | `sensor.<slug>_luftung` = *Jetzt lüften*, window closed | blue wind icon; the pill keeps its own tint (orange while heating) |
| Lüftet | window open, within the recommended duration (`sensor.stossluften_dauer`) + 5 min grace | blue window icon with the time left, pill blue |
| Zu lange offen | open past duration + 5 min (*Zeit um*), or open ≥ 5 min while the room says *Nicht lüften* (*bringt nichts*) | red window icon with the open time, pill red, *Fenster schließen* in Aktuell |
| Sensor? | sensor unavailable, or open ≥ 30 min while it is ≥ 3 K colder outside and the room neither cooled (< 0.3 K) nor changed humidity (< 3 points) | grey dashed window icon, *Fenstersensor prüfen* in Aktuell |
| Offen (ignoriert) | *1 h ignorieren* was tapped | grey window icon, no Aktuell item |

*1 h ignorieren* writes into `input_text.fenster_ignorieren` (create it as a text helper,
max 255), so the snooze applies on every phone; without the helper the button is hidden.
Pill tint is the same on Übersicht, Klima and in the room card: red = window open too long,
blue = airing runs (window open), orange = heating, otherwise none.

The stuck-sensor check loads 5-minute statistics of the rooms with a window open ≥ 30 min.

### Technik (tech users only)

A server button left of the weather pill opens the *Technik* sheet: Werbeblocker (Pi-hole on,
pause 5 min / 1 h, off), Dienste (Uptime Kuma monitors, only problems listed, the rest behind
"N weitere erreichbar"), Gäste-WLAN (QR code, on/off, new password) and a 3D printer row that
opens the printer sheet. A red dot on the button means a service is down (≥ 3 min), Pi-hole
has been off for ≥ 70 min or the printer reports an error. *Aktuell* gets the matching items
(print running with a progress bar, print finished with OK, print error, services down,
Werbeblocker aus).

Everything is auto-detected; every key is optional:

```yaml
technik:                       # or `technik: false` to switch the feature off
  users: [Max]                 # HA user names or ids; default: every admin
  printer: <device id>         # default: first ha-bambulab device with a print status
  printer_plug: switch.drucker_steckdose        # no auto-detection; enables power button and "aus"
  printer_plug_power: sensor.drucker_steckdose_power
  printer_plug_energy: sensor.drucker_steckdose_energy   # "Diesen Monat" kWh
  pihole: switch.pi_hole       # default: first pi_hole switch
  guest_wifi: switch.gaeste_wlan   # default: first UniFi WLAN switch with "guest" in its id
  services_exclude: [Testserver]   # Uptime Kuma monitor (device) names to hide
  service_groups:              # one row per group, red when any member is down
    DNS: '^DNS\b'               # default
```

- **Printer** ([ha-bambulab](https://github.com/greghesp/ha-bambulab)): entities are found by
  their `translation_key`, so the entity language does not matter. The plug switch is locked
  while printing, in an error and while a nozzle is ≥ 50 °C; switching off asks first.
  Pause, stop and the camera only show when the integration exposes them (LAN mode); in cloud
  mode the sheet says to continue at the printer or in Bambu Handy.
- **Uptime Kuma**: every monitor of the core integration is a device; its name is the row name.
  Certificates expiring in < 7 days show in the sheet only.
- **UniFi guest WLAN**: the `QR-Code` image and `Passwort neu generieren` button entities are
  disabled by default in HA. Enable both on the WLAN device to get the QR code and the
  new-password button; without them the card shows only on/off and the client count.

### Heating check

Every 10 minutes the card looks for rooms that keep getting warmer although their thermostat
does not call for heat, a hint at a stuck valve. A room is flagged when, over the last
`hours`: it rose by at least `min_rise` K and is above its target (or its thermostat is off),
the thermostat did not heat (VTherm's `sensor.<climate>_power_percent` statistics, else its
history) and the window stayed closed (both also during the hour before),
the room's power sensors averaged at most `max_power` W (dryer, gaming PC), PV averaged at
most `max_pv` W (sun; only for the rooms in `sunny` when set) and humidity did not jump by `max_hum_rise` points (shower). It loads
5-minute statistics and the window history (no attributes), about 80 KB for 8 rooms. Flagged rooms show
in *Aktuell* (tap → room card), as an orange chip on the Klima pill and in the room card's
state line.

All charts (energy, costs, battery, dew point, room history, weather) can be read by finger:
tap or drag along the chart and a line, a dot and a bubble show the time and value of the
bar or point underneath (the dew chart adds the outdoor value, forecasts say *Vorhersage*).
Vertical swipes still scroll the sheet.

## Development

```bash
npm install
npm run dev        # preview with mocked data: http://127.0.0.1:5173/ (?page=climate, ?busy, ?calm, ?airing)
npm test           # vitest: status logic
npm run check      # typecheck + tests + build
```

The build writes one ES module, `dist/ha-start-dashboard.js` (Lit bundled, no runtime
imports). `dist/` is committed so releases and direct resource URLs work without a build.

Release: on a branch, bump `version` in `package.json`, `npm run check`, commit, merge into
`main`, tag `vX.Y.Z`, push `main` and the tag to GitHub, then
`gh release create vX.Y.Z dist/ha-start-dashboard.js`. HACS installs the attached file;
in HA: HACS → Start Dashboard → *Update information*, then download, then reload the
dashboard.
