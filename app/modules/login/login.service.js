/**
 * @description: Servicio encargado del inicio de sesion del doctor
 */
(function()
{

    'use strict';

    angular.module('911app.services.login').service('LoginService', 
            ['$rootScope', '$filter', '$q', '$http', 'DatabaseService', 'ValidateService', 'MessageService', 'LoggerService', 
                'PeerjsService', 'GNOAPI', 'RESOURCE', LoginService]);

    function LoginService($rootScope, $filter, $q, $http, DatabaseService, ValidateService, MessageService, LoggerService, PeerjsService, GNOAPI, RESOURCE) 
    {
        var doctorCredentials = {};

        this.login = login;
        this.logout = doLogout;


        /**
         * @description: Encargado de ejecutar el proceso de login en el servicio web
         * @param doctor
         * @returns {Function}
         */
        function login(doctor) 
        {

            LoggerService.debug( 'Entrando al metodo login:login.service' );

            var defered = $q.defer();
            var promise = defered.promise;

            if (GNOAPI.ENV === 'localhost' || GNOAPI.ENV === 'development') 
            {
                LoggerService.info( 'Modo desarrollo de login' );
                $rootScope.debugMode = true;

                DatabaseService.getDoctorDataWithoutParams();

                if ($rootScope.doctorId == undefined )
                {
                    // if(ValidateService.login(doctor))
                    // {
                    doctor.username = 'pperez';
                    doctor.password = '123456';
                    doctor.debug = $rootScope.debugMode;
                    doctor.mpps = GNOAPI.DOCTOR.MPPS;
                    promise = authenticateDoctor(doctor);
                    // }
                    // else
                    // {
                    //     defered.reject();
                    // }
                }
                else
                {
                    MessageService.addMessage($filter('translate')('messageserror-anotherlogged'), true);
                    defered.reject();
                }
            }
            else 
            {
                LoggerService.info( 'Modo produccion de login' );
                $rootScope.debugMode = false;

                if (ValidateService.login(doctor)) 
                {
                    doctor.debug = $rootScope.debugMode;
                    doctor.mpps = 0;

                    DatabaseService.getDoctorDataWithoutParams();

                    if ($rootScope.doctorId == undefined )
                    {
                        promise = authenticateDoctor(doctor);
                    }
                    else
                    {
                        MessageService.addMessage($filter('translate')('messageserror-anotherlogged'), true);
                        defered.reject();
                    }

                }
                else 
                {
                    defered.reject();
                }
            }

            return promise;
        }


        /**
         * @description: Prepara el json a enviar en la peticion post al servicio de login
         * @param doctor
         * @returns {{}}
         */
        function prepareDataLoginRequest(doctor) 
        {
            doctorCredentials =
            {
                debug: doctor.debug,
                medico: 
                {
                    usuario: doctor.username,
                    clave: doctor.password,
                    numeroMpps: doctor.mpps
                }
            }
            return doctorCredentials;
        }

        /**
         * @description: Encargado de autenticar el usuario con el servicio web
         * @param doctor
         * @returns {Function}
         */
        function authenticateDoctor(doctor) 
        {
            LoggerService.debug( 'Entrando al metodo authenticateDoctor:login.service' );

            doctorCredentials = prepareDataLoginRequest(doctor);

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: GNOAPI.URL + RESOURCE.SESION,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(doctorCredentials)
            }).then(
                function success(response) 
                {
                    LoggerService.info( 'Datos del doctor obtenidos correctamente' );

                    var doctor = createDoctor(response.data);
                    saveDoctor(doctor);
                    PeerjsService.createSessionWithPeerJS(doctor);
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
                })

            return promise;
        }

         /**
         * @description: Encargado de registrar el doctor en la base de datos local
         * @param doctor
         */
        function saveDoctor(doctor) 
        {
            DatabaseService.saveDoctor(doctor);
            $rootScope.doctorId = doctor.doctorId;
            $rootScope.name = doctor.name;
            $rootScope.mpps = doctor.mpps;
            $rootScope.username = doctor.username;
            $rootScope.peerId = doctor.peerId;
        }

        /**
         * @description: Encargado de crear el json del doctor
         * @param doctor
         * @returns {{doctorId: (string|string|*), name: (string|string|*), mpps: (string|string|*), username: (string|string|*), password: (string|string|*)}}
         */
        function createDoctor(doctor) 
        {
            var newDoctor =
            {
                doctorId: doctor.id,
                name: doctor.nombre,
                mpps: doctor.numeroMpps,
                username: doctor.usuario,
                password: doctor.clave,
                peerId: doctor.peerId
            }

            return newDoctor;
        }

                /**
         * @description: Encargado de ejecutar el proceso de logout en el servicio web
         * @returns {Function}
         */
        function doLogout()
        {

            LoggerService.debug( 'Entrando al metodo doLogout:login.service' );

            doctorCredentials = prepareLogoutRequestData( );
            $rootScope.emergency = {};

            var defered = $q.defer();
            var promise = defered.promise;

            $http( {
                method: 'PUT',
                url: GNOAPI.URL + RESOURCE.SESION,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify( doctorCredentials )
            } ).then(
                function success ( response )
                {
                    LoggerService.info( 'Cierre de sesion realizado correctamente' );

                    DatabaseService.deleteDoctorSession($rootScope.mpps);

                    $($rootScope.peer)
                    {
                        LoggerService
                        $rootScope.peer.destroy();
                    }

                    defered.resolve();
                },
                function error ( response )
                {
                    var error = response.data;

                    if ( error != null && error != "" )
                    {
                        MessageService.addMessage( error.mensaje, true );
                    }
                    else
                    {
                        MessageService.addMessage( $filter( 'translate' )( 'messageserror-noconnection' ), true );
                    }

                    DatabaseService.deleteDoctorSession($rootScope.mpps);
                    defered.reject();
                } )

            return promise;
        }

        /**
         * @description: Prepara el json a enviar en la peticion put al servicio de logout
         * @returns {{}}
         */
        function prepareLogoutRequestData( )
        {
            doctorCredentials =
            {
                debug: $rootScope.debugMode,
                medico:
                {
                    id: $rootScope.doctorId,
                    clave: '123456',
                    numeroMpps: 0,
                    usuario: 'pperez',

                }
            }

            return doctorCredentials;
        }

    }

})();