# Personal Productivity Tracker MVP — project specification

This file is the source of product and engineering context for contributors and for Codex reviews. Read it before proposing or reviewing changes. The user is building the project independently to learn; Codex's role is to review small, completed increments, identify risks, and explain them clearly rather than take over implementation.

## 1. Product intent

Personal Productivity Tracker helps one authenticated person plan two related but distinct kinds of work:

- **Tasks** — discrete planned items, such as “read 20 pages” or “do 10 push-ups”, with a target number of completions on scheduled days.
- **Activities** — time-based practices, such as a workout, meditation, or language practice, completed through a start/finish session.

The MVP should answer, accurately and historically:

- What is planned for this user today?
- What did they complete today and on earlier dates?
- What goal and schedule were in effect on a particular date?
- Is there an activity session currently in progress?

Prefer correctness of dates, ownership, history, and state transitions over convenience features or clever abstractions.

## 2. Agreed MVP decisions

These are product decisions, not suggestions. Do not silently change them during implementation.

1. Registration and authentication are part of Phase 1 of the MVP. Every task, activity, schedule, occurrence, and session belongs to exactly one user.
2. A user may have **at most one active activity session**, including across devices. An active session is an `ActivitySession` with no end time.
3. A task's required completion count can be changed. The new count applies **from the current local date onward**; earlier dates and already-recorded history do not change.
4. Settings history is retained. Changes to goals, schedules, and task completion counts take effect from the current date onward.
5. Statistics and historical screens must use the settings that were effective on the date being viewed, not today's settings.
6. An activity with an active (unfinished) session cannot be deleted. The user must finish that session first.
7. Completed activity sessions remain in history even if their activity is later deleted or archived.

## 3. Scope and non-goals

### In scope

- Account registration, login, and authenticated access to user data.
- CRUD for tasks and activities, subject to the rules in this file.
- Weekly schedules.
- Task completions and time-based activity sessions.
- Today view, history, and basic statistics derived from persisted data.
- Auditable history of changes to scheduling and targets.

### Out of scope for the MVP

- Collaboration, shared households, teams, or public profiles.
- Reminders, push notifications, email notifications, calendar synchronization, and recurring background jobs.
- Social feeds, streak gamification, badges, recommendations, and AI coaching.
- Offline sync and conflict resolution.
- Multiple simultaneous sessions, pause/resume, manual timer correction, or editing completed sessions unless a later decision explicitly adds them.
- Advanced reporting, exports, integrations, billing, roles/administration, and localization beyond a deliberate application time-zone strategy.

Do not build out-of-scope features opportunistically. Capture a new product decision in this file before implementation if it changes a rule, state transition, or persisted model.

## 4. Domain language and model

Use the terms below consistently in code, APIs, tests, database names, and review discussion.

| Entity | Purpose | Important properties / relationships |
| --- | --- | --- |
| `User` | Account owner and authentication identity. | Owns all data below. Authentication credentials must not be exposed in API responses or logs. |
| `Task` | A discrete recurring planned item. | Has a current name/status and user ownership. Has schedule and version history. |
| `TaskSchedule` | A versioned weekly schedule/target for a task. | Stores effective-from local date, scheduled weekdays, and required completion count. One version is effective for a task and date. |
| `TaskOccurrence` | A dated record of planned work and/or its completion. | Belongs to a task and a calendar date; preserves what happened for historical views. Do not use current task settings to rewrite its past meaning. |
| `Activity` | A time-based recurring practice. | Has a current name/status and user ownership. Has schedule and version history. |
| `ActivitySchedule` | A versioned weekly schedule/goal for an activity. | Stores effective-from local date, scheduled weekdays, and the activity goal once its exact metric is chosen. |
| `ActivitySession` | One started activity session. | Has start timestamp and nullable end timestamp; an absent end timestamp means active. Belongs to user and activity. |
| `TaskHistory` / `ActivityHistory` | Audit trail of important user-visible configuration changes. | May be explicit audit tables or equivalent immutable version rows; it must show before/after values, actor, and timestamp. |

The final relational schema may consolidate or rename supporting tables, but it must preserve these responsibilities and the rules below. PostgreSQL is the intended datastore because this domain needs relations, transactions, constraints, and date/time queries. An ORM is an implementation choice; the domain rules must also be enforced by database constraints where feasible.

## 5. Time, date, and history rules

### Date model

- Store instants such as session start/end as timezone-aware timestamps (for PostgreSQL, `timestamptz`).
- Treat schedule application and “today” as a **user-local calendar date**. Select and document one user time-zone strategy before implementing date-dependent behavior; never derive business dates from an unexamined server timezone.
- A schedule version becomes effective at the start of its `effective_from` local date.
- For a date before any later revision, use the latest applicable version with `effective_from <= viewed_date`.

### Task changes and completion

- Changing a task target or its weekly schedule creates a new effective-dated version; it does not overwrite historical meaning.
- A change made today applies today and future local dates. It does not alter preceding dates.
- Existing completion records remain historical facts. Define and test the expected display when today's target is reduced below already-recorded completions: recorded completions remain visible; completion status is recalculated only against the version effective today.
- Enforce uniqueness/idempotency for a task occurrence or completion action so retries cannot create duplicate credit. Choose the exact interaction model (for example, increment/decrement or explicit occurrence completion) before exposing the endpoint, then test it.

### Activity sessions and deletion

- Starting a session must atomically verify that the user has no other active session and create the new session.
- Finishing a session must atomically affect only the user's current active session and set its end time. End time must not precede start time.
- Deleting an activity is rejected while that activity has an active session.
- Prefer archiving/soft deletion for activities whose history must stay visible. If hard deletion is ever used, it must preserve referential integrity and historical sessions according to the agreed product behavior.

## 6. Security, ownership, and data integrity

- Never accept an owner/user identifier from the client as authority. Determine ownership from the authenticated principal.
- Every read, mutation, and nested resource lookup must be scoped to that principal. A resource belonging to another user should not be exposed.
- Hash passwords using a modern password-hashing algorithm; never store plaintext passwords or return password hashes.
- Validate all API input at the boundary. Return stable, intentional client errors; do not leak stack traces, SQL, secrets, or internal identifiers unnecessarily.
- Use database foreign keys, `NOT NULL`, `CHECK`, `UNIQUE`, and transactional writes for invariants that survive concurrent requests.
- Add a database-level strategy for the “one active session per user” invariant (for example, a partial unique index), not only an application-level check.
- Auth/session/token handling must be intentional: expiration, secret management, and protected routes should be tested. Do not commit secrets or local environment files.

## 7. API and engineering conventions

- Design endpoints around resources and explicit state transitions; do not let generic update endpoints bypass domain rules.
- Keep controllers/route handlers thin. Put domain decisions in focused services/use-cases; keep persistence concerns in repositories/data-access code once the project reaches that complexity.
- Use migrations for schema changes. Do not modify an already-applied migration to change production semantics; add a new migration.
- Make mutations transactional whenever they update multiple records, depend on a current state check, or append history.
- Error responses should distinguish validation failure, authentication failure, authorization/ownership failure, missing resource, conflict/business-rule violation, and unexpected server error.
- Maintain deterministic automated tests. Use a controlled clock or explicit dates for effective-date, week-day, and session-time tests.
- API documentation and examples must reflect behavior actually covered by tests.

## 8. What a Codex review should do

Each review is for one small commit/phase. The reviewer should first read this file and the commit diff, then focus on concrete, actionable findings.

Review for:

1. Violation of an agreed product rule or historical correctness.
2. User-data isolation, authentication, authorization, secret handling, or input-validation flaws.
3. Broken invariant, race condition, missing transaction/constraint, or unsafe state transition.
4. Migration safety, data loss risk, API incompatibility, and test gaps for new business rules.
5. Maintainability only when it creates a near-term correctness or learning problem.

Expected review response format:

- Findings first, ordered by severity, with file and line references plus a short explanation of impact.
- Distinguish blocking issues from optional learning suggestions.
- State explicitly when no blocking issue is found; do not invent stylistic objections.
- Ask a concise question when a missing product decision prevents reliable review instead of assuming a new rule.
- Do not rewrite the feature wholesale. Explain a targeted correction so the user can implement and learn it.

Suggested review prompt: “Review commit `<sha>` against `AGENTS.md`. Report only actionable findings, ordered by severity; check tests and migrations as part of the change.”

## 9. Delivery plan: one phase, one commit, one review

Finish each phase as a cohesive, runnable increment. Before the next phase: run relevant checks, create one focused commit, then request a Codex review of that commit. Address blocking findings with a follow-up commit and a new review before proceeding.

| Phase | Commit-sized outcome | Minimum verification before review |
| --- | --- | --- |
| 0. Foundation | Project setup, configuration pattern, formatter/linter/test runner, health check, initial README, and CI-quality local commands. | App starts; health endpoint works; lint/tests run from a clean checkout. |
| 1. Persistence baseline | PostgreSQL connection, migration workflow, `users` schema, and safe environment configuration. | Fresh database migration succeeds and rolls back/recreates as documented. |
| 2. Authentication | Registration, login, password hashing, auth middleware, protected-route baseline. | Tests for valid flow, invalid credentials, protected access, duplicate account, and no password leakage. |
| 3. Tasks: current state | Task CRUD with authenticated ownership and an initial weekly schedule/target. | Ownership, validation, and schedule CRUD tests. |
| 4. Task history and dated view | Effective-dated task schedule versions, historical change records, and a date-based planned-task query. | Boundary tests before/on/after a change date and across weekdays. |
| 5. Task completion | Task occurrence/completion behavior and today's/history completion display. | Idempotency/duplicate-action tests plus target-change historical tests. |
| 6. Activities: current state | Activity CRUD with authenticated ownership and initial schedule/goal representation. | Ownership, validation, and archive/delete behavior tests. |
| 7. Activity history and sessions | Effective-dated activity settings plus start/finish session flows. | Tests for start/finish times, completed history, and date-effective settings. |
| 8. Active-session invariant | Enforce one active session per user, including concurrent-request-safe database protection; reject deletion with an active session. | Transaction/constraint tests and a concurrent or conflict-path test. |
| 9. Today, history, and statistics | Authenticated read models for today, historical dates, and agreed basic metrics. | End-to-end fixtures showing historical settings are used correctly. |
| 10. MVP hardening | API documentation, error consistency, authorization sweep, migration/backup notes, and end-to-end regression suite. | Full test suite, clean database bootstrap, documented run instructions, manual happy-path check. |

Phases are deliberately small. Do not combine authentication, tasks, activities, sessions, and statistics in one commit. If a phase grows beyond a reviewable diff, split it along a testable boundary and update this plan only when the split preserves the dependencies above.

## 10. Open decisions to record before implementation

These details are intentionally not invented here. Decide them immediately before the relevant phase and add the decision to this section (with date and rationale) so later reviews have a stable standard:

- User time-zone setting and behavior when it changes.
- Exact task completion interaction and whether users can undo a completion.
- Exact activity goal metric (for example, number of sessions, minutes, or both) and its first MVP behavior.
- Whether users can edit a completed session, and what history/audit outcome that must create.
- Archive versus hard-delete API semantics and whether archived entities can be restored.
- Chosen authentication/session mechanism and logout/revocation behavior.
- Initial API versioning and response/error schema.

## 11. Change-control rule

When implementation reveals a missing product rule, pause before encoding a guess. Add a short dated decision here, explain its effect on history and existing data, and then implement it with tests and (when needed) a migration. This keeps the MVP understandable to a future reviewer who has no access to the planning conversation.
