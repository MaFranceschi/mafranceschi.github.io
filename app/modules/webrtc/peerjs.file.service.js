/**
 * @description: Servicio que se encarga de la recepcion y envio de archivos
 */
(function () 
{

    angular.module('911app.services.peerjs').service('PeerFileService', ['$rootScope', 'LoggerService', 'FileService', 'MessageService', PeerFileService]);


    function PeerFileService($rootScope, LoggerService, FileService, MessageService) 
    {

        this.sendFile = sendDataFile;
        this.connectWithUser = openDataFileConnection;
        this.receiveConnection = onReceiveDataFileConnection;


        /**
         * @description: funcion que realiza la conexion para transmitir datos con el doctor
         * @param {String} doctorPeerId id de peerjs del doctor compuesto por (fechaInicioSesion + numero mpps)
         */
        function openDataFileConnection(userPeerId) 
        {
            LoggerService.debug('Entrando al metodo openDataFileConnection:peerjs.file.service');


            // Genera un canal de datos entre el doctor y el paciente
            var connection = $rootScope.peer.connect(userPeerId,
                {
                    label: 'file',
                    reliable: true,
                    metadata: 
                    {
                        username: name, 
                        mobileCaseId: $rootScope.actualConferenceId                    
                    }
                });

            $rootScope.connections.addFileConnection(userPeerId, connection);

            $rootScope.connections[userPeerId].fileConnection.on('open', onStartDataFileConnection);
            $rootScope.connections[userPeerId].fileConnection.on('error', onErrorDataFileConnection);


            LoggerService.debug('Saliendo del metodo openDataFileConnection:peerjs.file.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando se crea un enlace entre el paciente y el medico
         * @param {DataChannel} conn Objeto de conexion provisto por PeerJS
         */
        function onStartDataFileConnection() 
        {
            LoggerService.debug('Entrando al metodo onStartDataFileConnection:peerjs.file.service');

            $rootScope.connections[$rootScope.userPeerId].fileConnection.on('data', onReceiveFile);
            $rootScope.connections[$rootScope.userPeerId].fileConnection.on('close', onCloseDataFileConnection);

            LoggerService.debug('Saliendo del metodo onStartDataFileConnection:peerjs.file.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando se crea un enlace entre el medico y el paciente
         * @param {DataChannel} conn Objeto de conexion provisto por PeerJS
         */
        function onReceiveDataFileConnection(conn) 
        {
            LoggerService.debug('Entrando al metodo onReceiveDataConnection:peerjs.data.service');

            var userPeerId = conn.peer;

            $rootScope.connections.addFileConnection(userPeerId, conn, $rootScope.name);

            $rootScope.connections[userPeerId].fileConnection.on('data', onReceiveFile);
            $rootScope.connections[userPeerId].fileConnection.on('close', onCloseDataFileConnection);

            LoggerService.debug('Saliendo del metodo onReceiveDataConnection:peerjs.data.service');
        }





        /**
         * @private
         * @description: Metodo que recibe la informacion enviada por el doctor
         * @param {Data} data archivo o mensaje recibido
         */
        function onReceiveFile(data) 
        {

            LoggerService.debug('Entrando al metodo onReceiveFile:peerjs.file.service');

            var receiveMessage = JSON.parse(data);
            var message = new Message(receiveMessage.content, receiveMessage.sentBy, receiveMessage.when, receiveMessage.type);

            if($rootScope.actualChat != undefined)
            {
                MessageService.showFile(message, true);
            }

            LoggerService.debug('Saliendo del metodo onReceiveFile:peerjs.file.service');
        }


        /**
         * @private
         * @description: Evento que se ejecuta al cerrar la conexion
         */
        function onCloseDataFileConnection() 
        {
            LoggerService.debug('Entrando al metodo onCloseDataFileConnection:peerjs.file.service');

            LoggerService.info('Conexion cerrada correctamente');

            LoggerService.debug('Saliendo del metodo onCloseDataFileConnection:peerjs.file.service');
        }


        /**
         * @private
         * @description: Evento que se ejecuta al ocurrir un error con la conexion
         */
        function onErrorDataFileConnection(err) 
        {
            LoggerService.debug('Entrando al metodo onErrorDataFileConnection:peerjs.file.service');

            LoggerService.error('Ha ocurrido un error fatal con la conexion');
            LoggerService.error(err);

            LoggerService.debug('Saliendo del metodo onErrorDataFileConnection:peerjs.file.service');
        }

        
        /**
         * @description: Envia un archivo adjunto al beneficiario
         * @param {File} file archivo adjunto
         */
        function sendDataFile(file)
        {
            LoggerService.debug('Entrando al metodo sendDataFile:peerjs.file.service');

            if($rootScope.connections[$rootScope.userPeerId].isFileConnectionActive())
            {
                //file debe tener un tipo y el tipo de archivo que se envia
                FileService.convert(file)
                    .then(function(convertedFile)
                    {
                        let messageFile = $rootScope.connections[$rootScope.userPeerId].sendFile(convertedFile);
                        MessageService.showFile(messageFile, false);
                        LoggerService.info('Archivo enviado correctamente');
                        
                    })
                    .catch(function()
                    {
                        LoggerService.error('Error al enviar el archivo, error de conversion');
                    });
            }
            else
            {
                LoggerService.warning('No se ha podido enviar el archivo, no hay ninguna conexion abierta');
            }

            LoggerService.debug('Entrando al metodo sendDataFile:peerjs.file.service');

        }

    }


})();