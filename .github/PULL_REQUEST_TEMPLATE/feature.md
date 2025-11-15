---
name: "✨ Feature PR"
about: "Use this template when adding a new feature or enhancement."
---

# 🚀 Feature Pull Request Checklist

## 📝 Summary
<!-- Provide a concise summary of the changes in this PR -->
- Related Issue(s): #  
- Type of Change: (Feature, Refactor, Docs update, etc.)

## ❓ What? 
*What's changed?*

---

## ❓ Why?
*Why was the change implemented?*

---

Before merging a new feature, please review the following items to ensure code quality, consistency, and stability across the stack.

## 🧠 General

- [ ] PR title and description clearly describe the feature and any relevant context.
- [ ] The branch is **up-to-date** with the target branch (e.g. `main` or `develop`).
- [ ] No unrelated changes or leftover test/debug code are included.
- [ ] Commits are **squashed** or **meaningfully structured**.

---

## 💻 Code Quality (TypeScript / React / Next.js)

- [ ] All components, hooks, and utilities follow **TypeScript best practices** (types/interfaces are explicit and accurate).
- [ ] Code is **modular**, **reusable**, and adheres to project conventions.
- [ ] Props, state, and effects are **typed correctly** and avoid unnecessary `any`.
- [ ] **Next.js** features (e.g. `getServerSideProps`, `getStaticProps`, `app router`, etc.) are implemented according to standards.
- [ ] No **unused imports**, **console logs**, or **linting errors** remain.
- [ ] The feature has been **manually tested** in both development and production builds.

---

## 🎨 Styling (TailwindCSS)

- [ ] Tailwind utility classes follow the project’s **naming conventions** and **responsive design patterns**.
- [ ] No **inline styles** are used unless absolutely necessary.
- [ ] The feature is **visually consistent** with existing UI components and theme.
- [ ] **Dark mode** and **accessibility (a11y)** considerations are handled where applicable.

---

## 📖 Documentation & Storybook

- [ ] A corresponding **Storybook story** has been added or updated for all new/modified components.
- [ ] Component stories demonstrate key states (default, loading, error, etc.).
- [ ] **README** or **inline documentation** (JSDoc / comments) is clear and up to date.

---

## 🧪 Testing (Unit, Integration, E2E)

- [ ] Unit tests are added or updated (React Testing Library / Jest).
- [ ] Playwright **end-to-end tests** exist for major user flows or new pages.
- [ ] All tests **pass locally** and in **CI**.
- [ ] No flaky or skipped tests remain.

---

## 🔍 Review & Approval

- [ ] Code has been **peer-reviewed** by at least one other team member.
- [ ] Reviewer has verified **functionality**, **design**, and **performance**.
- [ ] Any requested changes have been **addressed and re-reviewed**.

---

✅ **Ready to Merge!**  
Once all the above items are complete and CI/CD checks pass, this feature PR can be safely merged into the target branch.
