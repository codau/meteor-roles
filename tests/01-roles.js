'use strict';

(function () {
  Meteor.users = new Meteor.Collection(null);

  var users = [
    {
      _id: 'shantanu',
      username: 'shantanubhadoria',
    }
  ];
  _.each(users, function(user) {
    Meteor.users.insert(user);
  });

  Tinytest.add('MeteorRoles - createRole', function(test) {
    Roles.createRole('editor', ['can-edit']);

    var role = Meteor.roles.findOne({name: 'editor'});

    test.isNotUndefined(role, 'createRole - Role not created');
    test.equal(role.name, 'editor', 'createRole - Wrong role name');
    test.equal(role.permissions, ['can-edit'], 'createRole - Wrong permissions');
  });

  Tinytest.add('MeteorRoles - addRolePermissions', function(test) {
    Roles.createRole('editor2', ['can-edit']);
    Roles.addRolePermissions('editor2', ['can-delete']);

    var role = Meteor.roles.findOne({name: 'editor2'});

    test.isNotUndefined(role, 'addRolePermissions - Role not found');
    test.equal(role.permissions, ['can-edit', 'can-delete'], 'addRolePermissions - Wrong permissions');

  });

  Tinytest.add('MeteorRoles - revokeRolePermissions', function(test) {
    Roles.createRole('editor3', ['can-edit','can-edit2']);
    Roles.addRolePermissions('editor3', ['can-delete','can-delete2']);
    Roles.revokeRolePermissions('editor3', ['can-delete2', 'can-edit']);

    var role = Meteor.roles.findOne({name: 'editor3'});

    test.isNotUndefined(role, 'revokeRolePermissions - Role not found');
    test.equal(role.permissions, ['can-edit2', 'can-delete'], 'revokeRolePermissions - Wrong permissions');
  });

  Tinytest.add('MeteorRoles - setUserRoles', function(test) {
    Roles.createRole('editor4', ['can-edit','can-edit2']);
    Roles.createRole('editor5', ['can-delete','can-delete2']);
    Roles.setUserRoles('shantanu', ['editor4','editor5']);

    var user = Meteor.users.findOne({_id: 'shantanu'});

    test.isNotUndefined(user, 'setUserRoles - User not found');
    test.equal(user.roles, {"editor4":["can-edit","can-edit2"],"editor5":["can-delete","can-delete2"]}, 'setUserRoles - Wrong roles');
  });

  Tinytest.add('MeteorRoles - assignRolesToUser, removeUserFromRoles & userIdCan', function(test) {
    Roles.createRole('editor6', ['can-edit','can-edit2']);
    Roles.createRole('editor7', ['can-delete','can-delete2']);
    Roles.setUserRoles('shantanu', ['editor6']);
    Roles.assignRolesToUser('shantanu', ['editor7']);

    var user = Meteor.users.findOne({_id: 'shantanu'});

    test.isNotUndefined(user, 'assignRolesToUser - User not found');
    test.equal(user.roles,  {"editor6":["can-edit","can-edit2"],"editor7":["can-delete","can-delete2"]}, 'assignRolesToUser - Wrong roles');

    Roles.removeUserFromRoles('shantanu', ['editor6']);
    user = Meteor.users.findOne({_id: 'shantanu'});

    test.equal(user.roles, {"editor7":["can-delete","can-delete2"]}, 'removeUserFromRoles - Wrong roles');

    console.log(Roles.userIdCan('shantanu', 'can-delete'));
    test.isTrue(Roles.userIdCan('shantanu', 'can-delete'), 'userIdCan - Permission should be true');
    test.isFalse(Roles.userIdCan('shantanu', 'can-edit'), 'userIdCan - Permission should be false');

  });

  Tinytest.add('MeteorRoles - Modify roles after user assignment', function(test) {
    Roles.createRole('editor8', ['can-edit','can-edit2']);
    Roles.createRole('editor9', ['can-delete','can-delete2']);
    Roles.setUserRoles('shantanu', ['editor8','editor9']);

    Roles.revokeRolePermissions('editor9', ['can-delete2']);
    var user = Meteor.users.findOne({_id: 'shantanu'});
    test.equal(user.roles, {"editor8":["can-edit","can-edit2"],"editor9":["can-delete"]}, 'modify roles - Wrong permissions');

    Roles.addRolePermissions('editor9', ['can-delete3']);
    var user = Meteor.users.findOne({_id: 'shantanu'});
    test.equal(user.roles, {"editor8":["can-edit","can-edit2"],"editor9":["can-delete","can-delete3"]}, 'modify roles - Wrong permissions');
  });

})();