import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  // Old types
  type OldCategory = {
    id : Text;
    name : Text;
  };

  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    photo : ?Storage.ExternalBlob;
    category : OldCategory;
    bonusOffer : ?Text;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
  };

  type OldOrderItem = {
    productId : Text;
    quantity : Nat;
  };

  type OldOrder = {
    id : Text;
    items : [OldOrderItem];
    customer : Principal;
    status : Text;
  };

  type OldAdminCredentials = {
    email : Text;
    password : Text;
  };

  type OldActor = {
    categories : Map.Map<Text, OldCategory>;
    products : Map.Map<Text, OldProduct>;
    orders : Map.Map<Text, OldOrder>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminCredentials : OldAdminCredentials;
    adminPrincipals : Map.Map<Principal, Bool>;
    accessControlState : AccessControl.AccessControlState;
  };

  // New types
  type NewCategory = {
    id : Text;
    name : Text;
  };

  type NewProduct = {
    id : Text;
    name : Text;
    description : Text;
    netRate : Nat;
    mrp : Nat;
    photo : ?Storage.ExternalBlob;
    category : NewCategory;
    bonusOffer : ?Text;
    isHot : Bool;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    phoneNumber : ?Text;
    panNumber : ?Text;
    address : ?Text;
  };

  type NewOrderItem = {
    productId : Text;
    quantity : Nat;
  };

  type NewOrder = {
    id : Text;
    items : [NewOrderItem];
    customer : Principal;
    status : Text;
  };

  type NewAdminCredentials = {
    email : Text;
    password : Text;
  };

  type NewActor = {
    categories : Map.Map<Text, NewCategory>;
    products : Map.Map<Text, NewProduct>;
    orders : Map.Map<Text, NewOrder>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    adminCredentials : NewAdminCredentials;
    adminPrincipals : Map.Map<Principal, Bool>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    let newCategories = old.categories.map<Text, OldCategory, NewCategory>(
      func(_id, oldCategory) { oldCategory }
    );

    let newProducts = old.products.map<Text, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          id = oldProduct.id;
          name = oldProduct.name;
          description = oldProduct.description;
          netRate = oldProduct.price;
          mrp = oldProduct.price : Nat;
          photo = oldProduct.photo;
          category = {
            id = oldProduct.category.id;
            name = oldProduct.category.name;
          };
          bonusOffer = oldProduct.bonusOffer;
          isHot = false;
        };
      }
    );

    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_id, oldOrder) { oldOrder }
    );

    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldUserProfile) {
        {
          name = oldUserProfile.name;
          email = oldUserProfile.email;
          phoneNumber = null;
          panNumber = null;
          address = null;
        };
      }
    );

    {
      categories = newCategories;
      products = newProducts;
      orders = newOrders;
      userProfiles = newUserProfiles;
      adminCredentials = {
        email = old.adminCredentials.email;
        password = old.adminCredentials.password;
      };
      adminPrincipals = old.adminPrincipals;
      accessControlState = old.accessControlState;
    };
  };
};
