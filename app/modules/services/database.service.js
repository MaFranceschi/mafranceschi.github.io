/**
 * @description: Servicio encargado del manejo de BD local en el dispositivo
 */


    'use strict';

    angular.module('911app.services.database').service('DatabaseService', 
            ['$q', 'LoggerService', '$rootScope', DatabaseService]);

    function DatabaseService($q, LoggerService, $rootScope)
    {
        var db;

        this.saveDoctor = saveDoctor;
        this.getDoctorDataWithoutParams = getDoctorDataWithoutParams;
        this.getDoctorData = getDoctorData;
        this.deleteDoctorSession = deleteDoctorSession;

        this.saveEmergency = saveEmergency;
        this.getEmergencyData = getEmergencyData;
        this.deleteEmergency = deleteEmergency;

        initDatabase();

        /**
         * @private
         * @description: Crea la base de datos indexedDB una vez inicia la aplicacion
         * @return: retorna una promesa en caso de exito
         */
        function initDatabase()
        {
            window.database = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            
            LoggerService.debug("Entrando a initDatabase");

            window.IDBTrasnsaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIndexedDB;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

            // Genera la base de datos
            var request = indexedDB.open("gno", 1);

            request.onsuccess = function(event)
            {
                db = event.target.result;
                LoggerService.info("Base de datos creada correctamente");
            }

            request.onupgradeneeded = function(event)
            {
                db = event.target.result;

                var doctors = db.createObjectStore("medico", { keyPath: "mpps" });
                doctors.createIndex("unique_username", "username", { unique: true});
                doctors.createIndex("unique_id", "doctorId", { unique: true});
                var emergencies = db.createObjectStore("emergencia", { keyPath: "emergencyIdInServer"});
                emergencies.createIndex("unique_doctorId", "doctorId", { unique: true});

                LoggerService.info("Actualizada estructura de colecciones y bd");                
            }

            request.onerror = function(event)
            {
                LoggerService.error("Error al crear la base de datos");                
            }
        }


        /**
         * @description: Persiste en la BD local el medico
         * @param: {doctor}
         */
        function saveDoctor(doctor)
        {

            LoggerService.debug("Iniciando metodo guardar doctor");

            var request = db.transaction(["medico"], "readwrite")
                            .objectStore("medico")
                            .add(doctor);

            request.onsuccess = function(event)
            {
                LoggerService.info('Populated database OK');
            }

            request.onerror = function(event)
            {
                LoggerService.error('Transaction ERROR: ');
            }
        }

        /**
         * @description: Obtiene los datos del medico a traves de su usuario
         * @param: {username} usuario del medico
         * @return: {promise} promesa con datos de medico en caso de exito o error
         */
        function getDoctorData(mpps)
        {
            LoggerService.debug("Iniciando metodo obtener informacion de medico");


            var transaction = db.transaction(["medico"], "readonly");
            var doctors = transaction.objectStore("medico");
            var request = doctors.get(mpps);

            request.onerror = function(event)
            {
                LoggerService.error("Error al consultar datos del doctor ");
            }

            request.onsuccess = function(event)
            {
                LoggerService.info("Datos del doctor obtenidos correctamente");
            }
        }

        /**
         * @description: Obtiene los datos un medico
         * @return: {promise} promesa con datos de medico en caso de exito o error
         */
        function getDoctorDataWithoutParams()
        {
            LoggerService.debug("Iniciando metodo obtener informacion de medico");

            var transaction = db.transaction(["medico"], "readonly");
            var doctors = transaction.objectStore("medico");
            var request = doctors.getAll();

            request.onerror = function(event)
            {
                LoggerService.error("Error al consultar datos del doctor ");
            }

            request.onsuccess = function(event)
            {
                if (request.result.length > 0)
                {
                    var doctor = request.result[0];

                    $rootScope.doctorId = doctor.doctorId;
                    $rootScope.name = doctor.name;
                    $rootScope.mpps = doctor.mpps;
                    $rootScope.username = doctor.username;
                    $rootScope.peerId = doctor.peerId;
                }

                LoggerService.info("Datos del doctor obtenidos correctamente");
            }
        }

        /**
         * @description: Elimina en la BD local al cerrar la sesion del medico
         * @param: {username} usuario del doctor
         */
        function deleteDoctorSession(mpps)
        {
            LoggerService.debug("Iniciando metodo eliminar sesion de medico");

            var transaction = db.transaction(["medico"], "readwrite");
            var doctors = transaction.objectStore("medico");
            var request = doctors.delete(mpps);

            request.onerror = function(event)
            {
                LoggerService.error('Transaction ERROR: Doctor');
            }

            request.onsuccess = function(event)
            {
                LoggerService.info('Doctor Session Deleted OK');
            }
        }


        /**
         * @description: Obtiene los datos de emergencia a traves del id del medico
         * @param: {doctorId} id del medico
         * @return: {promise} promesa con datos de medico en caso de exito o error
         */
        function getEmergencyData(doctorId)
        {
            LoggerService.debug("Iniciando metodo obtener informacion de la emergencia con id del doctor " + doctorId);

            var defered = $q.defer();
            var promise = defered.promise;

            var transaction = db.transaction(["emergencia"], "readonly");
            var emergencies = transaction.objectStore("emergencia");
            var indexDoctor = emergencies.index("unique_doctorId");
            var request = indexDoctor.get(doctorId);

            var retorno;

            request.onerror = function(event)
            {
                LoggerService.error("Error al consultar datos de la emergencia");
                retorno = null;
            }

            request.onsuccess = function(event)
            {
                if(event.target.result != undefined || event.target.result != null)
                {
                    LoggerService.info("Emergencia obtenida correctamente");
                    retorno = event.target.result;
                }
                else
                {
                    LoggerService.info("No hay emergencias asignadas");
                    retorno = null;
                }
            }

            return retorno;
        }

        /**
         * @description: Elimina en la BD local al cerrar emergencia
         * @param: {emergencyId} id de la emergencia
         */
        function deleteEmergency(emergencyId)
        {
            LoggerService.debug("Iniciando metodo eliminar emergencia");

            var transaction = db.transaction(["emergencia"], "readwrite");
            var emergencies = transaction.objectStore("emergencia");
            var request = emergencies.delete(emergencyId);

            request.onerror = function(event)
            {
                LoggerService.error('Transaction ERROR: Emergency');
            }

            request.onsuccess = function(event)
            {
                LoggerService.info('Emergency Deleted OK');
            }
        }

        /**
         * @description: Persiste en la BD la emergencia
         * @param: {emergency}
         */
        function saveEmergency(emergency)
        {
            LoggerService.debug("Iniciando metodo guardar emergencia");

            var request = db.transaction(["emergencia"], "readwrite")
                            .objectStore("emergencia")
                            .add(emergency);

            request.onsuccess = function(event)
            {
                LoggerService.info('Populated database OK: Emergency');
            }

            request.onerror = function(event)
            {
                LoggerService.error('Transaction ERROR: Emergency');
            }
        }
    };

