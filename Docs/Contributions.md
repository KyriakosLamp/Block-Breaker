# Contributing Guide

This project is developed by three contributors working in parallel.
The goal of this guide is to keep the workflow clean, simple and easy to audit.

---

## Branching

- Create a branch `dev` where everyone uploads their changes.
- On branch `main` we will have the final merge once all tasks regarding the code are completed.

---

## Keeping Commits Up to Date
 
Before starting work each session and before opening a pull request, sync your branch with the latest `dev`:
 
```bash
git checkout dev
git pull origin dev
```

---

## Commits

- Use **conventional commits** to keep commit history readable and consistent.
- Each commit message must start with a type, followed by a short description.
- Commit messages should be:
  - short,
  - self-explanatory and
  - focused.
- Conventional Commits Basic Dictionary:
  - `feat: a new feature`  
    feat(<filename>): add live update polling

  - `fix: a bug fix`  
    fix(<filename>): correct comment sort order

  - `refactor: code restructuring without changing behavior`  
    refactor(<filename>): simplify batch fetch logic

  - `docs: documentation changes`  
    docs(<filename>): update README with setup steps

  - `test: adding or updating tests`  
    test(<filename>): add edge case for empty comments

  - `style: formatting only (no logic changes)`  
    style(<filename>): format indentation in feed.js

  - `chore: maintenance tasks`  
    chore(<filename>): update .gitignore

---