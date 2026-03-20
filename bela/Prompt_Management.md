Prompt Management > Prompts & API Setting 

## FRD Reference
- Module: 8. Prompt Management
- File: AI FRD - Bellaroule (19).pdf fileciteturn17file0L1-L18

---

## Scope
The **Prompt Management** module allows administrators to centrally manage:
- All AI prompts used across the platform
- Their associated variables
- Version history and rollback (restore)
- LLM Provider / Model API configurations

This module is designed to:
- Support model/provider upgrades
- Allow safe prompt editing without breaking variable contracts
- Maintain strict version control with rollback capability
- Ensure backend services always receive stable variables, even if prompt text changes fileciteturn17file0L1-L12

---

## Key Design Principle (Critical)
- **Prompt text is mutable**
- **Variables are immutable contracts**

Once a variable is defined and linked to a prompt, it must NOT be renamed or deleted. fileciteturn17file0L13-L18

---

## Actors / Access
- **Super Admin**: full control (prompts, variables, versions, restoration, API config) fileciteturn17file0L9-L12
- **Sub Admin (Authorized)**: view/edit prompts only (no delete, no overwrite history) fileciteturn17file0L9-L12

---

## Sidebar Navigation
- Prompt Management
  - Prompts and API Setting
  - API Configuration

---

# 8.1 Prompt Listing (Prompts and API Setting)

## Access
Super Admin only fileciteturn17file0L19-L24

## Purpose
Central inventory of all AI prompts with governance metadata, and entry point for prompt lifecycle management. fileciteturn17file0L31-L38

## Navigation Rules
- Sidebar → Prompt Management → Prompts and API Setting fileciteturn17file0L39-L44
- Click any prompt row → Prompt Details screen
- Back from details returns to listing preserving:
  - search
  - filters
  - pagination state fileciteturn17file0L43-L45

## Business Rules
- Read-only listing
- No prompt creation or deletion
- Prompts are system-defined and backend-driven
- Prompt Key is immutable and unique
- Status affects runtime but does not delete data fileciteturn17file0L46-L53

## Listing Columns
1. Prompt Key (immutable; e.g., OOTD_GENERATION_V1)
2. Prompt Name (editable only from details)
3. Module / Context (e.g., OOTD, Wardrobe AI, Mood Analysis)
4. Variables Count
5. Current Version (e.g., v5)
6. Last Updated By
7. Last Updated On (DD/MM/YYYY HH:MM)
8. Status (Active / Inactive) fileciteturn17file0L54-L83

## Actions
- Row click → open Prompt Details
- No inline edit
- No delete
- No bulk actions fileciteturn17file0L84-L90

## Search
Search by:
- Prompt Key
- Prompt Name
Case-insensitive, server-side fileciteturn17file0L91-L99

## Filters
- Module / Context (dropdown, backend values)
- Status (Active / Inactive)
- Last Updated Date Range (From–To) fileciteturn17file0L100-L112

## Sorting
- Default: Last Updated On desc
- Optional sortable: Prompt Name, Module/Context, Status fileciteturn17file0L113-L118

## Empty States
- No prompts:
  - “No prompts are configured in the system.” fileciteturn17file0L121-L124
- No results after filter/search:
  - “No prompts match the selected criteria.” fileciteturn17file0L125-L127

## Error Handling
- Backend unavailable → non-blocking message + Retry
- Partial failure → placeholder values + warning banner fileciteturn17file0L128-L133

## Non-Functional Requirements
- Load time < 3 sec for up to 50 records
- Supports scalability (1000+ prompts)
- No sensitive AI/API data exposed on listing
- Stored timezone UTC, display admin local timezone fileciteturn17file0L134-L142

## Pagination
- Server-side
- Default 10 records
- Options 10/25/50
- Controls: Next/Previous, page navigation
- Show total record count fileciteturn17file0L143-L150

---

# 8.2 Prompt Details

## Access
Super Admin only fileciteturn17file0L151-L154

## Purpose
Edit prompt safely with immutable variables and full audit/versioning. fileciteturn17file0L167-L173

## Navigation Rules
- Access from listing row click
- Save → remain on details screen
- Cancel/Back → return to listing (preserve listing state) fileciteturn17file0L174-L180

## Screen Sections

### A) Prompt Metadata Section
Fields:
- Prompt Key (Read-only)
- Prompt Name (Editable)
- Module/Context (Read-only)
- Current Version (Read-only)
- Status (Editable: Active/Inactive) fileciteturn17file0L183-L205

### B) Prompt Content Section
Component:
- Rich Text Editor
Supports:
- line breaks
- bullets
- paragraph formatting

Rules:
- Prompt stored as plain text for execution
- Variables referenced as {{variable_name}} fileciteturn17file0L206-L223

### C) Variables Configuration Section (Read-only)
Table Columns:
- Variable Name (e.g., {{user_mood}})
- Description
- Data Type (string/number/array/object)
- Required (Yes/No)
- Sample Value
- Used in Prompt (Yes/No auto detected) fileciteturn17file0L224-L236

Business Rules:
- Variables cannot be edited/renamed/deleted from this screen
- Unknown variables block Save
- Required variable missing usage → Warning only (Save allowed)
- Save creates new version (does not overwrite) fileciteturn17file0L237-L254

## Actions
- Save
- Cancel fileciteturn17file0L247-L254

## Validations
- Prompt content cannot be empty
- Variable syntax must match configured variables exactly
- Prompt name cannot be empty
- Status change does not affect historical versions fileciteturn17file0L255-L261

## Error Handling
- Save failure → show error, retain unsaved editor content
- Concurrent modification → show warning
- Variable mismatch → highlight invalid variable in editor fileciteturn17file0L262-L270

## Audit & Logging
System logs:
- Prompt edited
- Prompt status changed
Log includes: admin user, timestamp, prompt key, new version number fileciteturn17file0L271-L281

---

# 8.3 Prompt Version History

## Access
Super Admin only fileciteturn17file0L282-L285

## UI Type
Modal dialog OR side panel (UI decision) fileciteturn17file0L297-L304

## Business Rules
- Only last **5 versions** retained and displayed
- Ordered by most recent first
- Read-only history
- Restore option only for non-current versions fileciteturn17file0L305-L318

## Version List Fields
- Version Number (v1…v5)
- Saved On (DD/MM/YYYY HH:MM)
- Saved By
- Change Summary (auto; optional manual note)
- Actions:
  - View (read-only)
  - Restore (if applicable) fileciteturn17file0L319-L338

## Validation
- Current version → Restore disabled
- Missing version data → error and disable restore fileciteturn17file0L339-L346

## Edge Cases
- Only one version exists → restore hidden/disabled
- Backend has >5 versions → only last 5 shown fileciteturn17file0L347-L356

---

# 8.4 Restore Prompt Version

## Access
Super Admin only fileciteturn17file0L357-L360

## Restore Flow
1. Admin clicks Restore (from Version History)
2. Confirmation modal:
   “Restoring this version will create a new active version.
    The current version will remain in history.
    Do you want to continue?”
3. Buttons: Confirm Restore / Cancel fileciteturn17file0L385-L397

## Business Rules
- Restore is non-destructive (does not overwrite)
- Restore creates new version number (e.g., v8)
- Restored content becomes active version
- Variables remain unchanged but must be revalidated fileciteturn17file0L398-L410

## Validation Rules
- Unknown variables → restore blocked + error
- Required variables missing → warning + restore blocked
- Current version cannot be restored again fileciteturn17file0L411-L420

## Acceptance
- Restore creates new active version
- Version history remains intact
- All actions logged fileciteturn17file0L441-L448

---


# 8.5 API Configuration Listing

## Access
Super Admin only fileciteturn17file0L449-L454

## Purpose
List all configured LLM providers/models and identify active/default configs. fileciteturn17file0L455-L462

## Business Rules
- Read-only listing
- Sensitive data (API keys) never displayed
- Only one Default Model per provider at a time fileciteturn17file0L463-L471

## Listing Columns
- API Provider Name
- Model Name
- Provider Type (OpenAI/Google/Anthropic/Custom)
- API Base URL (masked)
- Default Model (Yes/No)
- Status (Active/Inactive)
- Last Updated By
- Last Updated On (DD/MM/YYYY HH:MM) fileciteturn17file0L472-L487

## Filters
- Provider Name
- Status
- Default Model (Yes/No) fileciteturn17file0L488-L495

## Pagination
- Server-side (10 default; 10/25/50)
- Empty: “No LLM configurations available. Add a new configuration to get started.” fileciteturn17file0L496-L503

---

#Prompt Management > AI API configuration (Sub menu)

# 8.6 API Configuration — Details Screen

## Access
Super Admin only fileciteturn17file0L504-L507

## Purpose
Add/Update LLM Provider + Model settings safely without code changes. fileciteturn17file0L508-L513

## Navigation Rules
- Access from API listing row click
- Save → redirect to Listing
- Cancel → discard changes and return to Listing fileciteturn17file0L514-L520

## Screen Sections & Fields

### A) Provider Information
1. LLM Provider Name (Text; mandatory)
2. Provider Type (Dropdown: OpenAI/Google/Anthropic/Custom)
3. API Base URL (Text; mandatory; valid URL) fileciteturn17file0L525-L539

### B) Model Configuration
4. Model Name (Text; mandatory)
5. Model Version (Optional)
6. Default Model (Toggle Yes/No)
- Only one Default per provider allowed fileciteturn17file0L540-L547

### C) Authentication & Security
7. API Key (Password field)
- Encrypted storage
- Masked after save
- Never displayed in full again
8. Key Label (Optional) fileciteturn17file0L548-L556

### D) Runtime Controls
9. Timeout (ms) (Numeric)
10. Max Tokens (Numeric)
11. Temperature (Decimal 0.0–1.0) fileciteturn17file0L557-L563

### E) Status
12. Status (Active / Inactive) fileciteturn17file0L564-L566

## Business Rules
- API keys stored encrypted, never returned by APIs
- Default model change auto-unsets previous default model for provider
- Inactive models cannot be used at runtime
- Delete configurations NOT allowed
- Changes must not require app restart fileciteturn17file0L567-L585

## Validation Rules
- Mandatory: Provider Name, API URL, Model Name, API Key
- API URL must be valid
- Numeric fields must be within allowed ranges
- Duplicate provider+model combinations not allowed fileciteturn17file0L586-L593

## Error Handling
- Invalid API key format → validation error
- Save failure → no partial persistence
- Concurrent update → warn user fileciteturn17file0L594-L600

## Audit & Logging
Log:
- LLM config created/updated
- Default model changed
- Status changed
Include: admin user, timestamp, provider+model name fileciteturn17file0L601-L610

---

## Acceptance Criteria (Overall)
- Admin can manage prompts with safe version control
- Variables remain immutable and protected
- Version history limited to last 5 versions
- Restore flow is safe and non-destructive
- API configurations securely stored and masked
- Default model logic correct and enforced
- Inactive prompts/models excluded from runtime execution fileciteturn17file0L611-L622