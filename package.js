Package.describe({
  name: 'shantanubhadoria:roles',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Meteor roles and permissions based access control',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/shantanubhadoria/meteor-roles',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(
    [
      'underscore',
      'accounts-base',
      'tracker',  
      'check',
      'mongo'
    ],
    [
      'client', 
      'server'
    ]
  );
  api.export('Roles');
  api.addFiles('model/roles.js',
    [
      'client', 
      'server'
    ]
  );
  api.addFiles('client/subscriptions.js',
    [
      'client'
    ]
  );
  api.addFiles('server/roles.js',
    [ 
      'server'
    ]
  );
});

Package.onTest(function(api) {
  api.use(
    [
      'underscore',
      'accounts-password',
      'tinytest',
      'shantanubhadoria:roles'
    ],
    [
      'client', 
      'server'
    ]
  );
  api.addFiles('tests/01-roles.js', ['client']);
});
