(function () {
  "use strict";
  angular
    .module("minyan")
    .factory("Prays", praysFunction)
    .factory("PraysBySynagogue", praysBySynagogueFunction);

  function praysFunction($resource, SERVER_URL, jwtHelper, $localStorage) {
    var oAuth = $localStorage.currentUser;
    return $resource(
      SERVER_URL.PROD + "/prays/:id",
      { id: "@myid" },
      {
        get: { method: "GET", headers: { Authorization: oAuth } },
        save: { method: "POST", headers: { Authorization: oAuth } },
        query: {
          method: "GET",
          isArray: true,
          headers: { Authorization: oAuth }
        },
        update: { method: "PUT", headers: { Authorization: oAuth } },
        destroy: { method: "DELETE", headers: { Authorization: oAuth } }
      }
    );
  }
  function praysBySynagogueFunction(
    $resource,
    SERVER_URL,
    jwtHelper,
    $localStorage
  ) {
    var oAuth = $localStorage.currentUser;
    return $resource(
      SERVER_URL.PROD + "/praysBySynagogue/:id",
      { id: "@myid" },
      {
        get: { method: "GET", headers: { Authorization: oAuth } },
        save: { method: "POST", headers: { Authorization: oAuth } },
        query: {
          method: "GET",
          isArray: true,
          headers: { Authorization: oAuth }
        },
        update: { method: "PUT", headers: { Authorization: oAuth } },
        destroy: { method: "DELETE", headers: { Authorization: oAuth } }
      }
    );
  }
})();
