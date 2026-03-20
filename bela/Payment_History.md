# Plan Management > Payment History (Figma Specification)

## FRD Reference
- Module: Plan Management
- Section: 5.2 Payment History
  - 5.2.1 Payment History (Listing)

Source: AI FRD - Bellaroule (15).pdf

---

## Scope
Payment History provides a consolidated view of payment transactions for reward coin purchases.

Goals:
- track revenue
- monitor failures
- audit purchases
- provide financial visibility
- avoid exposing sensitive payment gateway details

**Access:**
- Super Admin
- Authorized Sub Admins (based on Role Master permissions)

---

## Navigation Rules
- Sidebar → Payment Management → Payment History
- No edit screen
- No action buttons
- Transactions are non-editable

---

# 5.2.1 Payment History — Listing Screen

## Table Data Source Rules
- All records fetched from backend payment transaction table
- Only reward point purchase transactions
- No sensitive gateway data displayed
- No actions (refund/retry/cancel) available

## Table Columns (Admin View)
1. Transaction ID (system-generated)
2. Transaction Date (DD/MM/YYYY HH:MM)
3. User Name
4. Plan Purchased (reward point package name)
5. Coins Purchased
6. Amount Paid (with currency symbol)
7. Platform (Android / iOS)
8. Status (Success / Failed / Pending)

---

## Transaction Details Pop-up (Modal)

### Trigger
- Click any transaction row

### Behavior
- Modal overlay
- Background list non-interactive
- Close methods:
  - X icon
  - ESC key
  - Click outside modal

### Fields Displayed (Read-only)
- Transaction ID
- Transaction Date & Time
- User Name
- User ID
- Plan ID
- Plan Name
- Coins Purchased
- Amount Paid
- Currency
- Platform
- Transaction Status

---

## Filters & Search

### Filters
- Date Range (From – To)
- Platform (Android / iOS)
- Transaction Status (Success / Failed / Pending)
- User (search by user name or user ID)

Filters can be applied individually or combined.

### Search (Server-side, Case-insensitive)
Supports:
- Transaction ID
- User Name

---

## Pagination
- Server-side pagination
- Default page size: 10
- Options: 10 / 25 / 50
- Controls: Next / Previous / Page numbers
- Show total record count

---

## Status Handling (Read-only)
- Success: Payment completed + coins credited
- Failed: Payment failed + no coins credited
- Pending: Payment initiated but not confirmed
Status cannot be changed from admin panel.

---

## Edge Cases
- No transactions exist → “No payment transactions found.”
- Filters return no results → “No records match the selected criteria.”
- Payment service unavailable → non-blocking error + retry option
- Currency mismatch → display backend currency only; no conversion

---

## Non-Functional Requirements
- Page load time under 3 sec for up to 50 records/page
- All data access logged for audit
- Timezone:
  - backend stores UTC
  - UI displays admin’s local timezone

---

## Acceptance Criteria
- Admin can view paginated transactions
- Filters work correctly (single + combined)
- Data matches backend records
- Status visible and consistent
- No transaction editable
- Empty/error states handled gracefully