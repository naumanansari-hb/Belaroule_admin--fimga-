# Authentication
## Scope
This document defines the Authentication & Account module for the BellaRoules Admin Panel.

Covers:
- Login
- Forgot Password
- Reset Password
- Session handling
- My Profile
- Change Password
- Logout

Applies to:
- Super Admin
- Sub Admin (role-based)

---

## 1) Authentication Screens

### 1.1 Login Screen

#### Purpose
Allow Admin users to securely log in to the Admin Panel.

#### Fields
- Email Address (Text, Mandatory, valid email format)
- Password (Password, Mandatory, masked)

#### Actions
- Login (Primary CTA)
- Forgot Password (link)

#### Validations & Error Messages
- Missing email/password → “Required fields are missing.”
- Invalid email format → “Please enter a valid email address.”
- Incorrect credentials → “Invalid email or password.”
- Inactive account → “Your account is inactive.”
- Account locked → “Your account is locked. Please reset your password.”

#### Rules
- Successful login redirects to Dashboard/Home
- Session token stored securely
- Sub Admin navigation rendered as per Role permissions

---

### 1.2 Forgot Password Screen

#### Purpose
Enable Admin users to request a password reset link.

#### Fields
- Email Address (Text, Mandatory, valid email format)

#### Actions
- Send Reset Link (Primary CTA)
- Back to Login

#### Validations & Error Messages
- Missing email → “Required fields are missing.”
- Invalid email → “Please enter a valid email address.”
- Email not found → “Email does not exist.”
- Backend failure → “Unable to process request. Please try again.”

#### Rules
- Reset link sent via email
- Reset token must expire

---

### 1.3 Reset Password Screen

#### Entry
Accessed through reset password link.

#### Fields
- New Password (Mandatory, policy enforced)
- Confirm Password (Mandatory, must match)

#### Actions
- Reset Password (Primary CTA)
- Back to Login

#### Validations & Error Messages
- Missing fields → “Required fields are missing.”
- Password mismatch → “Passwords do not match.”
- Weak password → “Password does not meet security requirements.”
- Expired token → “Reset link has expired.”
- Invalid token → “Invalid reset token.”
- Success → “Password reset successfully.”

#### Rules
- Redirect to Login after successful reset
- Token invalidated after use

---

## 2) Account / Profile

### 2.1 My Profile Screen

#### Purpose
Allow admin to view and update their profile information.

#### Fields
- Full Name (Editable, Mandatory)
- Email (Read-only)
- Mobile Number (Editable, Optional)
- Profile Picture (Optional Upload)

#### Actions
- Save / Update
- Cancel

#### Validations
- Empty name blocked
- Invalid mobile blocked
- Success → “Profile updated successfully.”

---

### 2.2 Change Password

#### Purpose
Allow logged-in admin to change password securely.

#### Fields
- Current Password (Mandatory)
- New Password (Mandatory)
- Confirm New Password (Mandatory)

#### Actions
- Update Password
- Cancel

#### Validations & Error Messages
- Incorrect current password → “Current password is incorrect.”
- Password mismatch → “Passwords do not match.”
- Weak password → “Password does not meet security requirements.”
- Success → “Password updated successfully.”

#### Rules
- After password change, force logout and redirect to Login

---

## 3) Logout

### 3.1 Logout Action
Available via Top Bar → Profile Dropdown → Logout.

#### Behavior
- Clear session token
- Redirect to Login

---

## 4) Session & Security Rules
- Session must expire automatically
- On expiry → redirect to Login with message:
  - “Session expired. Please login again.”
- Inactive Sub Admin cannot log in
- Role/status changes force Sub Admin logout

---

## Acceptance Criteria
- Admin can login and manage password securely
- Forgot/Reset password works end-to-end
- Profile update works correctly
- Change password forces logout
- Session expiry handled gracefully
- RBAC applied for Sub Admin access