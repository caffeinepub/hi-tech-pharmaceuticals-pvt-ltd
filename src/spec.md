# Specification

## Summary
**Goal:** Let shoppers select a quantity before adding products to the cart, and update the Home page to feature a “Hot Products” product list instead of the “Why Choose Us” section.

**Planned changes:**
- Add a quantity control (default 1) to product surfaces on the Products listing cards and the Product Detail page, validating to an integer ≥ 1 and using the selected quantity when adding to cart.
- Update the cart store add-item API to accept an explicit quantity and to increment existing cart line quantities by the added amount, without breaking checkout/order submission.
- Replace the Home page “Why Choose Us” section with a “Hot Products” section that fetches products via existing hooks, renders a product list/grid, links to product details, and provides a “View All Products” path with loading/empty states.

**User-visible outcome:** Customers can choose how many items to add to the cart from product cards and product details, and the Home page shows a “Hot Products” product list instead of the prior feature grid.
