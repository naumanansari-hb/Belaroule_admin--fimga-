# Prompt Management > AI API Configuration (Figma Specification)

## FRD Reference
- Module: 8. Prompt Management
- Sections Covered:
  - 8.5 API Configuration Listing
  - 8.6 API Configuration Details Screen

Source: AI FRD - Bellaroule (19).pdf

---

## Scope
This module is used to configure:
- LLM Providers
- LLM Models
- Keys + runtime controls (timeout/max tokens/temperature)
- Default model logic per provider

Critical:
- API Key must be stored securely (encrypted)
- API key must never be shown in full in UI

---

## Sidebar Navigation
- Prompt Management
  - AI API Configuration

---

# 8.5 API Configuration Listing

## Access
Super Admin only

## Business Rules
- Read-only listing
- No sensitive data displayed (API keys masked / not shown)
- Only one Default model per provider allowed

## Table Columns
- API Provider Name
- Model Name
- Provider Type (OpenAI / Google / Anthropic / Custom)
- API Base URL (masked)
- Default Model (Yes/No)
- Status (Active/Inactive)
- Last Updated By
- Last Updated On (DD/MM/YYYY HH:MM)

## Filters
- Provider Name
- Status
- Default Model (Yes/No)

## Empty State
- “No LLM configurations available. Add a new configuration to get started.”

## Pagination
- Server-side pagination (10 default)
- Options 10 / 25 / 50

---

# 8.6 API Configuration — Details Screen

## Access
Super Admin only

## Modes
- Add Configuration
- Edit Configuration

## Provider Information
- LLM Provider Name (mandatory)
- Provider Type (dropdown)
- API Base URL (mandatory, valid URL)

## Model Configuration
- Model Name (mandatory)
- Model Version (optional)
- Default Model (toggle Yes/No)

Rule:
- Only one Default per provider; setting new default auto-unsets previous default model.

## Authentication & Security
- API Key (password field)
  - encrypted storage
  - masked after save
  - never returned in full again
- Key Label (optional)

## Runtime Controls
- Timeout (ms)
- Max Tokens
- Temperature (0.0–1.0)

## Status
- Active / Inactive

## Business Rules
- Inactive configs cannot be used
- Delete not allowed
- Changes must not require app restart

## Actions
- Save (redirect to listing)
- Cancel

## Validations
- Mandatory fields required
- API URL must be valid
- Duplicate provider+model not allowed
- Numeric ranges validation

## Audit Logging
- Config created/updated
- Default model changed
- Status changed