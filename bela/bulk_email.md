# 8.1 Bulk Email Module

## 1. Module Overview

The Bulk Email module enables Super Admins to compose, send, and review system-generated emails sent to users at scale. All bulk emails are queued and delivered asynchronously via backend cron jobs, with full visibility into delivery status and history. The module supports listing, viewing, and creating bulk emails and is designed for auditability and controlled communication.

---

## 2. Access Control

- **Super Admin**: Full access (Create, View, Track)
- **Other Roles**: No access

---

## 3. Actors

- **Super Admin**: Creates, sends, and reviews bulk emails
- **System**: Queues emails, sends via cron, tracks delivery status, and sends admin copy
- **End User**: Receives bulk email communication

---

## 4. Bulk Email – Listing Screen

### 4.1 User Stories

- As a Super Admin, I want to view all bulk emails sent from the system so that I can track communication history and delivery status.
- As a Super Admin, I want to open a sent bulk email so that I can review its content and recipients.
- As a Super Admin, I want to create a new bulk email so that I can communicate with users at scale.

---

### 4.2 Preconditions

- Admin must be logged in.
- Admin must have Super Admin access.
- Email service and cron jobs must be active.

---

### 4.3 Screen Purpose

The Bulk Email Listing screen provides a centralized view of all bulk emails created and sent from the system, including subject, recipient scope, delivery status, and timestamps.

---

### 4.4 Navigation Rules

- Access Path: Admin Panel → Communication Management → Bulk Email
- Actions:
  - **Send New** → Navigates to Add New Bulk Email screen
  - **Click Subject / View Action** → Navigates to View Sent Email screen

---

### 4.5 Business Rules

- Only admin-sent bulk emails are listed.
- Emails are sent asynchronously via backend cron.
- Sent emails cannot be edited or resent.
- Admin always receives a system-triggered copy of every bulk email.

---

### 4.6 Listing Table Columns

- **Subject**: Email subject
- **Sent To**: All Users / Specific Users
- **Added By**: Admin name
- **Date Added**: Email creation date
- **Date Sent**: Actual send date
- **Status**: In Progress / Sent / Failed
- **Action**: View

---

### 4.7 Pagination

- Server-side pagination
- Default page size: 10
- Page size options: 10 / 25 / 50
- Controls:
  - Next / Previous
  - Page number navigation
- Display total record count
- Show empty state if no records exist

---

### 4.8 Filters & Sorting

**Filters**
- Status: In Progress / Sent / Failed
- Sent To: All Users / Specific Users

**Sorting**
- Date Added (Latest First – default)
- Date Sent

---

### 4.9 Edge Cases

- If no bulk emails exist, show empty state: “No bulk email data found.”
- If email fails for all users, status is marked as Failed.
- If email is partially processed, status remains In Progress.

---

### 4.10 Acceptance Criteria

- Bulk email listing loads with accurate data.
- Status reflects real delivery state.
- Clicking View opens the correct email detail page.
- Empty state is displayed correctly.
- Filters and sorting function as expected.

---

## 5. Bulk Email – Add New Bulk Email Screen

### 5.1 User Story

As a Super Admin, I want to compose and send a bulk email so that I can communicate with users effectively.

---

### 5.2 Preconditions

- Admin must be logged in.
- Admin must have Super Admin access.

---

### 5.3 Screen Purpose

The Add New Bulk Email screen allows the admin to compose an email, select recipients, attach files, and queue the email for delivery.

---

### 5.4 Screen Fields

- **Administrator Email**
  - System-populated
  - Read-only
- **Subject**
  - Mandatory text field
- **Send To**
  - Radio options: All Users / Specific Users
- **User Search**
  - Search and multi-select
  - Visible only when Specific Users is selected
- **Description**
  - Rich text editor
- **Attachment**
  - Optional file upload
  - Maximum size: 5 MB

---

### 5.5 Business Rules

- Administrator Email is system-defined and non-editable.
- If All Users is selected:
  - Email is sent to all active users.
- If Specific Users is selected:
  - Admin can search and select multiple active users.
- Attachments must not exceed 5 MB.
- On clicking Send:
  - Email is queued.
  - Status is set to In Progress.
- A system-triggered copy is always sent to the admin email.
- Emails cannot be sent to inactive users.

---

### 5.6 Navigation Rules

- **Send** → Queue email and redirect to Bulk Email Listing
- **Cancel** → Discard draft and redirect to Bulk Email Listing

---

### 5.7 Edge Cases

- If no users are selected under Specific Users, Send is disabled.
- If attachment exceeds size limit, show validation error.
- If cron processing fails, status is marked as Failed.

---

### 5.8 Acceptance Criteria

- Admin can compose an email using rich text.
- Admin can select All Users or Specific Users.
- Attachment size validation works correctly.
- Email is queued successfully on Send.
- Admin copy is sent automatically.
- Inactive users cannot be selected.

---

## 6. Bulk Email – View Sent Email Screen

### 6.1 User Story

As a Super Admin, I want to view a sent bulk email so that I can review its content and delivery details.

---

### 6.2 Preconditions

- Bulk email must exist in the system.

---

### 6.3 Screen Purpose

The View Sent Email screen provides a read-only view of a bulk email that has been queued or sent, including content, recipients, and delivery status.

---

### 6.4 Screen Fields (Read-Only)

- **Administrator Email**: System email
- **Subject**: Email subject
- **Sent To**: All Users / Specific Users
- **Selected Users**: List or count of users (if applicable)
- **Description**: Rendered email content
- **Attachment**: Downloadable file (if available)
- **Status**: In Progress / Sent / Failed
- **Date Added**: Creation date
- **Date Sent**: Send completion date

---

### 6.5 Business Rules

- All fields are read-only.
- No edit or resend option is available.
- Status reflects system delivery outcome only.

---

### 6.6 Navigation Rules

- **Back** → Redirect to Bulk Email Listing

---

### 6.7 Edge Cases

- If attachment is missing, hide attachment section.
- If email failed, clearly display failure status.

---

### 6.8 Acceptance Criteria

- Email details are displayed accurately.
- Rich content renders correctly in read-only mode.
- Delivery status is shown correctly.
- Back navigation returns to listing screen.

---

## 7. Reference

This specification is derived from the Bellaroule AI FRD – Communication Management, Bulk Email section. :contentReference[oaicite:0]{index=0}
