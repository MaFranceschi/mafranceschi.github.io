/**
 * @description: Servicio encargado del proceso de videoconferencia
 */

(function()
{

    'use strict';

    angular.module('911app.services.video-call').service('VideoCallService', 
            ['$rootScope', '$q', '$http', '$filter', 'MessageService', 'LoggerService', 'GNOAPI', 'RESOURCE', VideoCallService]);

    function VideoCallService($rootScope, $q, $http, $filter, MessageService, LoggerService, GNOAPI, RESOURCE) 
    {

        this.respondBeneficiaryCall = respondBeneficiaryCall;


        /**
         * @description: Metodo que crea el objeto json a enviar en la solicitud de cierre de llamada al servidor
         * @returns {{casoMovil: {id: *}}}
         */
        function prepareCloseBeneficiaryCallRequestData()
        {
            var data =
            {
                casoMovil:
                {
                    id:$rootScope.mobileCaseId
                }
            };

            return data;
        }


         /**
         * @description: Metodo que realiza la solicitud de cierre de llamada al servidor
         * @returns {Function}
         */
        function respondBeneficiaryCall()
        {
            var defered = $q.defer();
            var promise = defered.promise;

            var requestData = prepareCloseBeneficiaryCallRequestData();

            $http({
                method: 'PUT',
                url: GNOAPI.URL + RESOURCE.VIDEO,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(requestData)
            }).then(
                function success(response)
                {

                    defered.resolve();
                },
                function error(response)
                {
                    var error = response.data;

                    if (error != null && error != "") {
                        MessageService.addMessage(error.mensaje, true);
                    }
                    else {
                        MessageService.addMessage($filter('translate')('messageserror-noconnection'), true);
                    }

                    defered.reject();
                });

            return promise;
        }
 
    };

})();