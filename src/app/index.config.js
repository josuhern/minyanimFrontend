(function() {
  'use strict';

  angular
    .module('minyan')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, ngIntlTelInputProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    //ngIntlTelInputProvider.set({initialCountry: 'us'});
    ngIntlTelInputProvider.set({
      autoHideDialCode: true,
      nationalMode: false,
      utilsScript: "/bower_components/intl-tel-input/build/js/utils.js"
    });
  }

})();
