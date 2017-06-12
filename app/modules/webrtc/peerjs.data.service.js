/**
 * @description: Servicio encargado de manejar las transmisiones de datos con PeerJS
 */
(function () {

    'use strict';

    angular.module('911app.services.peerjs').service('PeerDataService', ['$q', '$rootScope', 'LoggerService', 'MessageService', PeerDataService]);

    function PeerDataService($q, $rootScope, LoggerService, MessageService) 
    {
        this.sendMessage = sendDataMessage;
        this.connectWithUser = openDataConnection;
        this.receiveConnection = onReceiveDataConnection;
        this.close = closeDataConnection;

        /**
         * @description: funcion que realiza la conexion con el paciente
         * @param {String} userPeerId id de peerjs del paciente compuesto por (fechaInicioSesion + documento)
         */
        function openDataConnection(userPeerId) 
        {
            LoggerService.debug('Entrando al metodo connect:peerjs.service');

            var name = $rootScope.name;
            // Genera un canal de datos entre el doctor y el paciente

            var connection = $rootScope.peer.connect(userPeerId, 
            {
                label: 'chat',
                metadata: 
                {
                    username: name,
                    mobileCaseId: $rootScope.mobileCaseId
                }
            });

            $rootScope.connections.addDataConnection(userPeerId, connection, $rootScope.name);

            $rootScope.connections[userPeerId].dataConnection.on('open', onStartDataConnection);
            $rootScope.connections[userPeerId].dataConnection.on('error', onErrorDataConnection);

            LoggerService.debug('Saliendo del metodo connect:peerjs.service');

        }


        /**
         * @description: Metodo que se ejecuta cuando se crea un enlace entre el paciente y el medico
         */
        function onStartDataConnection() 
        {
            LoggerService.debug('Entrando al metodo onStartDataConnection:peerjs.data.service');

            $rootScope.connections[$rootScope.userPeerId].dataConnection.on('data', onReceiveData);
            $rootScope.connections[$rootScope.userPeerId].dataConnection.on('close', onCloseDataConnection);

            $rootScope.connections[$rootScope.userPeerId].dataConnection.send('Conexion iniciada desde el beneficiario, establecido canal de mensajes');

            LoggerService.debug('Saliendo del metodo onStartDataConnection:peerjs.data.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando se recibe un enlace entre el paciente y el medico
         * @param {DatasChannel} conn Objeto de conexion provisto por PeerJS
         */
        function onReceiveDataConnection(conn) 
        {
            LoggerService.debug('Entrando al metodo onReceiveDataConnection:peerjs.data.service');

            var userPeerId = conn.peer;

            $rootScope.connections.addDataConnection(userPeerId, conn, $rootScope.name);

            $rootScope.connections[userPeerId].dataConnection.on('data', onReceiveData);
            $rootScope.connections[userPeerId].dataConnection.on('close', onCloseDataConnection);

            $rootScope.connections[userPeerId].dataConnection.send('Conexion iniciada desde el beneficiario, establecido canal de mensajes');

            LoggerService.debug('Saliendo del metodo onReceiveDataConnection:peerjs.data.service');
        }


        /**
         * @private
         * @description: Metodo que recibe la informacion enviada por el doctor
         * @param {Data} data archivo o mensaje recibido
         */
        function onReceiveData(data) 
        {
            LoggerService.debug('Entrando al metodo onReceiveData:peerjs.data.service');

            var receiveMessage = JSON.parse(data);
            var message = new Message(receiveMessage.content, receiveMessage.sentBy, receiveMessage.when, receiveMessage.type);

            if($rootScope.actualChat != undefined)
            {
                    MessageService.showMessage(message, true);
            }

            MessageService.addMessageToConnection(message, true);

            LoggerService.debug('Saliendo del metodo onReceiveData:peerjs.data.service');
        }


        /**
         * @private
         * @description: Evento que se ejecuta al cerrar la conexion
         */
        function onCloseDataConnection() 
        {
            LoggerService.debug('Entrando al metodo onCloseDataConnection:peerjs.data.service');

            LoggerService.info('Conexion cerrada correctamente');

            LoggerService.debug('Saliendo del metodo onCloseDataConnection:peerjs.data.service');
        }


        /**
         * @private
         * @description: Evento que se ejecuta al ocurrir un error con la conexion
         */
        function onErrorDataConnection() 
        {
            LoggerService.debug('Entrando al metodo onErrorDataConnection:peerjs.data.service');

            LoggerService.error('Ha ocurrido un error fatal con la conexion');

            LoggerService.debug('Saliendo del metodo onErrorDataConnection:peerjs.data.service');
        }


        /**
         * @description: Cierra la conexion establecida con el doctor
         */
        function closeDataConnection() 
        {
            LoggerService.debug('Entrando al metodo closeDataConnection:peerjs.data.service');

            $rootScope.connections[$rootScope.userPeerId].close();

            LoggerService.debug('Saliendo del metodo closeDataConnection:peerjs.data.service');
        }


        /**
         * @description: Envia un mensaje de texto al doctor
         * @param {String} message mensaje de texto a enviar
         */
        function sendDataMessage(content) 
        {

            LoggerService.debug('Entrando al metodo sendDataMessage:peerjs.data.service')

            if ($rootScope.connections[$rootScope.userPeerId].isDataConnectionActive()) 
            {
                //message debe tener un tipo
                var message = $rootScope.connections[$rootScope.userPeerId].sendMessage(content);
                MessageService.addMessageToConnection(message, false);
                LoggerService.info('Mensaje enviado correctamente');
            }
            else 
            {
                LoggerService.warning('No se ha podido enviar el mensaje, no hay ninguna conexion abierta');
            }

            LoggerService.debug('Saliendo del metodo sendDataMessage:peerjs.data.service')

            return message;
        }


    }

})();