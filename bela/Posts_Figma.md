# Content Moderation > Posts

## Scope
Defines admin screens for monitoring and controlling **user-generated posts**.

**Access:** Super Admin, Sub Admin (role-based)

---

## 1. Posts – Listing

### Purpose
Monitor all posts created by users along with engagement metrics.

### Header Actions
- Search by Post ID, Posted By
- Filter by:
  - Post Status (Active / Inactive)
  - Posted Date (Date Range)
- Sort by:
  - Likes Count
  - Comment Count
  - Saved Count

### Table Columns
- Post ID (clickable)
- Posted By (User Email)
- Post Image / Video (Thumbnail)
- Caption (truncated, tooltip on hover)
- Hashtags (truncated, tooltip on hover)
- Likes Count
- Comment Count
- Saved Count
- Repost Count
- Posted Date (DD/MM/YYYY)

### Rules
- Read-only listing
- No create, edit, or delete actions

### Pagination
- Server-side
- Default: 10 rows (10 / 25 / 50)

---

## 2. Post – Detail

### Sections
- Key Statistics (Likes, Comments, Saves, Reposts)
- Post Information:
  - Post ID (read-only)
  - Full Media Preview
  - Caption (read-only)
  - Hashtags (read-only)
  - Post Status (Active / Inactive)

### Actions
- Update Status
- Cancel

### Status Rules
- Inactive posts are hidden from community feed
- Active posts are visible again

---

## Acceptance Criteria
- Admin can view posts and engagement metrics
- Admin can activate/deactivate posts
- Post content is read-only