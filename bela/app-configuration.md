# App Configuration

**Module:** Configuration → App Configuration
**Access:** Super Admin | Authorized Sub Admin (role-based)
**Version:** 1.0
**Status:** Ready for Design

---

## Overview

The App Configuration screen enables Super Admins to manage global daily free-usage limits for key app features available to users without reward points or payment. This is a sub-module under the **Configuration** module.

---

## Access Control

| Role | Access |
|---|---|
| Super Admin | Full access — view & edit |
| Sub Admin | Conditional — only if role permission for Configuration → App Configuration is granted |
| Other Roles | No access |

---

## User Stories

| ID | Story |
|---|---|
| US-AC-01 | As a Super Admin, I want to configure how many free OOTDs a user can generate per day, so that I can control feature usage. |
| US-AC-02 | As a Super Admin, I want to configure how many free Virtual Try-Ons a user can access per day, so that premium usage is regulated. |
| US-AC-03 | As a Super Admin, I want to save or discard changes, so that only intended configurations are applied. |

---

## Preconditions

- Admin must be logged in with an active session
- Admin must hold Super Admin access or have explicit role permission for this module
- App Configuration module must be enabled in the system
- Admin must have permission to access: **Configuration → App Configuration**

---

## Navigation

```
Admin Panel → Configuration → App Configuration
```

- Admin can **Save** configuration changes (applies immediately)
- Admin can **Discard** changes to restore previously saved values

---

## Business Rules

| # | Rule |
|---|---|
| BR-01 | All configurations are global and apply to all app users |
| BR-02 | Limits are evaluated per user per day |
| BR-03 | Daily reset occurs automatically based on the system-defined day cycle |
| BR-04 | Changes take effect immediately upon Save — no approval flow |
| BR-05 | No versioning or rollback mechanism is involved |

---

## Screen Fields & Behavior

### Section 1: Free OOTD Limit Configuration

| Field | Type | Default | Behavior |
|---|---|---|---|
| Free OOTD Option | Radio Group | `Limited` | Options: **Limited** / **Unlimited** |
| No. of OOTD Limit | Numeric Input | `1` | Visible only when **Limited** is selected; hidden when **Unlimited** is selected |

**Rules:**
- Selecting **Unlimited** → hides the numeric limit field; stored limit value is ignored
- Selecting **Limited** → shows numeric field; value must be a positive integer
- Limit applies per user per day

---

### Section 2: Free Virtual Try-On Limit Configuration

| Field | Type | Default | Behavior |
|---|---|---|---|
| Free Virtual Try-On Option | Radio Group | `Limited` | Options: **Limited** / **Unlimited** |
| No. of Virtual Try-On Limit | Numeric Input | `1` | Visible only when **Limited** is selected; hidden when **Unlimited** is selected |

**Rules:**
- Selecting **Unlimited** → hides the numeric limit field; stored limit value is ignored
- Selecting **Limited** → shows numeric field; value must be a positive integer
- Limit applies per user per day

---

### Section 3: Action Buttons

| Button | Type | Behavior |
|---|---|---|
| Save | Primary CTA | Persists configuration and applies immediately to all users |
| Discard | Secondary | Discards all unsaved changes; restores last saved values |

---

### Section 4: Audit Information *(Read-Only)*

| Field | Description | Format |
|---|---|---|
| Last Modified By | Name of the Admin who last saved | Text |
| Last Modified Date | Timestamp of the last save action | `DD/MM/YYYY HH:MM` |

> Audit fields are updated only upon a successful **Save** action.

---

## Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Admin switches from Limited → Unlimited | Numeric limit field is hidden; stored value is ignored in enforcement |
| Admin clicks Discard | No changes are persisted; UI resets to last saved state |
| Admin attempts to Save with invalid input (e.g., 0, negative, empty) | System prevents Save and shows inline validation error |
| Sub Admin without permission tries to access | Screen is inaccessible; appropriate permission error shown |

---

## Validation Rules

| Field | Rule |
|---|---|
| No. of OOTD Limit | Required when Limited is selected; must be a positive integer ≥ 1 |
| No. of Virtual Try-On Limit | Required when Limited is selected; must be a positive integer ≥ 1 |

---

## Acceptance Criteria

| # | Criteria |
|---|---|
| AC-01 | Admin can configure Free OOTD limit as **Limited** or **Unlimited** |
| AC-02 | Admin can configure Free Virtual Try-On limit as **Limited** or **Unlimited** |
| AC-03 | Numeric limit fields appear **only** when Limited is selected |
| AC-04 | Default limit value is set to **1** when Limited is enabled |
| AC-05 | Save applies configuration **immediately** to all users globally |
| AC-06 | Discard restores the **previously saved** configuration values |
| AC-07 | Daily limits reset automatically for all users per system day cycle |
| AC-08 | **Last Modified By** and **Last Modified Date** are updated correctly after Save |
| AC-09 | System prevents Save when fields have invalid or empty values in Limited mode |

---

## UI Component Summary

| Component | Type | Notes |
|---|---|---|
| Free OOTD Option | Radio Group | Horizontal or vertical, 2 options |
| No. of OOTD Limit | Numeric Input | Show/hide based on radio selection |
| Free Virtual Try-On Option | Radio Group | Horizontal or vertical, 2 options |
| No. of Virtual Try-On Limit | Numeric Input | Show/hide based on radio selection |
| Save | Button (Primary) | Disabled if no unsaved changes |
| Discard | Button (Secondary) | Disabled if no unsaved changes |
| Last Modified By | Read-only Text | Auto-populated |
| Last Modified Date | Read-only Text | Auto-populated, format: DD/MM/YYYY HH:MM |

---

## Out of Scope

- Approval workflows or change logs
- Per-user or per-segment overrides
- Scheduling configuration changes for future dates
- Versioning or rollback of configurations

---

*Document Owner: Product / BA Team*
*Last Updated: February 2026*
