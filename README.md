Meteor role based access control
=========
[Wikipedia](http://en.wikipedia.org/wiki/Role-based_access_control)

Role-Based-Access-Control (RBAC) is a policy neutral access control mechanism defined around roles and privileges. The components of RBAC such as role-permissions, user-role and role-role relationships make it simple to do user assignments. This package attempts to provide a loose implementation of role based access control(without hierarchial roles to avoid complexity).

# Usage

First step is to create a role and add permissions allowed for the role. 

### Creating a role and specifying it's permissions

```javascript

    Meteor.roles.createRole('Editor', ['add-posts',' delete-posts']);
   
```

New role editor which can add and delete posts

### Adding additional permissions for a role

```javascript

    Meteor.roles.addRolePermissions('Editor', ['edit-posts']); // Add 'edit-posts' permission to Editors
   
```

Editors can now edit posts as well

### Revoke permissions for a role

```javascript

    Meteor.roles.createRole('Editor', []);
    Meteor.roles.revokeRolePermissions('Editor', ['add-posts']); // Revokes 'add-posts' permission from Editors
   
```

Editors can no longer add posts

### Set user roles 

delete existing roles for user and specify new set of roles for user

```javascript

    Meteor.roles.setuserRoles(userId, ['Administrator']); // adds 'Administrator' role to user indicated by userId
   
```

Now this user can perform all the functions that a administratoe is allowed to do but can no longer perform editor functions

### Assign roles to user

```javascript

    Meteor.roles.assignRolesToUser(userId, ['Editor']); // adds 'Editor' role to user indicated by userId
   
```

Now this user can perform all the functions that a editor is allowed to do

### Remove user from roles

```javascript

    Meteor.roles.removeUserFromRoles(userId, ['Editor']);
    
```

### Get user roles

```javascript
    
    Meteor.roles.getUserRoles(userId); // Returns an array of all roles that this user belongs to
    
```

### Get user permissions

```javascript
    
    Meteor.roles.getUserPermissions(userId); // Returns an array of all permissions that this user is allowed
    
```

### Check if a user can perform a action

```javascript
    
    Meteor.roles.userIdCan(userId, 'add-posts'); // Returns true or false depending on weather the user has this permission
    Meteor.roles.userCan('add-posts'); // Returns true or false depending on weather the logged in user has this permission
    
```

Notes
----
This package copies blatantly from open source code and is inspired by other packages like alanning:meteor-roles and radzserg:rbac but provides a more traditional interpretation of roles and permissions. Additional complexities (like special priveleges outside a role for some users) could be provided but is skipped to keep things simple and fast, especially when it comes to checking a user's permissions and roles.

License
----

MIT

**Free Software, Hell Yeah!**