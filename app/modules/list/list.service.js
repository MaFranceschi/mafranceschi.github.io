/**
 * @description: Servicio encargado de manejar el proceso de sala de espera
 */
(function()
{

    'use strict';

    angular.module('911app.services.list').service('ListService', 
            ['$q','$rootScope', '$http', 'LoggerService', 'DatabaseService', 'MessageService', 'VideoService',
                'GNOAPI', 'RESOURCE', ListService]);

    function ListService($q, $rootScope, $http, LoggerService, DatabaseService, MessageService, VideoService, GNOAPI, RESOURCE)
    {
        self.conexiones = [];

        this.getEmergencies = getEmergenciesRequest;
        this.respondEmergency = respondEmergency;

        function respondEmergency ( )
        {
            LoggerService.debug( 'Entrando al metodo respondEmergency:list.service' );

            var defered = $q.defer();
            var promise = defered.promise;

            if($rootScope.emergency.emergencyIdInServer != null && $rootScope.emergency.emergencyIdInServer != undefined)
            {
                promise = verifyEmergency().then( deleteEmergencyRequest );
            }
            else
            {
                defered.reject();
            }

            LoggerService.debug( 'Saliendo del metodo respondEmergency:list.service' );

            return promise;
        }


        /**
         * @description: Metodo que realiza la solicitud al servidor para obtener una emergencia encolada
         * @returns {Function}
         */
        function verifyEmergency() 
        {
            LoggerService.debug( "Entrando al metodo verifyEmergency:list.service" );

            var defered = $q.defer();
            var promise = defered.promise;

            var data = prepareDeleteEmergencyData();

            $http({
                method: 'GET',
                url: GNOAPI.URL + RESOURCE.EMERGENCIES,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(
                function success(response) 
                {
                    LoggerService.info('Emergencia existente, empezando atencion');
                    defered.resolve();
                },
                function error(response) 
                {
                    var error = response.data;

                    if (error != null && error != "") 
                    {
                        MessageService.addMessage(error.mensaje, true);
                    }
                    else 
                    {
                        MessageService.addMessage($filter('translate')('messageserror-noconnection'), true);
                    }

                    defered.reject();
                });

            return promise;
        }


       /**
         * @description: Metodo que consulta la emergencia mas antigua en caso de no tener una asignada
         * @returns {Function}
         */
        function getEmergencies() 
        {
            LoggerService.debug( "Entrando al metodo getEmergencies:list.services" );

            var defered = $q.defer();
            var promise = defered.promise;

            var data = DatabaseService.getEmergencyData($rootScope.doctorId);

            //Valida si ya existe una emergencia
            if (data != undefined || data != null)
            {
                $rootScope.emergency = data;
                defered.resolve();
            }
            else
            {
                promise = getEmergenciesRequest();
            }

            return promise;
        }

        /**
         * @description: Luego de obtener la emergencia
         * @param response
         */
        function prepareEmergencyData(response) 
        {
            $rootScope.emergency =
            {
                emergencyIdInServer: response.id,
                doctorId: $rootScope.doctorId,
                beneficiaryId: response.beneficiario.id,
                beneficiaryEmail: response.beneficiario.correo,
                beneficiaryName: response.beneficiario.nombre
            }
        }


        

        /**
         * @description: Metodo que realiza la solicitud al servidor para obtener una emergencia encolada
         * @returns {Function}
         */
        function getEmergenciesRequest() 
        {
            LoggerService.debug( "Entrando al metodo getEmergenciesRequest:list.service" );

            var defered = $q.defer();
            var promise = defered.promise;

            $rootScope.emergency = null;

            $http({
                method: 'GET',
                url: GNOAPI.URL + RESOURCE.EMERGENCIES,
                headers: {'Content-Type': 'application/json'},
                data:""
            }).then(
                function success(response) 
                {
                    if (response.data.id != null)
                    {
                        prepareEmergencyData(response.data);
                        DatabaseService.saveEmergency($rootScope.emergency);
                    }
                    defered.resolve();
                },
                function error(response) 
                {
                    var error = response.data;

                    if (error != null && error != "") 
                    {
                        MessageService.addMessage(error.mensaje, true);
                    }
                    else 
                    {
                        MessageService.addMessage($filter('translate')('messageserror-noconnection'), true);
                    }

                    defered.reject();
                });

            return promise;
        }

        /**
         * @description: Metodo que crea el objeto json que posee la data a enviar en la solicitud para eliminar una emergencia
         * @returns {{id: *}}
         */
        function prepareDeleteEmergencyData() 
        {
            var deleteEmergencyData =
            {
                id: $rootScope.emergency.emergencyIdInServer
            }

            return deleteEmergencyData;
        }

        /**
         * @description: Metodo que realiza la solicitud de eliminacion de emergencia al servidor
         * @returns {Function}
         */
        function deleteEmergencyRequest() 
        {
            LoggerService.debug( "Solicitud a servicio para eliminar la emergencia obtenida" );

            var data = prepareDeleteEmergencyData();

            $http({
                method: 'DELETE',
                url: GNOAPI.URL + RESOURCE.EMERGENCIES,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(
                function success(response) 
                {
                    LoggerService.info( "Emergencia eliminada de la sala de espera correctamente" );
                    DatabaseService.deleteEmergency(data.id);
                    VideoService.callBeneficiary();
                },
                function error(response) 
                {
                    var error = response.data;

                    if (error != null && error != "") 
                    {
                        MessageService.addMessage(error.mensaje, true);
                        LoggerService.warning( error.mensaje );   
                    }
                    else 
                    {
                        MessageService.addMessage($filter('translate')('messageserror-noconnection'), true);
                        LoggerService.error( $filter('translate')('messageserror-noconnection') );   
                    }

                });

        }

    };


})();


