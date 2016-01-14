"use strict"


/**
 * Roles collection documents consist only of an id a role name and permissions.
 *   ex: { _id: "123", name: "admin", permissions: ["add-posts", "edit-posts"] }
 */
if (!Meteor.roles) {
  Meteor.roles = new Mongo.Collection("roles")

  // Create default indexes for roles collection
  Meteor.roles._ensureIndex('name', {unique: 1})
}


/**
 * Publish logged-in user's roles so client-side checks can work.
 * 
 * Use a named publish function so clients can check `ready()` state.
 */
Meteor.publish('_userRoles', function () {
  if (!this.userId)
    return null;

  return Meteor.users.find(
    {
      _id: this.userId
    },
    {
      fields: {
        roles: 1
      }
    }
  );
});
Meteor.publish('_roles', function () {
  if (!this.userId)
    return null;

  return Meteor.roles.find({});
});