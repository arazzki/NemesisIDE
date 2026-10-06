# Contributing to Nemesis IDE

Thank you for your interest in contributing to **Nemesis IDE**! 🎉

We welcome contributions from developers of all backgrounds. Whether you are fixing a typo, adding a new language mode, optimizing performance, or implementing major roadmap features, your help is appreciated.

---

## 📋 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please be respectful and constructive in discussions, code reviews, and issue tracking.

---

## 🛠️ How Can You Contribute?

### 1. Reporting Bugs
- Search existing issues before creating a new one.
- Provide a clear and concise description of the bug.
- Include steps to reproduce, expected vs actual behavior, and system environment (OS, Node version).

### 2. Suggesting Enhancements
- Check our [Roadmap in README.md](README.md#-roadmap--how-you-can-contribute).
- Open an issue describing your idea, use cases, and how it benefits developers using Nemesis IDE.

### 3. Submitting Pull Requests (PRs)
1. **Fork** the repository to your own GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/NemesisIDE.git
   cd NemesisIDE
   ```
3. **Create a branch** for your work:
   ```bash
   git checkout -b feat/add-bracket-pair-colorizer
   # or
   git checkout -b fix/editor-tab-overflow
   ```
4. **Make your changes** and test thoroughly:
   ```bash
   npm run build
   ```
5. **Commit your changes** using conventional commit messages (see below).
6. **Push** to your fork and submit a Pull Request against the `main` branch.

---

## 💬 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature for the user or editor
- `fix:` A bug fix
- `docs:` Documentation updates only
- `style:` Formatting changes, missing semicolons, etc.
- `refactor:` Code restructuring without behavioral changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency bumps, build configurations

**Examples:**
- `feat(runner): stream stderr with distinct color highlighting`
- `fix(tabs): prevent closing pinned tabs on accidental click`
- `docs: update installation prerequisites in README`

---

## 💡 Good First Issues

Looking for places to start?
- Add keyboard shortcuts (e.g. `Ctrl + P` quick open file switcher modal)
- Implement split pane / side-by-side editor view
- Add code folding controls to Monaco configuration
- Add more sample templates in the workspace
- Package desktop executable with Electron or Tauri

Thank you for helping make Nemesis IDE awesome! 🚀
