'use strict';

angular.module('911app.routes', []);
angular.module('911app.resources', []);
angular.module('911app.directives.message', []);
angular.module('911app.factories.messages', []);
angular.module('911app.controllers.chat', []);
angular.module('911app.controllers.video', []);
angular.module('911app.controllers.login', []);
angular.module('911app.controllers.list', []);
angular.module('911app.controllers.dashboard', []);
angular.module('911app.services.chat', []);
angular.module('911app.services.video', []);
angular.module('911app.services.video-call', []);
angular.module('911app.services.login', []);
angular.module('911app.services.list', []);
angular.module('911app.services.validate', []);
angular.module('911app.services.logger', []);
angular.module('911app.services.database', []);
angular.module('911app.services.dashboard', []);
angular.module('911app.services.message', []);
angular.module('911app.services.peerjs', []);
angular.module('911app.services.file', []);
angular.module('911app.services.xml', []);

angular.module('grupo911App')
    .config(['$translateProvider', translateProvider]);

function translateProvider ($translateProvider)
{
  console.log('Al empezar');


  $translateProvider.useStaticFilesLoader({
    prefix: './resources/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('es_VE');
  $translateProvider.useSanitizeValueStrategy('escaped');

}
