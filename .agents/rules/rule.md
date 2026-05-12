---
trigger: always_on
---

Never print, expose, delete, overwrite, or commit .env files.
Use .env.example for documentation only.

Before doing any coding work in this project, always read projectcontext.md and the move out plan.md promt 

This project is an existing MoveOut MVP. Do not rebuild from scratch. Work phase by phase only.

Always begin with a short plan. For large tasks, use Plan Mode and create an implementation plan before editing files.

Never expose, print, overwrite, delete, or commit .env files or Supabase secrets.

Never make unrelated changes. Only modify files needed for the current phase.

For UI work, build mobile-first and app-like layouts. User and Provider panels must use bottom navigation. Admin can use dashboard/sidebar style.

Keep Customer, Provider, and Admin flows separate and organized.

After every change, run TypeScript/build checks if safe. If a command may modify or delete files, ask for approval first.

At the end of every task, summarize:
1. Files changed
2. What was completed
3. What was not completed
4. Next recommended step