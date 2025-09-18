# OpZ

> _*OpZ* is my developer operation center — a cockpit for my daily work._

> [!NOTE]  
> This is a personal playground and learning project.  
> It is not intended for production use.

## Features

> _Whatever makes sense to make this the cockpit for my daily work._

### User Facing Features

- [x] Scan for local git repositories
- [x] List local repositories in a tree view
- [x] Configure repositories scanning
- [ ] Connect GitHub and GitHub Enterprise accounts
- [ ] Link local repositories to remote repositories
- [ ] List remote repositories from connected accounts
- [ ] Open repositories in terminal, editor, file manager, browser, etc.
- [ ] Show repository details (branches, remotes, last commit, etc.)
- [ ] Show repository status (uncommitted changes, unpushed commits, etc.)
- [ ] Show recent activity (commits, pull requests, issues, etc.)
- [ ] Filter repositories by name, status, activity, etc.
- [ ] Sort repositories by name, status, activity, etc.
- [ ] Star/favorite repositories
- [ ] Connect Jira and Confluence accounts
- [ ] Link repositories to Jira projects and Confluence spaces
- [ ] Show Jira issues and Confluence pages related to repositories
- [ ] Show notifications from connected accounts

### UI Features

- [x] Simple, clean, responsive UI
- [x] Dark and light themes (follows OS theme by default)
- [x] Theming Variables System based on
      [GitHub Primer Primitives](https://primer.style/primitives/)
- [x] Icons via [GitHub Primer Octicons](https://primer.style/octicons/)
- [x] Menu Bar
- [x] Resizable Panes
- [x] Settings Page
- [ ] Status Bar
- [ ] Log View

### Technical Features

- [x] strictly separated backend and frontend structure with shared types
  - 📂 [./src/backend](./src/backend)
  - 📂 [./src/frontend](./src/frontend)
  - 📂 [./src/shared](./src/shared)
- [x] strongly typed inter-process communication with:
  - async invokes (_"request-response"_: Frontend ⇄ Backend)
  - events (_"fire-and-forget"_: Backend → Frontend)
- [x] combined logging system for backend and frontend with
  - log levels depending on environment (development/production)
  - log transports (console and file with rotation)
- [x] Settings Management
  - [ ] secure and reliable storage of sensitive data (e.g. OAuth tokens)
- [ ] separate tsconfigs for backend and frontend
- [ ] separate eslint configs for backend and frontend
- [ ] unit tests for backend and frontend
- [ ] end-to-end tests

## Development

_OpZ_ is made with [Electron](https://www.electronjs.org/), that brings
together:

- A web frontend (TypeScript + Vite + Vue + SCSS)
- A node.js backend (TypeScript + Electron)

### Requirements

- a linux-based operating system
- node.js (v22) via [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/) (v10)

### Setup

```bash
git clone git@github.com:simbo/opz.git
cd opz
nvm install
pnpm install
pnpm run dev
```

## License

[MIT © Simon Lepel](http://simbo.mit-license.org/2025/)
