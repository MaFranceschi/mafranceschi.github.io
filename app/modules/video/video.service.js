/**
 * @description: Servicio encargado del proceso de videoconferencia
 */

(function()
{

    'use strict';

    angular.module('911app.services.video').service('VideoService', 
            ['$rootScope', '$q', '$http', '$filter', 'DatabaseService', 'MessageService', 
            'LoggerService', 'PeerDataService', 'PeerMediaService', 'GNOAPI', 'RESOURCE', VideoService]);

    function VideoService($rootScope, $q, $http, $filter, DatabaseService, MessageService, LoggerService, PeerDataService, PeerMediaService,  GNOAPI, RESOURCE) 
    {

        this.callBeneficiary = callBeneficiary;
        this.closeBeneficiaryCall = closeBeneficiaryCall;

 
        /**
         * @description: Metodo que crea el objeto json a enviar en la solicitud de llamada a un beeficiario al servidor
         * @returns {{salaEspera: {beneficiario: {correo: *}}, medico: {numeroMpps: *}}}
         */
        function prepareCallBeneficiaryRequestData()
        {
            var data =
            {
                salaEspera:
                {
                    beneficiario:
                    {
                        correo: $rootScope.emergency.beneficiaryEmail
                    }
                },
                medico:
                {
                    numeroMpps:$rootScope.mpps
                }
            };

            return data;
        }


        /**
         * @descripcion: Metodo que realiza la solicitud de creacion llamada a beneficiario al servidor
         * @returns {Function}
         */
        function callBeneficiary()
        {
            var defered = $q.defer();
            var promise = defered.promise;

            var requestData = prepareCallBeneficiaryRequestData();

            $http({
                method: 'POST',
                url: GNOAPI.URL + RESOURCE.VIDEO,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(requestData)
            }).then(
                function success(response)
                {

                    $rootScope.user = response.data.beneficiario;

                    $rootScope.mobileCaseId = response.data.id;
                    LoggerService.info('Llamando a beneficiario');
                    PeerMediaService.startCall( $rootScope.user.peerId );
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
        function closeBeneficiaryCall()
        {
            var defered = $q.defer();
            var promise = defered.promise;

            var requestData = prepareCloseBeneficiaryCallRequestData();

            $http({
                method: 'DELETE',
                url: GNOAPI.URL + RESOURCE.VIDEO,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(requestData)
            }).then(
                function success(response)
                {
                    PeerMediaService.endVideoCall();
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