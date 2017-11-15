// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBFG5XAYniXLE0oysz9m2KGKudkWWUuVFo',
    authDomain: 'scribe-angular.firebaseapp.com',
    databaseURL: 'https://scribe-angular.firebaseio.com',
    projectId: 'scribe-angular',
    storageBucket: '',
    messagingSenderId: '1029376142564'
  }
};
