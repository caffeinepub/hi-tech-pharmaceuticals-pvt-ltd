# Specification

## Summary
**Goal:** Build a wholesale pharmaceutical website with a public product catalog, customer sign-in required only for ordering, and a separate admin panel for managing products and orders.

**Planned changes:**
- Create public site pages and layout: header with “Hi-Tech Pharmaceuticals Pvt. Ltd.” and navigation (Home | About Us | Products | Contact Us), footer with © text and the disclaimer “For wholesale trade purposes only”.
- Build About Us page content (overview, mission & vision, commitment) and a Contact page showing the provided email/phone plus a contact form with submit confirmation.
- Implement a public product catalog and product detail UI sorted A–Z by default, with an A–Z letter filter and responsive product cards showing name, image, dosage form, packing details, wholesale price, and bonus scheme.
- Add customer authentication via Internet Identity, triggering sign-in only when adding to cart or submitting an order, and returning the user to their intended action after sign-in.
- Implement cart functionality (add/remove items, quantity updates), order summary, order/inquiry submission, and a customer order history view tied to a stable customer identifier.
- Create a separate admin login (email + password) and restrict all admin routes/features to authenticated admins.
- Build an admin panel for product and category management (add/edit/delete products, upload/update product photos, set price, manage bonus offers, manage categories).
- Build an admin-facing order inbox to list and view order/inquiry details (newest first).
- Implement backend persistence for products (including image references), categories, customers, and orders with role-based access control (public product reads, admin-only admin actions, customer-only order history).

**User-visible outcome:** Visitors can browse the full catalog without logging in; customers can sign in when ordering to manage a cart, submit wholesale inquiries/orders, and view order history; admins can log in separately to manage products/categories and review incoming orders in an in-app order list.
