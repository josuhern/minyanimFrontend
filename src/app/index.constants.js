/* global malarkey:false, moment:false */
(function () {
  "use strict";

  angular
    .module("minyan")
    .constant("malarkey", malarkey)
    .constant("moment", moment)
    .constant("SERVER_URL", {
      PROD: "http://localhost:4000"
      //PROD: "https://minyanim.herokuapp.com"
      //PROD: "http://159.89.237.130"
    });
})();
