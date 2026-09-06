# KuViaWeg Development Plan

## 1. Product Vision

KuViaWeg is a mobile-first exploration game where walking through real streets gradually creates a player's virtual world.

The first product loop is:

> Walk somewhere -> discover and claim the route -> leave something at the place -> let another visitor find it.

The MVP should make this loop enjoyable and trustworthy before adding social systems, complex game mechanics, or AR.

## 2. MVP Scope

### In scope

- Show an open street map centered on the user's location.
- Request location permission and show the current position.
- Record location updates while an exploration session is active.
- Draw the walked path on the map.
- Mark explored map areas or road segments as explored.
- Persist exploration data locally so it survives app restarts.
- Place a basic virtual object at the user's current location.
- Display nearby objects and allow the user to leave a short message.
- Work well on a modern smartphone browser.

### Out of scope for the MVP

- 3D models and advanced game mechanics.
- Combat, inventory, payments, rankings, and large-scale social features.
- Smart glasses and advanced AR.
- Global-scale infrastructure and unrestricted world coverage.
- Encouraging access to private, dangerous, restricted, or illegal areas.

## 3. Product Principles

1. **Walking is the main interaction.** The app should reward real movement instead of requiring constant screen interaction.
2. **The real map remains visible.** Exploration is layered on top of familiar geographic information.
3. **Place matters.** Objects and messages are tied to coordinates and are meaningful because someone visited that place.
4. **Safety comes first.** The app must not encourage phone use while walking, unsafe routes, trespassing, or access to restricted areas.
5. **Privacy is explicit.** Location collection is opt-in, session-based, visible to the user, and easy to stop or delete.
6. **Start small.** Validate one municipality or a small nearby area before designing for global scale.

## 4. Proposed Technical Direction

- **Frontend:** React, TypeScript, and Vite.
- **Map:** MapLibre GL JS with an open map data provider selected after checking attribution, tile usage, and rate limits.
- **Location:** Browser Geolocation API for the first web version.
- **Storage:** A small location and exploration service behind an interface. Start with local persistence for the technical prototype; introduce an API and database when multi-user objects are needed.
- **Initial deployment target:** Mobile browser, with PWA improvements after the core loop is validated.

Provider and licensing decisions must be documented before production use. Do not hard-code a provider-specific API contract into unrelated UI components.

## 5. Milestones

### Phase 0: Technical proof

**Goal:** Prove that the app can show a map, request location permission, and follow the user on a smartphone.

**Deliverables:**

- Vite React TypeScript application.
- Map screen with a clear loading, permission, and error state.
- Current-position marker.
- Manual recenter control.
- Basic responsive layout.

**Done when:** A user can open the app on a phone and see their position move on the map after granting permission.

### Phase 1: Exploration tracking

**Goal:** Turn movement into a visible explored path.

**Deliverables:**

- Start and stop exploration session controls.
- Location sampling with accuracy and timestamp data.
- Noise filtering and duplicate-point reduction.
- Walked-path polyline.
- Clear indication of tracking state and last update time.

**Done when:** A short walk produces a stable, understandable path without making the user keep the app in the foreground constantly.

### Phase 2: Persistent explored world

**Goal:** Preserve the user's explored progress.

**Deliverables:**

- Exploration record model.
- Local persistence and schema versioning.
- Restore explored paths after an app restart.
- Delete/export controls for local location data.
- Tests for persistence, reload, and malformed data handling.

**Done when:** Previously explored progress remains after closing and reopening the app.

### Phase 3: Place objects

**Goal:** Let a user leave a simple virtual object at a visited location.

**Deliverables:**

- Object creation available only when location permission is active.
- Basic object types: village, sign, and message.
- Coordinate, owner, creation time, title, and text fields.
- Nearby-object display and detail view.
- Validation for message length and object placement distance.

**Done when:** A user can create an object at their current location and see it again on the map.

### Phase 4: Small-area field test

**Goal:** Validate the walking experience in one municipality or a nearby test area.

**Deliverables:**

- Mobile usability pass in daylight and poor-network conditions.
- Location accuracy and battery observations.
- Safety and privacy review.
- Feedback notes from real walks.
- Decision on whether the core loop deserves backend and multi-user investment.

**Done when:** Test users understand the loop, can stop tracking, and want to explore another nearby place.

### Phase 5: Backend and visits

This phase begins only after the core loop is validated.

- Add authentication and a backend API.
- Store users, GPS logs, explored segments, villages, signs, and messages.
- Add server-side validation and abuse controls.
- Define a visit rule before exposing another user's objects.
- Add synchronization and conflict handling.

### Phase 6: AR exploration

Consider AR only after the map experience, data model, privacy rules, and object placement are stable.

## 6. Initial Data Model

```text
User
- id
- displayName

ExplorationSession
- id
- userId
- startedAt
- endedAt

LocationPoint
- sessionId
- latitude
- longitude
- accuracyMeters
- recordedAt

ExploredArea or ExploredSegment
- id
- userId
- geometry or stable road reference
- firstExploredAt
- lastExploredAt

PlaceObject
- id
- userId
- type: village | sign | message
- latitude
- longitude
- title
- text
- createdAt
```

Keep raw GPS points separate from derived explored geometry. This allows filtering and reprocessing without losing the original observation, while still allowing the app to minimize retained location data later.

## 7. Quality and Safety Requirements

- Never assume that a GPS point is safe to visit or that it identifies a public road.
- Show a visible tracking indicator and an obvious stop action.
- Handle denied permissions, unavailable location, stale fixes, low accuracy, and browser errors.
- Avoid tracking when the user has not explicitly started a session.
- Do not expose precise private location data without a clear product rule and user consent.
- Test on real mobile browsers; desktop simulation alone is insufficient.
- Keep map attribution visible as required by the selected provider.
- Measure battery impact and avoid unnecessarily frequent location updates.

## 8. First Issue Breakdown

1. **Project foundation:** Vite, React, TypeScript, ESLint, formatting, and a minimal app shell.
2. **Map screen:** MapLibre integration, provider configuration, attribution, initial view, pan, and zoom.
3. **Current location:** permission flow, position marker, recenter, and error states.
4. **Exploration session:** start/stop controls, location sampling, filtering, and path rendering.
5. **Explored progress:** local persistence, restore flow, and explored-path styling.
6. **Place objects:** object model, create flow, validation, local display, and message view.
7. **Field test:** mobile QA checklist, privacy review, battery notes, and feedback capture.

Each issue should have a small demonstrable outcome, tests for important logic, and an explicit definition of done.

## 9. Definition of Done for the MVP

The MVP is ready for a field test when:

- A user can see a map and current location on a smartphone.
- A user can explicitly start and stop location tracking.
- A short walk appears as an explored path with reasonable noise handling.
- Explored progress survives an app restart.
- A user can place and view a short message at their current location.
- Permission failures, stale locations, and unavailable locations are understandable.
- Location data can be deleted locally.
- Map attribution and provider usage requirements are satisfied.
- The core loop can be tested safely in a small, known area.

## 10. Open Decisions

- Which MapLibre-compatible tile provider will be used for development and production?
- Should explored progress be represented by road segments, buffered geometry, or both?
- What accuracy threshold and sampling policy are appropriate for walking?
- What evidence is required before a user can view another user's object?
- Which local storage technology should be used before the backend exists?
- When should the project become a PWA or native wrapper?
