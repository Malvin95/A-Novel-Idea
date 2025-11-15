---
name: "🐛 Bugfix PR"
about: "Use this template when fixing a defect or regression."
---

# 🐛 Bugfix Pull Request Checklist


## ❓ What? 
*What's changed?*



---

## ❓ Why?
*Why was the change implemented?*



---



Before merging a bugfix, please ensure the issue is properly understood, resolved, and verified.

---

## 🧠 General

- [ ] PR title and description clearly explain the **root cause**, **fix**, and any **related issues** (include links to tickets if applicable).
- [ ] The branch is **up-to-date** with the target branch.
- [ ] No unrelated changes or leftover test/debug code are included.
- [ ] Commits are **squashed** or **meaningfully structured**.

---

## 💻 Code Quality

- [ ] The bug’s root cause has been **identified and documented** (in comments or issue tracker).
- [ ] The fix is **scoped only** to the affected area — no unintended side effects.
- [ ] **TypeScript types** are correct and updated if the fix affected data structures or props.
- [ ] Code passes **linting** and **build checks** without errors.
- [ ] Relevant **manual testing** has been performed (steps documented below).

---

## 🧪 Testing & Verification

- [ ] A **unit test** reproducing the bug has been added (and now passes).
- [ ] A **Playwright or integration test** confirms the fix in a real flow.
- [ ] Existing tests are unaffected and **all tests pass**.
- [ ] The bug no longer occurs in the latest environment build.

> 🧾 **Manual test steps:**  
> _List steps to reproduce and confirm the fix here:_
> 1.  
> 2.  
> 3.  

---

## 🔍 Review & Approval

- [ ] Code reviewed by at least one other team member.
- [ ] Reviewer has confirmed that the issue is resolved and no regressions are introduced.
- [ ] All requested changes have been addressed.

---

✅ **Ready to Merge!**  
This bugfix has been verified, tested, and approved for merge.
