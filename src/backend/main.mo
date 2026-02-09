import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Link = {
    url : Text;
    title : Text;
    description : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Per-user link storage: Map<Principal, Map<Text, Link>>
  let userLinks = Map.empty<Principal, Map.Map<Text, Link>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to get or create user's link map
  private func getUserLinkMap(user : Principal) : Map.Map<Text, Link> {
    switch (userLinks.get(user)) {
      case (?links) { links };
      case (null) {
        let newMap = Map.empty<Text, Link>();
        userLinks.add(user, newMap);
        newMap;
      };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Link Management Functions - Per-User Storage
  public shared ({ caller }) func addLink(id : Text, link : Link) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add links");
    };
    
    let userLinkMap = getUserLinkMap(caller);
    if (userLinkMap.containsKey(id)) {
      Runtime.trap("Link already exists with this ID");
    };
    userLinkMap.add(id, link);
  };

  public shared ({ caller }) func updateLink(id : Text, link : Link) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update links");
    };
    
    let userLinkMap = getUserLinkMap(caller);
    switch (userLinkMap.get(id)) {
      case (null) { Runtime.trap("Link not found") };
      case (_) { userLinkMap.add(id, link) };
    };
  };

  public shared ({ caller }) func deleteLink(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete links");
    };
    
    let userLinkMap = getUserLinkMap(caller);
    switch (userLinkMap.get(id)) {
      case (null) { Runtime.trap("Link not found") };
      case (_) { userLinkMap.remove(id) };
    };
  };

  public query ({ caller }) func getLink(id : Text) : async Link {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get links");
    };
    
    switch (userLinks.get(caller)) {
      case (null) { Runtime.trap("Link not found") };
      case (?userLinkMap) {
        switch (userLinkMap.get(id)) {
          case (null) { Runtime.trap("Link not found") };
          case (?link) { link };
        };
      };
    };
  };

  public query ({ caller }) func getAllLinks() : async [Link] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get all links");
    };
    
    switch (userLinks.get(caller)) {
      case (null) { [] };
      case (?userLinkMap) { userLinkMap.values().toArray() };
    };
  };
};
