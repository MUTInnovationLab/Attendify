// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,  // Add this line
  firebaseConfig :{
    apiKey: "AIzaSyDoOROSmuw5kwHXl5YrRRvPouBCXq6A9OA",
    authDomain: "attendify-a7a94.firebaseapp.com",
    projectId: "attendify-a7a94",
    storageBucket: "attendify-a7a94.appspot.com",
    messagingSenderId: "931159602124",
    appId: "1:931159602124:web:75758ab6e5236a12cc2369"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
