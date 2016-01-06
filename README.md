Meteor role based access control
=========
[Wikipedia](http://en.wikipedia.org/wiki/Role-based_access_control)

Role-Based-Access-Control (RBAC) is a policy neutral access control mechanism defined around roles and privileges. The components of RBAC such as role-permissions, user-role and role-role relationships make it simple to do user assignments. This package attempts to provide a loose implementation of role based access control(without hierarchial roles to avoid complexity).

# Usage

First step is to create a role and add permissions allowed for the role. 

### Creating a role and specifying it's permissions

```javascript

    Roles.createRole('Editor', ['add-posts',' delete-posts']);
   
```

New role editor which can add and delete posts

### Adding additional permissions for a role

```javascript

    Roles.addRolePermissions('Editor', ['edit-posts']); // Add 'edit-posts' permission to Editors
   
```

Editors can now edit posts as well

### Revoke permissions for a role

```javascript

    Roles.createRole('Editor', []);
    Roles.revokeRolePermissions('Editor', ['add-posts']); // Revokes 'add-posts' permission from Editors
   
```

Editors can no longer add posts

### Set user roles 

delete existing roles for user and specify new set of roles for user

```javascript

    Roles.setuserRoles(userId, ['Administrator']); // sets user indicated by userId to 'Administrator' role
   
```

Now this user can perform all the functions that a administrator is allowed to do but can no longer perform editor functions

### Assign roles to user

```javascript

    Roles.assignRolesToUser(userId, ['Editor']); // adds 'Editor' role to user indicated by userId
   
```

Now this user can perform all the functions that a editor is allowed to do in addition to administrator roles assigned to it earlier.

### Remove user from roles

```javascript

    Roles.removeUserFromRoles(userId, ['Editor']);
    
```

### Get user roles

```javascript
    
    Roles.getUserRoles(userId); // Returns an array of all roles that this user belongs to
    
```

### Get user permissions

```javascript
    
    Roles.getUserPermissions(userId); // Returns an array of all permissions that this user is allowed
    
```

### Check if a user can perform a action

```javascript
    
    Roles.userIdCan(userId, 'add-posts'); // Returns true or false depending on weather the user has this permission
    Roles.userCan('add-posts'); // Returns true or false depending on weather the logged in user has this permission
    
```

Notes
----
This package copies blatantly from open source code and is inspired by other packages like alanning:meteor-roles and radzserg:rbac but provides a more traditional interpretation of roles and permissions. Additional complexities (like special priveleges outside a role for some users) could be provided but is skipped to keep things simple and fast, especially when it comes to checking a user's permissions and roles.

License
----

MIT

**Free Software, Hell Yeah!**