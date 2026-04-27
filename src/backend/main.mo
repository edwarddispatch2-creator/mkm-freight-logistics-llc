import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";


actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Contact Form Types
  type ContactSubmission = {
    name : Text;
    companyName : Text;
    phone : Text;
    email : Text;
    numTrucks : Text;
    serviceNeeded : Text;
    timestamp : Time.Time;
  };

  module ContactSubmission {
    public func compare(a : ContactSubmission, b : ContactSubmission) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let submissionStore = Map.empty<Text, ContactSubmission>();

  // Public contact form submission - no authorization required (open to guests)
  public shared ({ caller }) func submitContactForm(name : Text, companyName : Text, phone : Text, email : Text, numTrucks : Text, serviceNeeded : Text) : async () {
    let timestamp = Time.now();
    let submission : ContactSubmission = {
      name;
      companyName;
      phone;
      email;
      numTrucks;
      serviceNeeded;
      timestamp;
    };
    let id = timestamp.toText();
    submissionStore.add(id, submission);
  };

  // Admin-only: View all contact form submissions
  public query ({ caller }) func getAllSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };
    submissionStore.values().toArray().sort();
  };
};
