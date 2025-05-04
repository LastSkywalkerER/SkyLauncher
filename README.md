# Minecraft Core

A modern Minecraft launcher built with a robust architecture combining Feature-Sliced Design for the frontend and Domain-Driven Design for the backend.

## Project Structure

The project is organized into three main parts:

### 1. Renderer (Frontend)
Built using Feature-Sliced Design architecture, the renderer is organized into the following layers:

```
renderer/
├── app/                 # Application configuration, routing, and core setup
├── pages/              # Complete screens and layouts
├── widgets/            # Complex UI components that may depend on features
├── features/           # Business logic and UI components for specific features
├── entities/           # Business entities
├── shared/             # Reusable low-level components and utilities
```

#### Component Structure
Each component in `features`, `widgets`, `shared/ui`, and `pages` follows this pattern:

```
my-component/
├── ui/
│   └── my-component.ui.tsx           # UI component
├── hooks/
│   └── use-my-component.hook.ts      # Custom hooks
├── services/
│   └── my-component.service.ts       # API or business logic
├── styles/
│   └── my-component.module.css       # CSS modules
├── interfaces/
│   └── my-component.types.ts         # Types and interfaces
└── index.ts                          # Component exports
```

### 2. Main (Backend)
Built using Nest.js with Domain-Driven Design principles:

```
main/
├── libs/              # Library-dependent modules and environment-specific code
├── modules/           # Core launcher business logic modules
└── utils/             # Reusable utility functions
```

#### Module Structure
Each module follows this pattern:

```
my-module/
├── my-module.module.ts
├── my-module.controller.ts
├── my-module.service.ts
├── interfaces/
│   └── my-module.interface.ts
└── submodules/
    ├── profile/
    │   ├── profile.module.ts
    │   ├── profile.controller.ts
    │   ├── profile.service.ts
    │   └── interfaces/
    │       └── profile.interface.ts
    └── settings/
        ├── settings.module.ts
        ├── settings.controller.ts
        ├── settings.service.ts
        └── interfaces/
            └── settings.interface.ts
```

### 3. Shared
Contains common code and utilities used by both renderer and main:

```
shared/
├── types/             # Shared TypeScript types
├── constants/         # Shared constants
└── utils/             # Shared utility functions
```

## Architecture Principles

### Frontend (Renderer)
- **Feature-Sliced Design**: Clear separation of concerns with distinct layers
- **Component Independence**: Features are self-contained and only depend on lower-level APIs and entities
- **Reusable UI**: Widgets provide complex UI components that can be composed into pages
- **Low-Level Components**: Shared layer provides foundational components and utilities

### Backend (Main)
- **Domain-Driven Design**: Business logic organized around domain concepts
- **Modular Architecture**: Clear separation of concerns with independent modules
- **Nest.js Framework**: Leveraging Nest.js for scalable and maintainable backend architecture

## Naming Conventions

- **Renderer Components**: PascalCase for component files, kebab-case for other files
- **Main Modules**: kebab-case following Angular style guide
- **Shared Code**: Consistent with the respective layer's conventions

# SkyLauncher

Run command for launch on Mac
```bash
sudo xattr -rd com.apple.quarantine /Applications/SkyLauncher.app
```

An Electron minecraft launcher

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Environment Configuration

Before running the project, you need to set up your environment variables. Create a `.env` file in the root directory based on the `.env.example` template below:

```env
# API Keys and Base URLs
MAIN_VITE_CURSEFORGE_APIKEY=your_curseforge_api_key
// url should provide java versions in such way your_java_url/<platform>/<architecure>/<javaversion>.zip
MAIN_VITE_JAVA_BASE_URL=your_java_url

# Renderer Configuration
RENDERER_VITE_BASE_URL=https://api.freshcraft.org/
RENDERER_VITE_WEB_URL=https://freshcraft.org
RENDERER_VITE_TERMS_URL=https://freshcraft.org
RENDERER_VITE_XBOX_URL=https://freshcraft.org/profile
RENDERER_VITE_ICON_URL=https://ipfs.io/ipfs/QmbpHKyw9Fyos1Jhk5CsEFwM2uN14bYJ9W1SRWUktXpQQa
RENDERER_VITE_COVER_URL=https://ipfs.io/ipfs/QmQMy5KZWkE7BAyEPtRqyjaSkXsHda2ZzCC8kFbyV8V9em
RENDERER_VITE_CURSEFORGE_APIKEY=your_curseforge_api_key

# Renderer Supabase Integration for getting premium modpacks
RENDERER_VITE_SUPABASE_URL=your_supabase_url
RENDERER_VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# UI Configuration
VITE_UI_TYPE=FreshCraft
```

### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win:freshcraft

# For macOS
$ yarn build:mac:freshcraft

```
