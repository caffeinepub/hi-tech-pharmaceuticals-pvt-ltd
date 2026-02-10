import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  type Category = {
    id : Text;
    name : Text;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    photo : ?Storage.ExternalBlob;
    category : Category;
    bonusOffer : ?Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  type Order = {
    id : Text;
    items : [OrderItem];
    customer : Principal;
    status : Text;
  };

  type AdminCredentials = {
    email : Text;
    password : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let categories = Map.empty<Text, Category>();
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var adminCredentials : ?AdminCredentials = ?{
    email = "hitechpharmaceutical.pvt.ltd@gmail.com";
    password = "Nabin@7045";
  };

  // Map of Principal -> admin session active status
  let adminSessions = Map.empty<Principal, Bool>();

  // Admin authentication
  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    switch (adminCredentials) {
      case (null) { return false };
      case (?creds) {
        if (creds.email == email and creds.password == password) {
          adminSessions.add(caller, true);
          return true;
        };
      };
    };
    false;
  };

  public query ({ caller }) func isAdminSessionActive() : async Bool {
    switch (adminSessions.get(caller)) {
      case (null) { false };
      case (?active) { active };
    };
  };

  public shared ({ caller }) func adminLogout() : async () {
    adminSessions.remove(caller);
  };

  // Helper to check admin session for the specific caller
  func requireAdminSession(caller : Principal) {
    switch (adminSessions.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Admin session required");
      };
      case (?active) {
        if (not active) {
          Runtime.trap("Unauthorized: Admin session required");
        };
      };
    };
  };

  // Helper to check if caller has an active admin session
  func hasAdminSession(caller : Principal) : Bool {
    switch (adminSessions.get(caller)) {
      case (null) { false };
      case (?active) { active };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller) and not hasAdminSession(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public browsing - no authentication required
  public query ({ caller }) func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getProductsByCategory(categoryId : Text) : async [Product] {
    let categoryProducts = List.empty<Product>();
    for (product in products.values()) {
      if (product.category.id == categoryId) {
        categoryProducts.add(product);
      };
    };
    categoryProducts.toArray();
  };

  // Customer order functions - user authentication required
  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };
    let customerOrders = List.empty<Order>();
    for (order in orders.values()) {
      if (order.customer == caller) {
        customerOrders.add(order);
      };
    };
    customerOrders.toArray();
  };

  public shared ({ caller }) func submitOrder(items : [OrderItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit orders");
    };
    let orderId = items.foldLeft("", func(acc, item) { acc # item.productId }) # items.size().toText();
    let order : Order = {
      id = orderId;
      items;
      customer = caller;
      status = "pending";
    };
    orders.add(orderId, order);
  };

  // Admin functions - admin session authentication required
  public query ({ caller }) func getAllOrders() : async [Order] {
    requireAdminSession(caller);
    orders.values().toArray();
  };

  public shared ({ caller }) func addCategory(id : Text, name : Text) : async () {
    requireAdminSession(caller);
    let category : Category = {
      id;
      name;
    };
    categories.add(id, category);
  };

  public shared ({ caller }) func updateProduct(productId : Text, name : Text, description : Text, price : Nat, photo : ?Storage.ExternalBlob, categoryId : Text, bonusOffer : ?Text) : async () {
    requireAdminSession(caller);
    let category = switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?category) { category };
    };
    let product : Product = {
      id = productId;
      name;
      description;
      price;
      photo;
      category;
      bonusOffer;
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    requireAdminSession(caller);
    products.remove(productId);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    requireAdminSession(caller);
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
    let updatedOrder : Order = {
      id = order.id;
      items = order.items;
      customer = order.customer;
      status;
    };
    orders.add(orderId, updatedOrder);
  };

  // Admin-only order customer details fetch
  public query ({ caller }) func getOrderCustomerDetails(orderId : Text) : async (Principal, ?UserProfile) {
    requireAdminSession(caller);

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };

    (order.customer, userProfiles.get(order.customer));
  };
};
