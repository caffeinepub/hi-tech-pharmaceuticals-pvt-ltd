# Specification

## Summary
**Goal:** Extend customer profiles with additional fields, let admins manage which products are “Hot Products”, and update product pricing to use Net Rate + MRP across admin and customer flows.

**Planned changes:**
- Extend the customer profile data model to include phone number, PAN number, and address; update related backend APIs and the frontend profile setup flow to read/write these fields safely for existing users.
- Update customer-facing and admin order-customer views to display the new profile fields when present without breaking when empty.
- Add a persisted “Hot Product” flag to products; update the admin product editor to mark/unmark products as hot and update the Home page Hot Products section to display only hot-marked products with an English empty state when none are set.
- Replace “Wholesale” pricing with “Net Rate” and add “MRP”; update backend product data, admin product editor inputs, product listing/detail displays, and cart/checkout/order calculations to use Net Rate as the transactional price while also showing MRP where appropriate.
- If applicable, add/adjust backend migration so existing stored products and user profiles are upgraded to the new schema with safe defaults and without data loss.

**User-visible outcome:** Customers can save and see phone number, PAN number, and address in their profile and during checkout; admins can choose which products appear in the Hot Products section; pricing throughout the app shows Net Rate and MRP, and totals are calculated using Net Rate.
