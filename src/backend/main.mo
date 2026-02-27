import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  type Destination = {
    id : Nat;
    name : Text;
    tagline : Text;
    category : Category;
    description : Text;
  };

  type Category = {
    #SacredSite;
    #AncientShrine;
    #HeritageArchitecture;
    #NatureAdventure;
  };

  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let destinations = Map.empty<Nat, Destination>();
  let subscribers = Map.empty<Text, Text>();
  let messages = Map.empty<Nat, ContactMessage>();

  var nextMessageId = 0;

  // Initialize with 4 destinations
  public shared ({ caller }) func initialize() : async () {
    if (destinations.values().toArray().size() > 0) {
      Runtime.trap("Already initialized");
    };

    let danteshwariTemple : Destination = {
      id = 1;
      name = "Danteshwari Temple";
      tagline = "A Sacred Site";
      category = #SacredSite;
      description = "One of the 52 Shakti Peethas, this temple holds great religious significance and showcases South Indian architecture.";
    };

    let ganeshIdol : Destination = {
      id = 2;
      name = "Ganesh Idol of Dholkal";
      tagline = "An Ancient Shrine";
      category = #AncientShrine;
      description = "A mysterious 1,000-year-old Ganesh idol discovered atop a hill, offering breathtaking views and spiritual solace.";
    };

    let barsurTemples : Destination = {
      id = 3;
      name = "Barsur Temples";
      tagline = "Heritage & Architecture";
      category = #HeritageArchitecture;
      description = "Known as the 'City of Temples,' Barsur is home to exquisite 10th-11th century temple architecture.";
    };

    let tirathgarhFalls : Destination = {
      id = 4;
      name = "Tirathgarh Falls";
      tagline = "Nature & Adventure";
      category = #NatureAdventure;
      description = "A stunning tiered waterfall amidst lush forests, perfect for nature lovers and adventure seekers.";
    };

    destinations.add(1, danteshwariTemple);
    destinations.add(2, ganeshIdol);
    destinations.add(3, barsurTemples);
    destinations.add(4, tirathgarhFalls);
  };

  public query ({ caller }) func getAllDestinations() : async [Destination] {
    destinations.values().toArray();
  };

  public query ({ caller }) func getDestinationById(id : Nat) : async Destination {
    switch (destinations.get(id)) {
      case (null) { Runtime.trap("Destination not found") };
      case (?destination) { destination };
    };
  };

  public shared ({ caller }) func subscribeNewsletter(email : Text) : async () {
    if (subscribers.containsKey(email)) { Runtime.trap("Already subscribed") };
    subscribers.add(email, email);
  };

  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async () {
    let contactMessage : ContactMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };

    messages.add(nextMessageId, contactMessage);
    nextMessageId += 1;
  };

  public query ({ caller }) func getAllSubscribers() : async [Text] {
    subscribers.values().toArray();
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    messages.values().toArray();
  };
};
