# Project File Structure

This document outlines the file and folder structure of the Belaroule Admin panel project.

## Root Directory

- **`index.html`**: The main HTML entry point for the Vite application. Contains the root `<div id="root">` where the React app is mounted.
- **`package.json` & `package-lock.json`**: NPM configuration files that define project metadata, scripts (like `npm run dev` and `build`), and the required dependencies (Material UI, Radix UI, Motion, Tailwind, etc.).
- **`vite.config.ts`**: Configuration file for the Vite bundler, defining plugins (like React) and dev server settings.
- **`postcss.config.mjs`**: Configuration for PostCSS, primarily used to process Tailwind CSS.
- **`README.md`**: The standard markdown documentation file for the project.
- **`docs/` & `guidelines/`**: Directories containing project documentation and coding styling guidelines for the developers.
- **`templates/`**: Directory for application templates (such as email designs or boilerplate codes).
- **`LOGIN_CREDENTIALS.md`**: Contains information on the credentials used for signing in as different admin roles during development.
- **`DATE_FORMAT_CHANGES.md`**: Documentation regarding the date formats heavily used and synchronized across the application.
- **`bela/`**: Folder potentially containing project-specific design source files, reference data, or backend stubs.

---

## `src/` Directory

The `src` directory contains the core source code for the React application.

### `src/app/`
Contains the core frontend application logic and UI structure.
- **`App.tsx`**: The main root React component of the application. It handles routing and initializes the main dashboard layout.

#### `src/app/components/`
This is the largest directory containing all the React component views building the admin panel UI. They are broadly categorized as:
- **Management Views**: Files ending in `Management.tsx` (e.g., `CategoryManagement.tsx`, `PostsManagement.tsx`, `FlaggedPostsManagement.tsx`) are page-level components displaying data tables and lists of specific resources.
- **Detail Views**: Files ending in `Detail.tsx` (e.g., `UserDetail.tsx`, `FlaggedCommentDetail.tsx`) handle the individual view/edit operations for a single resource item.
- **Global Layout Elements**: Components like `GlobalHeader.tsx`, `Sidebar.tsx`, and `Dashboard.tsx` form the main layout framework of the admin panel.
- **Authentication**: `Login.tsx` handles administrative user sign-in functionality.
- **Forms & Settings**: Components like `ChangePassword.tsx`, `MyProfile.tsx`, `AppConfiguration.tsx` handle settings and user profiles.
- **Reports**: Components ending in `Report.tsx` (e.g., `OOTDReport.tsx`, `APIConsumptionReport.tsx`) render complex analytics and data visualizations.
- **Communication Tools**: `AddBulkEmail.tsx`, `BulkNotifications.tsx` allow admins to send broadcast messages directly to platform users.

### `src/assets/`
Contains static assets like images, icons, and logos that are imported directly into `.tsx` files.
- Example: The main logo `1b7ab447194c5f0fc1b269452281b2173e53bd29.png`.

### `src/styles/`
Contains global CSS styling and themes.
- Defines Tailwind CSS directives and specific project design tokens that dictate the look and feel.

### `src/utils/`
Contains utility functions, helper methods, API fetchers, and reusable logic that are not directly tied to UI component rendering (e.g., formatting dates, parsing strings).

### `src/mockAPI/`
Contains mock code used for frontend development.
- Files here (like `navigationData.ts`) provide hard-coded mock data that mimics the expected structure of real backend API responses, allowing the UI to be built quickly offline.

### `src/types/`
Contains global TypeScript definitions for the project, storing interfaces and types for API responses, user records, and component props to ensure type safety.

### Root Level Files in `src/`
- **`main.tsx`**: The entry script that bootstraps the React application by injecting the root `<App />` component into the `index.html` file.
