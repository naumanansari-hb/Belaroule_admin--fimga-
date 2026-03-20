# Reward Management > Task Configurations (Figma Specification)

## FRD Reference
- Module: 8. Reward Management
- Section: 8.1 Task Configurations
  - 8.1.1 Task Configuration (Listing Screen)
  - 8.1.2 Task Configuration (Details Screen)

Source: AI FRD - Bellaroule (20).pdf fileciteturn18file0L1-L292

---

## Module Purpose
Reward Management allows Super Admin to configure and control how reward points are earned and spent across the platform, while keeping core task definitions and trigger conditions system-controlled.

Admin can manage:
- Reward points assigned to tasks
- Task frequency and limits
- Enable/Disable tasks

Actors:
- Super Admin
- System (reward engine auto evaluates and applies reward logic) fileciteturn18file0L1-L18

---

## Access Control
Access to: **Super Admin Only** fileciteturn18file0L19-L26

Preconditions:
- Admin must be logged in with Super Admin credentials
- Admin must have access to Reward Management
- System reward engine must be active fileciteturn18file0L25-L30

---

## Sidebar Navigation
- Reward Management
  - Task Configurations

---

# 8.1.1 Task Configuration — Listing Screen

## Screen Purpose
Display all predefined reward-related tasks (Earn + Spend) in one interface with configuration controls. fileciteturn18file0L31-L43

---

## Navigation Rules
- Reward Management → Task Configurations → Listing screen
- Click task row OR click Edit action → open Task Configuration Detail screen fileciteturn18file0L44-L53

---

## Business Rules (Critical)
Tasks are **system predefined**:
Admin cannot:
- Create tasks
- Delete tasks
- Modify trigger conditions

Admin can:
- Edit reward points
- Edit frequency type
- Edit max count (if applicable)
- Enable/Disable task

Changes apply immediately after saving. fileciteturn18file0L54-L66

---

## Task Categorization (Read-only)
Each task has:
- Task Category (mandatory, system-defined, human readable)
- Category used for filtering, reporting, and AI reward governance fileciteturn18file0L67-L80

Task Categories (system-defined):
- Onboarding & Profile
- Login & Streak
- Wardrobe & Outfit
- Community Engagement
- Feature Consumption fileciteturn18file0L81-L99

---

## Task Classification (Read-only)
Task Type:
- Earn Task
- Spend Task fileciteturn18file0L100-L111

---

## Listing Table (Structure)

### Table Columns fileciteturn18file0L112-L160
- Task Name
- Task Category (full label)
- Task Type (Earn / Spend)
- Trigger Condition (system-defined; read-only)
- Reward Points (editable)
- Frequency Type (editable)
- Max Count (editable)
- Status (Enabled / Disabled)
- Last Modified By (system populated)
- Last Modified Date (system populated)
- Action: Edit

---

## Unified Predefined Task List (must show all tasks)
The listing includes predefined Earn and Spend tasks such as:
- User Registration (50 points, Once)
- Onboarding Completed (Auto, Once) — system calculated
- Daily Login Day 1..6 (10..60 points, Daily)
- Weekly Streak Bonus (100 points, Weekly)
- Engagement tasks: Like Post, Comment Post, Follow User
- Spend tasks: Add Wardrobe Slot, Buy Wardrobe Space, Roll the Dice, Restore Streak, Virtual Try On fileciteturn18file0L160-L240

---

## Filters
- Task Category
- Task Type (Earn/Spend)
- Frequency Type (Once/Daily/Weekly/Monthly/Lifetime/Per Use)
- Status (Enabled/Disabled)
- Task Name (search by name) fileciteturn18file0L241-L258

---

## Sorting Rules
- Task Name (A–Z / Z–A)
- Reward Points (Asc / Desc)
- Frequency Type
- Last Modified Date (Latest First — default) fileciteturn18file0L259-L266

---

## Pagination
- Server-side pagination
- Default page size: 10
- Options: 10 / 25 / 50
- Controls: Next/Previous, Page Number navigation
- Display total record count
- Empty state if no tasks available fileciteturn18file0L241-L247

---

## Edge Cases
- No tasks available → empty state message
- Disabled tasks must not trigger reward logic
- Prevent duplicate updates (if same status already applied)
- System-calculated tasks must remain protected from invalid edits fileciteturn18file0L267-L274

---

## Acceptance Criteria
- Admin can identify daily streak tasks clearly
- Filtering by Login & Streak works
- Earn and Spend tasks distinguishable
- System-calculated tasks remain protected
- Audit fields update immediately on change fileciteturn18file0L275-L282

---

# 8.1.2 Task Configuration — Detail Screen

## Screen Purpose
View complete information of a predefined reward task and edit only allowed fields, keeping system logic protected. fileciteturn18file0L283-L303

---

## Navigation Rules
- Entry:
  - click Edit from listing
- Admin actions:
  - Save changes → return to listing
  - Cancel → return to listing
- Only one task can be edited at a time fileciteturn18file0L304-L316

---

## Screen Layout & Sections

### Section 1: Task Information (Read-only)
Fields:
- Task Name
- Task Category
- Task Type
- Trigger Condition
- Task Description (if available) fileciteturn18file0L317-L336

---

### Section 2: Reward Configuration (Editable)
Fields:
- Reward Points (numeric)
- Frequency Type (Once / Daily / Weekly / Monthly / Lifetime / Per Use)
- Max Count (numeric, optional)
- Status (Enabled / Disabled) fileciteturn18file0L337-L352

---

### Section 3: System-Controlled Logic (Read-only)
Visible only for special system tasks.

#### Onboarding Completed Task
- Points auto-calculated by summing onboarding tasks:
  - User Registration
  - Full Name Added
  - Age Group Selected
  - Body Shape Added
  - Color Preference Added
  - Valid User Image Uploaded
  - Style Preference Added
  - First Outfit Added
- Admin can override final reward points
- Calculation logic not editable
- Frequency fixed as Once fileciteturn18file0L353-L377

---

### Section 4: Audit Information (Read-only)
- Last Modified By
- Last Modified Date (DD/MM/YYYY HH:MM) fileciteturn18file0L378-L388

---

## Business Rules
- Task Name, Category, Type, Trigger Condition are system-defined and immutable
- Admin cannot create/delete/modify trigger conditions
- Admin can update points/frequency/max count and enable/disable
- Changes apply immediately after save
- Disabled tasks do not grant or consume points fileciteturn18file0L389-L410

---

## Error & Validation
- Inline validation on invalid values
- If save fails → show error message and retain entered values
- If task system-restricted → hide/disable invalid fields
- Prevent duplicate status update on already-disabled task fileciteturn18file0L411-L421

---

## Acceptance Criteria
- Admin can view full task details clearly
- Admin can edit only allowed fields
- System-calculated tasks clearly marked
- Audit fields update correctly on save
- Reward execution reflects changes immediately
- Navigation back to listing works without data loss fileciteturn18file0L422-L432