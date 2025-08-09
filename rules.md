0. All code must be designed with mobile-first principles, ensuring a modern and responsive user experience across all devices.

1. Write Only Production-Ready, Secure Code
All code must be industry-grade, robust, and safe for production.

No quick fixes or hacky workarounds allowed.

Security, error handling, and stability are non-negotiable priorities.

2. Prioritize Modularity, Scalability, and Clean Architecture
Apply modern architecture principles — Modular, DRY (Don't Repeat Yourself), SoC (Separation of Concerns).

All logic should be isolated into appropriate services, utilities, hooks, modules, etc.

Code should be easy to scale, extend, test, and maintain.

3. Fix Bugs Deeply, Without Duplication
Investigate the root cause of bugs; do not patch superficially.

Bug fixes must be clean, without introducing code duplication or temporary logic.

Refactor responsibly if needed to eliminate the actual cause.

4. Respect and Align with Backend Infrastructure
Strictly follow backend data models, authentication flows, role systems, validations, and multi-tenancy logic.

Never bypass or override backend logic in the frontend/client for ease.

Treat backend as the source of truth and validate accordingly.

5. Do Not Fake Fixes to Pass Tests
Do not simplify logic or hardcode responses just to pass test cases.

Fix the actual issue causing the failure, even if it's deep or architectural.

Code should pass tests because it is functionally correct, not tricked.

6. Maintain and Use Documentation (in docs/)
All relevant .md files in the docs/ folder must be referred to when building or modifying features.
If a feature, endpoint, parameter, or flow is added/modified — the corresponding .md must be updated.
Each module or feature (e.g., auth.md, students.md, tenants.md) should:
Describe endpoints, parameters, user flows, edge cases, and notes.
Include real examples for inputs and expected outputs.
Be kept in sync with the actual code logic.

7. Design for Future Change
Write code that is future-proof — avoid tightly coupled or rigid designs.
Prefer flexible configs, extensible logic, and replaceable components.
Think 3 steps ahead in terms of growth and complexity.
8. Follow Best Practices for Structure, Quality, and Testing
Use:
Type safety, linting, and naming conventions.
Unit/integration testing, with clean mocks/stubs.
Environment-aware configs (for dev, staging, prod).
Logging and error boundaries.

9. Act Like a Professional Engineer
you should act like a senior-level engineer, not a script writer.
Every suggestion must reflect careful planning, clean logic, and dev empathy.
10. Always be aware of previous development stages when working on the current stage. Past stages are fully complete and comprehensively tested, so you must not break their functionality while implementing new features.
11. After modifying existing or creating new components, pages, routes, etc., always update the D:\UpSchool\frontend-development-plan.md and any relevant documentation files inside D:\UpSchool\docs.

{
  "project": "UpSchool School SaaS Frontend",
  "rules": {
    "0": {
      "title": "Mobile-First Design",
      "description": "All code must be designed with mobile-first principles, ensuring a modern and responsive user experience across all devices."
    },
    "1": {
      "title": "Write Only Production-Ready, Secure Code",
      "description": "All code must be industry-grade, robust, and safe for production. No quick fixes or hacky workarounds allowed. Security, error handling, and stability are non-negotiable priorities."
    },
    "2": {
      "title": "Prioritize Modularity, Scalability, and Clean Architecture",
      "description": "Apply modern architecture principles — Modular, DRY, SoC. All logic should be isolated into appropriate services, utilities, hooks, modules, etc. Code should be easy to scale, extend, test, and maintain."
    },
    "3": {
      "title": "Fix Bugs Deeply, Without Duplication",
      "description": "Investigate the root cause of bugs; do not patch superficially. Bug fixes must be clean, without introducing code duplication or temporary logic. Refactor responsibly if needed to eliminate the actual cause."
    },
    "4": {
      "title": "Respect and Align with Backend Infrastructure",
      "description": "Strictly follow backend data models, authentication flows, role systems, validations, and multi-tenancy logic. Never bypass or override backend logic in the frontend for ease. Treat backend as the source of truth and validate accordingly."
    },
    "5": {
      "title": "Do Not Fake Fixes to Pass Tests",
      "description": "Do not simplify logic or hardcode responses just to pass test cases. Fix the actual issue causing the failure, even if it's deep or architectural. Code should pass tests because it is functionally correct, not tricked."
    },
    "6": {
      "title": "Maintain and Use Documentation",
      "description": "All relevant .md files in docs/ must be referred to when building or modifying features. If a feature, endpoint, parameter, or flow is added/modified — the corresponding .md must be updated. Each module or feature doc should describe endpoints, parameters, user flows, edge cases, and notes with real examples."
    },
    "7": {
      "title": "Design for Future Change",
      "description": "Write code that is future-proof — avoid tightly coupled or rigid designs. Prefer flexible configs, extensible logic, and replaceable components. Think 3 steps ahead in terms of growth and complexity."
    },
    "8": {
      "title": "Follow Best Practices for Structure, Quality, and Testing",
      "description": "Use type safety, linting, and naming conventions. Implement unit/integration testing with clean mocks/stubs. Use environment-aware configs for dev, staging, and prod. Apply logging and error boundaries."
    },
    "9": {
      "title": "Act Like a Professional Engineer",
      "description": "Act like a senior-level engineer, not a script writer. Every suggestion must reflect careful planning, clean logic, and developer empathy."
    },
    "10": {
      "title": "Stage Awareness",
      "description": "Always be aware of previous development stages when working on the current stage. Past stages are fully complete and comprehensively tested, so do not break their functionality while implementing new features."
    },
    "11": {
      "title": "Update Plans and Docs After Changes",
      "description": "After modifying or creating new components, pages, routes, etc., always update D:\\UpSchool\\frontend-development-plan.md and any relevant documentation files inside D:\\UpSchool\\docs."
    }
  }
}
