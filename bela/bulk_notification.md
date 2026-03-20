# 8.2 Bulk Notification Module

## 1. Module Overview

The Bulk Notification module enables Super Admins to create, send, and review system-generated push notifications delivered to users at scale. Notifications are queued and processed asynchronously via background cron jobs. The module provides complete visibility into notification content, recipient scope, and delivery status. All screens are read-only post-send to ensure auditability and system integrity.

---

## 2. Access Control

- **Super Admin**: Full access (Create, View, Track)
- **Other Roles**: No access

---

## 3. Actors

- **Super Admin**: Creates, sends, and reviews bulk notifications
- **System**: Queues notifications, delivers via push service, tracks delivery status
- **End User**: Receives push notifications

---

## 4. Bulk Notification – Listing Screen

### 4.1 User Stories

- As a Super Admin, I want to view all bulk notifications sent from the system so that I can track communication history and delivery status.
- As a Super Admin, I want to open a sent bulk notification so that I can review its content and recipient scope.
- As a Super Admin, I want to create a new bulk notification so that I can notify users through push messages.

---

### 4.2 Preconditions

- Admin must be logged in.
- Admin must have Super Admin access.
- Push notification service must be active.
- Background cron jobs must be running.

---

### 4.3 Screen Purpose

The Bulk Notification Listing screen provides a consolidated view of all bulk notifications created and sent from the system, including delivery status, recipient scope, and timestamps.

---

### 4.4 Navigation Rules

- Access Path: Admin Panel → Communication Management → Bulk Notification
- Actions:
  - **Send New** → Navigates to Add New Bulk Notification screen
  - **Click Row / View Action** → Navigates to View Notification screen

---

### 4.5 Business Rules

- Only active users are eligible recipients.
- Notifications are queued and not sent instantly.
- Sent notifications cannot be edited or deleted.
- Status is controlled entirely by the system.

---

### 4.6 Listing Table Columns

- **Notification Content**: Short preview of message
- **Sent To**: All Users / Specific Users
- **Added By**: Admin who created the notification
- **Date Added**: Creation date
- **Date Sent**: Notification sent completion date
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

- If no bulk notifications exist, show empty state: “No bulk notification data found.”
- If notification delivery fails for all users, status is marked as Failed.
- If processing is ongoing, status remains In Progress.

---

### 4.10 Acceptance Criteria

- Bulk notification listing loads with accurate data.
- Status reflects real delivery state.
- Clicking a row opens the correct notification detail page.
- Empty state is displayed correctly.
- Filters and sorting work as expected.

---

## 5. Bulk Notification – Add New Bulk Notification Screen

### 5.1 User Story

As a Super Admin, I want to create and send a bulk notification so that users receive important updates via push notification.

---

### 5.2 Preconditions

- Admin must be logged in.
- Admin must have Super Admin access.

---

### 5.3 Screen Purpose

The Add New Bulk Notification screen allows the admin to compose a push notification, select recipients, and queue the notification for delivery.

---

### 5.4 Screen Fields

- **Administrator Email**
  - System-populated
  - Read-only
- **Send Type**
  - Radio options: All Users / Specific Users
- **Users**
  - Search and multi-select
  - Visible only when Specific Users is selected
- **Notification Content**
  - Mandatory plain text area
- **Send Button**
  - Queues notification

---

### 5.5 Business Rules

- Administrator Email is system-defined and non-editable.
- If All Users is selected:
  - Notification is sent to all active users.
- If Specific Users is selected:
  - Admin can search and select multiple active users.
- Notification content must be plain text only.
- On clicking Send:
  - Notification is queued.
  - Status is set to In Progress.
- Delivery is handled asynchronously via cron.
- Inactive users cannot receive notifications.

---

### 5.6 Navigation Rules

- **Send** → Queue notification and redirect to Bulk Notification Listing
- **Cancel / Back** → Discard and redirect to Bulk Notification Listing

---

### 5.7 Edge Cases

- If no users are selected under Specific Users, Send is disabled.
- If notification content is empty, Send is disabled.
- If push service fails, status is marked as Failed.

---

### 5.8 Acceptance Criteria

- Admin can select All Users or Specific Users.
- User search and multi-select works correctly.
- Notification content is mandatory.
- Notification is queued successfully.
- Admin is redirected to listing after Send.

---

## 6. Bulk Notification – View Notification Screen

### 6.1 User Story

As a Super Admin, I want to view a sent bulk notification so that I can review its content and delivery status.

---

### 6.2 Preconditions

- Notification must exist in the system.

---

### 6.3 Screen Purpose

The View Notification screen provides a read-only view of a bulk notification that has been queued or sent.

---

### 6.4 Screen Fields (Read-Only)

- **Administrator Email**: System email
- **Sent To**: All Users / Specific Users
- **Selected Users**: List or count (hidden when sent to All Users)
- **Notification Content**: Full notification text
- **Status**: In Progress / Sent / Failed
- **Date Added**: Creation date
- **Date Sent**: Sent completion date

---

### 6.5 Business Rules

- All fields are read-only.
- No edit, delete, or resend options are available.
- Status reflects system delivery outcome only.

---

### 6.6 Navigation Rules

- **Back** → Redirect to Bulk Notification Listing

---

### 6.7 Edge Cases

- If notification failed, status is clearly displayed.
- If sent to All Users, user list is hidden and only count is shown.

---

### 6.8 Acceptance Criteria

- Notification details are displayed accurately.
- Content is shown exactly as sent.
- Status reflects correct delivery state.
- Back navigation works correctly.

---

## 7. Reference

This specification is derived from the Bellaroule AI FRD – Communication Management, Bulk Notification section. :contentReference[oaicite:0]{index=0}
