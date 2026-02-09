import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old versions (no image/color)
  type OldLink = {
    url : Text;
    title : Text;
    description : ?Text;
  };

  type OldActor = {
    userLinks : Map.Map<Principal, Map.Map<Text, OldLink>>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  // New versions (with image/color)
  type NewLink = {
    url : Text;
    title : Text;
    description : ?Text;
    image : ?Text;
    color : ?Text;
  };

  type NewActor = {
    userLinks : Map.Map<Principal, Map.Map<Text, NewLink>>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserLinks = old.userLinks.map<Principal, Map.Map<Text, OldLink>, Map.Map<Text, NewLink>>(
      func(_user, oldMap) {
        oldMap.map<Text, OldLink, NewLink>(
          func(_id, oldLink) {
            {
              url = oldLink.url;
              title = oldLink.title;
              description = oldLink.description;
              image = null;
              color = null;
            };
          }
        );
      }
    );
    {
      old with
      userLinks = newUserLinks
    };
  };
};
