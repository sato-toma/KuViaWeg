---
name: kuviaweg-development
description: "Develop and review KuViaWeg, a mobile-first location exploration app where walking unlocks real-world map areas and users leave place-based objects. Use for map, GPS, exploration tracking, persistence, virtual objects, mobile UX, privacy, safety, and MVP planning tasks."
argument-hint: "Describe the KuViaWeg feature, bug, or milestone to implement."
user-invocable: true
---

# KuViaWeg Development

## Purpose

Use this skill to keep KuViaWeg development aligned with the product loop:

> Walk -> explore -> preserve progress -> leave something at a place -> discover it later.

The detailed roadmap is in [the development plan](../../../docs/DEVELOPMENT_PLAN.md).

## When to Use

Use this skill when working on:

- React, TypeScript, or Vite application setup.
- MapLibre maps, open map providers, attribution, or map state.
- Browser geolocation, permission flows, GPS accuracy, or location sampling.
- Exploration sessions, paths, explored areas, or road segments.
- Local persistence, synchronization, or location data models.
- Villages, signs, messages, or other coordinate-based objects.
- Mobile usability, offline/poor-network behavior, privacy, or walking safety.
- MVP planning, field testing, or review of KuViaWeg changes.

## Working Rules

1. Read the relevant feature code and nearby tests before editing.
2. Keep changes small and tied to one user-visible outcome.
3. Prefer existing project patterns over new abstractions.
4. Keep map rendering, location collection, domain logic, and storage behind clear interfaces.
5. Keep raw GPS observations separate from derived explored geometry.
6. Never start location collection without explicit user action and a visible tracking state.
7. Always handle denied permission, unavailable location, stale fixes, poor accuracy, and browser errors.
8. Do not encourage phone use while walking or access to private, dangerous, or restricted places.
9. Avoid storing or exposing precise location data unless the feature requires it and the user understands it.
10. Keep provider-specific map code isolated and preserve required attribution.
11. Add focused tests for filtering, persistence, validation, and other deterministic logic.
12. Validate on a real mobile browser when a change affects GPS, layout, battery, or touch interaction.

## Standard Workflow

### 1. Define the slice

State the smallest user-visible behavior, the owning module, and one check that could disprove the implementation hypothesis. Confirm whether the work belongs to the current MVP phase.

### 2. Inspect locally

Read the target component, service, type, and nearest test or call site. Avoid broad refactoring. Check the development plan when a request crosses milestones.

### 3. Implement the smallest change

Use TypeScript types for coordinates, timestamps, accuracy, and object kinds. Keep browser APIs behind services so domain logic can be tested without a browser.

### 4. Validate immediately

Run the narrowest relevant test, typecheck, lint, or build after the first edit. For UI work, verify loading, success, denied, unavailable, and empty states. For GPS work, test permission denial and inaccurate or stale fixes.

### 5. Review the field experience

Check that the user can tell whether tracking is active, can stop it quickly, and is not required to stare at the phone while walking. Check responsive layout, touch targets, battery implications, and map attribution.

### 6. Report clearly

Summarize the behavior changed, the validation performed, any provider or browser limitation, and the next smallest step. Do not claim real-device validation if it was not performed.

## Domain Guidance

### Location handling

- Use `enableHighAccuracy` only when justified by the walking experience.
- Preserve accuracy and timestamp metadata with each accepted point.
- Filter impossible jumps and points whose accuracy is too poor for the current operation.
- Reduce duplicate points and avoid rendering every noisy fix.
- Treat location as sensitive data and make retention and deletion explicit.

### Exploration

- Separate the recorded path from the explored-state representation.
- Make the explored state visually distinct from unexplored map content.
- Start with a small test area and avoid assuming global data volume.
- Prefer deterministic geometry or segment logic that can be tested with fixtures.

### Place objects

- Require a valid current position and clear placement confirmation.
- Validate text length and object type at the domain boundary.
- Keep object coordinates, ownership, timestamps, and content explicit.
- Do not reveal another user's precise object or visit history without a defined product rule.

### Map integration

- Isolate provider configuration and tile URL assumptions.
- Keep attribution visible and review provider terms before production use.
- Provide loading, map error, location error, and no-permission states.
- Do not make map rendering the only way to access critical controls.

## Review Checklist

- Does the change support the walking and discovery loop?
- Is location collection explicit, visible, stoppable, and privacy-aware?
- Are permission and GPS failure states handled?
- Is deterministic logic covered by focused tests?
- Does the UI work on a narrow mobile viewport and with touch input?
- Are map attribution and provider limits respected?
- Does the change avoid out-of-scope systems such as combat, payments, or advanced AR?
- Is the next field-testable outcome clear?
