// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // reset_password_url : "http://fooddelivery/reset-password", // local http server
  // reset_password_url : "http://localhost:8101/reset-password", // current browser
  reset_password_url : "https://fooddelivery.com/app/reset-password", // live server


  api_base_url : "http://api.fooddelivery/v1/" ,// local server
  //  api_base_url : "https://fooddelivery.com/api/web/v1/" // live server
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
