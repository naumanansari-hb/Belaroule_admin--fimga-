# Home > Site Map — Admin Panel (Figma Specification)

## Scope
This document defines the **Home > Site Map** screen for the BellaRoules Admin Panel.

The Site Map provides a structured view of available modules/screens for the logged-in user.

**Access:**
- Super Admin (Full access)
- Sub Admin (Role-based access; only permitted modules visible)

---

## Navigation Rules
- Accessible via:
  - Sidebar → Home → Site Map (or direct Site Map menu under Home)
- Read-only screen
- Clicking any item navigates to the corresponding module/screen
- Unauthorized modules must be hidden for Sub Admin users

---

## Screen Layout

### Page Title
- “Site Map”

### Structure Type
- Tree-based module navigation list (expand/collapse)
- 2-level hierarchy (Module → Sub-module screens)

---

## Site Map Structure

### Home
- Dashboard
- Site Map
- My Profile

### User Management
- Sub Admins (Super Admin only)
- Users
- Guest Users

### Master Management
- Roles
- Default Wardrobe Item

### Plan Management
- Posts

### Flagged Content Management

- Flagged Users
- Flagged Posts
- Flagged Comments
- Flagged Wardrobe Items
- Flagged Messages

### Prompt Management
- Prompts and API Setting
- AI API Configuration

### Configuration
- Static Pages
- FAQs
- Email Notifications
- System Notifications

### Reports
- Revenue Report
- User Report
- Outfit Generation Report
- Reward Points Report
- API Failure Report

---

## Search Within Site Map
- Search input at top (optional)
- Searches module names and screen names
- Displays filtered tree
- If no match → show “No results found.”

---

## Display Rules
- Items are shown only if user has permission to access them
- Parent category shown only if at least one child is visible
- Expand/collapse state persists during current session

---

## Acceptance Criteria
- Super Admin sees complete Site Map
- Sub Admin sees only authorized modules/screens
- Clicking a site map link routes correctly
- Read-only enforcement
- Empty and no-results states handled gracefully