# iPad and MacBook Layout Spec

Status: approved (in chat, 2026-11-07: "go ahead and build it")

## Goal

The card is phone-first (max 480 px column). On an iPad Pro 11" held mostly in landscape on the
sofa, and on MacBooks, it wastes two thirds of the screen and truncates names. The card gets a
tablet layout that fills the screen, following the approved mockups in `docs/design/ipad/`.

## Context

- One card, five pages (Übersicht, Klima, Räume, Energie, Schutz), sheets rendered inside the card.
- Phone layout stays exactly as it is below the tablet breakpoint.
- Mockups (approved): `UebersichtQuerB`, `KlimaQuer`, `RaeumeQuer`, `EnergieQuer`, `SchutzQuer`
  (landscape 1194 × 834), `UebersichtHochB`, `RaeumeHoch` (portrait 834 × 1194), side panels
  `RaumPanelQuer`, `AlleRaeumeQuer`, `LueftenQuer`, `WetterQuer`, `RobbyQuer`, `LichtQuer`.
- The Robby panel follows its current mockup; a redesign with the real map is a later project.

## Requirements

1. Layout is chosen from the card's own width (ResizeObserver), not the device:
   `phone` < 700 px, `tablet` 700–999 px, `wide` ≥ 1000 px. Exposed as host attribute `layout`.
2. `wide`: navigation is a vertical rail on the left (76 px, items 64 px with icon and label,
   active item white); the page fills the viewport height (100dvh) without page scrolling;
   columns scroll on their own when content does not fit.
3. `tablet`: bottom navigation as on the phone; the page uses the full width (no 480 px cap).
4. Sheets in `tablet` and `wide` open as a right side panel (top/right/bottom 16 px, 440 px wide,
   radius 32 px) over a dimmed page; the Robby sheet is 720 px wide with two columns.
   Stacked sheets keep working (the one underneath stays dimmed behind the top one).
5. Übersicht `wide`: header with greeting and the four status bubbles in one row (58 px pills);
   three columns `1fr 1.3fr 1fr`:
   - Aktuell items (full width each) and a camera still card (refreshing snapshot, tap opens Schutz);
   - Zusammenfassung as stacked tiles (icon + temperature, full room name, humidity/state, lights
     on, AQ dot), grouped by floor, tiles stretch to fill the column;
   - weather card (current, next 12 h temperature line with rain bars, 5 days) and energy card
     (house now, source split bar, today's PV vs consumption curve, PV/Bezug/autark).
   `tablet`: bubbles in their own row, Aktuell + camera left, Zusammenfassung right, weather and
   energy side by side below.
6. Klima `wide`/`tablet`: header row with title, outdoor pill, airing pill, heating switch;
   "Alle Räume" bar with labelled preset buttons and "Einstellen"; room cards in a grid
   (3 columns wide, 2 tablet) grouped by floor, each with name, AQ dot/purifier, current
   temperature, state line, the four preset buttons with the room's own preset temperatures
   (`set_preset_mode`), and −/Soll/+; the AC is a card in its floor with Kühlen/Trocknen/Aus.
7. Räume `wide`/`tablet`: filters and "Licht aus" in the header row; room cards as masonry
   columns (3 wide, 2 tablet).
8. Energie `wide`/`tablet`: two columns; left the flow and a "Heute" PV vs consumption curve;
   right the "Heute" tiles, cost tiles, split bars and "Verbraucher jetzt".
9. Schutz `wide`/`tablet`: two columns; left the live camera filling the column with its chips;
   right the alarm card with all modes as labelled buttons, then windows and doors by floor/room.
10. No new runtime dependencies; no hard-coded device lists; German UI, English code.

## Design

- `layoutFor(width)` in `src/logic/layout.ts` (pure, tested). The card stores `_layout`, sets
  `layout` on the host and passes `layout` in `PageContext`.
- Pages branch on `ctx.layout` only where the markup differs; otherwise CSS under
  `:host([layout=...])` does the work.
- Day curve: hourly kWh from the energy dashboard statistics (`loadEnergy` for PV,
  `loadConsumption` for the house), the same cache keys as the energy chart sheet.
- Camera still on Übersicht: `camera_proxy` URL from the entity's `entity_picture`, refreshed
  with the card clock (every 30 s).

## Testing

- `layoutFor` breakpoints.
- Floor grouping of the overview tiles, the day-curve path builder.
- CSS contract tests for the rail and the side panel.
- Visual check in Chrome against the mockups at 1194 × 834 and 834 × 1194 (dev harness and live).

## Out of scope

- Robby redesign with the real map (separate project).
- Event thumbnails on Schutz (no event image source).
- Portrait mockups for Klima/Energie/Schutz: they use the `tablet` rules above.

## Assumptions

- Breakpoints at 700 and 1000 px (my call): an iPad in portrait is 834, landscape 1194, MacBook
  windows usually ≥ 1000.
