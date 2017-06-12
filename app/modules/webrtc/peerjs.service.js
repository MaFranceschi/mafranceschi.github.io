/**
 * @description: Servicio encargado del manejo de BD local en el dispositivo
 */
(function()
{

    'use strict';

    angular.module('911app.services.peerjs').service('PeerjsService', 
            ['$state','$q', '$rootScope', 'SERVER', 'PEERJS_KEY', 'LoggerService', 'VideoCallService', 'PeerMediaService', 'PeerDataService', 'PeerFileService', PeerjsService]);

    function PeerjsService($state, $q, $rootScope, SERVER, PEERJS_KEY, LoggerService, VideoCallService, PeerMediaService, PeerDataService, PeerFileService)
    {
        this.createSessionWithPeerJS = createSession;

        /**
         * @private
         * @description: Crea la sesion con el servidor de PeerJS
         * @param: {user} contiene la informacion del usuario
         */
        function createSession ( doctor )
        {
            LoggerService.debug( 'Entrando al metodo createSession:peerjs.service' );

            $rootScope.connections = new DataConnectionList();
            $rootScope.peerId = doctor.peerId;
            $rootScope.progressCall = false;

            var customConfig;

            // Call XirSys ICE servers
            $.ajax( {
                url: SERVER.STUN_TURN_URL,
                data: {
                ident: SERVER.STUN_TURN_IDENT,
                secret: SERVER.STUN_TURN_SECRET,
                domain: SERVER.STUN_TURN_DOMAIN,
                application: SERVER.STUN_TURN_APP,
                room: SERVER.STUN_TURN_ROOM,
                secure: 1
                },
                success: function( data, status )
                {
                // data.d is where the iceServers object lives
                customConfig = data.d;
                LoggerService.info( customConfig );
                },
                async: false
            } );

            // PeerJS object
            var peer = new Peer( $rootScope.peerId, {
                key: PEERJS_KEY,
                debug: 3,
                config: customConfig
            } );

            $rootScope.peer = peer;
            $rootScope.peer.on('open', onPeerAssigned);
            $rootScope.peer.on('disconnect', onDisconnection);
            $rootScope.peer.on('error', onErrorConnection);

            $rootScope.peer.on('connection', onReceiveConnection);
            
            $rootScope.peer.on('close', onCloseConnection);
            
            $rootScope.peer.on('call', PeerMediaService.receiveVideoCall);

            LoggerService.debug( 'Saliendo del metodo createSession:peerjs.service' );

        }


        /**
         * @description: Metodo que se ejecuta cuando se abre un nuevo peer al iniciar sesion
         * @param {String} PeerId Identificador de peerId compuesto por (fechaInicioSesion + documento) del usuario
         */
        function onPeerAssigned(PeerId)
        {
            LoggerService.debug('Entrando a metodo onPeerAssigned:peerjs.service');
            LoggerService.info('PeerId asignado es ' + PeerId );
            LoggerService.debug('Saliendo del metodo onPeerAssigned:peerjs.service');
        }


        function onReceiveConnection(conn)
        {
            LoggerService.debug('Entrando al metodo onReceiveConnection:peerjs.service');

            var receiveData = conn.metadata;
            $rootScope.actualConferenceId = receiveData.mobileCaseId;

            LoggerService.info('Recibida informacion de doctor ' + receiveData.username);

            if(conn.label == 'chat')
            {
                PeerDataService.receiveConnection(conn);
            }
            else if(conn.label == 'file')
            {
                PeerFileService.receiveConnection(conn);
            }

                LoggerService.debug('Saliendo del metodo onReceiveConnection:peerjs');
            }


        /**
         * @description: Metodo que se ejecuta cuando se cierra la conexion entre paciente y medico
         */
        function onCloseConnection()
        {
            LoggerService.debug('Entrando al metodo onCloseConnection:peerjs.service');
            LoggerService.info('La conexion ha sido cerrada');
            LoggerService.debug('Saliendo del metodo onCloseConnection:peerjs.service');
        }
        

        /**
         * @description: Metodo que se ejecuta cuando se desconecta la sesion de Peerjs
         */
        function onDisconnection()
        {
            LoggerService.debug('Entrando al metodo onDisconnection:peerjs.service');
            LoggerService.info('Se ha desconectado de Peerjs');
            LoggerService.debug('Saliendo del metodo onDisconnection:peerjs.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando ha ocurrido un error con la conexion de Peerjs
         */
        function onErrorConnection()
        {
            LoggerService.debug('Entrando al metodo onErrorConnection:peerjs.service');
            LoggerService.error('Ha ocurrido un error fatal');
            LoggerService.debug('Saliendo del metodo onErrorConnection:peerjs.service');
        }

        function isPeerConnected()
        {
            let result = false;

            if($rootScope.peer && !$rootScope.peer.disconnected)
            {
                result = true;
            }

            return result;
        }

    };

})();