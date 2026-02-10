# Specification

## Summary
**Goal:** Allow admins to view customer/orderer details (principal, name, email when available) for each order in the admin panel.

**Planned changes:**
- Add an admin-session-protected backend query to fetch customer/orderer details for a specified order ID, returning the customer Principal and optional saved UserProfile (name, email) when available.
- Update the admin orders frontend data flow (React Query) to fetch and use backend-provided customer/orderer details under the existing admin session authorization model.
- Enhance the admin UI to display customer/orderer details in the Admin Orders list (name/email fallback to principal) and add a "Customer Details" section on the Admin Order Detail page with "Not provided" fallbacks.

**User-visible outcome:** In the admin panel, admins can see who placed each order (name/email when available, otherwise principal) in both the orders list and the order detail view, visible only to authenticated admin sessions.
