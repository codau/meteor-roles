'use strict';

(function(){
  /**
   * Modules for adding a roles-permissions map. 
   * Each user gets assigned a role and each role 
   * has a array of permissions. Compatible with 
   * built-in Meteor accounts packages.
   *
   * @module Roles
   */
  if(!Meteor.roles) {
    Meteor.roles = new Mongo.Collection("roles");
  }

  if(typeof Roles === 'undefined')
    Roles = {};

  _.extend(Roles,{
    createRole: function(roleName, permissions) {

      check(roleName, String);

      check(permissions, [String]);
      permissions = _.uniq(permissions);

      try {
        var roleId = Meteor.roles.insert({
          name: roleName,
          permissions: permissions
        });
        return roleId;
      } catch (e) {
        // (from Meteor accounts-base package, insertUserDoc func)
        // XXX string parsing sucks, maybe
        // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day
        if (e.name !== 'MongoError') throw e
        var match = e.err.match(/^E11000 duplicate key error index: ([^ ]+)/)
        if (!match) 
          throw e
        if (match[1].indexOf('$name') !== -1)
          throw new Meteor.Error('role-already-exists', 'Role already exists.')
        throw e
      }

    },
    addRolePermissions: function(roleName, permissions) {

      check(roleName, String);
      var role = Meteor.roles.findOne({
        name: roleName
      });
      if(!role)
        throw new Meteor.Error('role-not-found', 'Role not found');

      check(permissions, [String]);
      permissions = _.uniq(permissions);
      _.each(role.permissions, function(permission) {
        if(permissions.indexOf(permission) !== -1)
          throw new Meteor.Error('permission-already-in-role', 'Role already has this permission');
      });

      Meteor.roles.update(
        {
          _id: role._id
        },
        {
          $addToSet: {
            permissions: {
              $each: permissions
            }
          }
        }
      );
      var userQuery = {};
      var roleUpdate = {};
      userQuery['roles.' + roleName] = { $exists: true };
      roleUpdate['roles.' + roleName] = {
        $each: permissions
      };
      Meteor.users.update(
        userQuery,
        {
          $addToSet: roleUpdate
        }
      );
    },
    revokeRolePermissions: function(roleName, permissions) {

      check(roleName, String);
      var role = Meteor.roles.findOne({
        name: roleName
      });
      if(!role)
        throw new Meteor.Error('role-not-found', 'Role not found');

      check(permissions, [String]);
      permissions = _.uniq(permissions);
      _.each(permissions, function(permission) {
        if(role.permissions.indexOf(permission) === -1)
          throw new Meteor.Error('permission-not-in-role', 'Role does not have this permission');
      });

      Meteor.roles.update(
        {
          _id: role._id
        },
        {
          $pullAll: {
            permissions: permissions
          }
        }
      );
      var userQuery = {};
      var roleUpdate = {};
      userQuery['roles.' + roleName] = { $exists: true };
      roleUpdate['roles.' + roleName] = permissions;
      Meteor.users.update(
        userQuery,
        {
          $pullAll: roleUpdate
        }
      );
    },
    setUserRoles: function(userId, roleNames) {
      var newRoles = {};
      check(userId, String);
      var user = Meteor.users.findOne(userId);
      if(!user)
        throw new Meteor.Error('user-not-found', 'User not found');

      check(roleNames, [String]);
      roleNames = _.uniq(roleNames);
      _.each(roleNames, function(roleName) {
        var role = Meteor.roles.findOne({
          name: roleName
        });
        if(!role)
          throw new Meteor.Error('role-not-found', 'Role not found');
        newRoles[roleName] = role.permissions;
      });

      Meteor.users.update(
        {
          _id: userId
        },
        {
          $set: {
            roles: newRoles
          }
        }
      );

    },
    assignRolesToUser: function(userId, roleNames) {
      var newRoles = {};
      check(userId, String);
      var user = Meteor.users.findOne(userId);
      if(!user)
        throw new Meteor.Error('user-not-found', 'User not found');

      check(roleNames, [String]);
      roleNames = _.uniq(roleNames);
      _.each(roleNames, function(roleName) {
        var role = Meteor.roles.findOne({
          name: roleName
        });
        if(!role)
          throw new Meteor.Error('role-not-found', 'Role not found ' + roleName);
        newRoles['roles.' + roleName] = role.permissions;
      });

      Meteor.users.update(
        {
          _id: userId
        },
        {
          $set: newRoles
        }
      );

    },
    removeUserFromRoles: function(userId, roleNames) {
      var rolesToRemove = {};
      check(userId, String);
      var user = Meteor.users.findOne(userId);
      if(!user)
        throw new Meteor.Error('user-not-found', 'User not found');
      

      roleNames = _.uniq(roleNames);
      _.each(roleNames, function(roleName) {
        var role = Meteor.roles.findOne({
          name: roleName
        });
        if(!role)
          throw new Meteor.Error('role-not-found', 'Role not found');
        rolesToRemove['roles.' + roleName] = '';
      });


      Meteor.users.update(
        {
          _id: userId
        },
        {
          $unset: rolesToRemove
        }
      );
    },
    getUserRoles: function(userId) {
      check(userId, String);

      var user = Meteor.users.findOne(userId);
      if(!user)
        throw new Meteor.Error('user-not-found', 'User not found');

      return _.keys(user.roles);
    },
    getUserPermissions: function(userId) {
      check(userId, String);

      var user = Meteor.users.findOne(userId);
      if(!user)
        throw new Meteor.Error('user-not-found', 'User not found');

      return user.permissions;
    },
    userIdIsInRole: function(userId, role) {
      check(userId, String);
      check(role, String);

      var user = Meteor.users.findOne(
        {
          _id: userId,
          roles: {
            role: {$exists: true}
          }
        }
      );

      return !(!user);
    },
    userIdCan: function(userId, permission) {
      check(userId, String);
      check(permission, String);

      var user = Meteor.users.findOne(
        {
          _id: userId
        },
        {
          fields: {
            roles: 1
          }
        }
      );
      var permitted = false;
      _.each(user.roles, function(role) {
        if(role.indexOf(permission) !== -1 && !permitted){
          permitted = true;
        }
      });

      return permitted;
    }
  });
})();