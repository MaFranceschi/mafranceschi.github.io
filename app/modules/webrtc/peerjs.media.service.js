(function()
{

    'use strict';

    angular.module('911app.services.peerjs').service('PeerMediaService', ['$rootScope', '$state', 'ngDialog', 'LoggerService', 'VideoCallService', PeerMediaService]);

    function PeerMediaService($rootScope, $state, ngDialog, LoggerService, VideoCallService)
    {

        this.startCall = startVideoCall;
        this.endVideoCall = endVideoCall;
        this.receiveVideoCall = onReceiveCall;


        /**
         * Metodo que se encarga de mostrar el video y audio del doctor en pantalla
         * @param {MediaStream} stream audio y videos locales 
         */
        function onReceiveStreamLocal(stream)
        {
                LoggerService.debug('Entrando al metodo onReceiveStreamLocal:peerjs.media.service');

                var video = document.getElementById('local-video');
                video.muted = true;
                video.src = window.URL.createObjectURL(stream);
                $rootScope.peer_stream = stream;
                LoggerService.info('Video local proyectado');

                LoggerService.debug('Saliendo del metodo onReceiveStreamLocal:peerjs.media.service');
        }


        /**
         * @description: Metodo que ejecuta el proceso de video llamada
         */
        function startVideoCall(userPeerId)
        {
                LoggerService.debug('Entrando al metodo startVideoCall:peerjs.media.service');

                // Accede a la camara y microfono del dispositivo
                navigator.mediaDevices.getUserMedia({audio: true, video: true})
                    .then(function(stream)
                    {

                        var name = $rootScope.name;
                        $rootScope.call =  $rootScope.peer.call(userPeerId, stream, {metadata: {username: name, mobileCaseId: $rootScope.mobileCaseId}});
                        $rootScope.localStream = stream;

                        // Evento que se ejecuta en caso de recibir informacion
                        $rootScope.call.on('stream', onRemoteStream);
                        $rootScope.call.on('close', onCloseVideoCall);
                        $rootScope.call.on('error', onErrorVideoCall);

                        onReceiveStreamLocal(stream);

                    })
                    .catch(function(err)
                    {
                        LoggerService.warning('Problemas al acceder a la camara o microfono del dispositivo');
                        $state.go("dashboard.list");
                    });

                LoggerService.debug('Saliendo del metodo startVideoCall:peerjs.media.service');

        }


        /**
         * @description: Metodo que ejecuta el proceso de cierre de video llamada
         */
        function endVideoCall()
        {
            LoggerService.debug('Entrando al metodo endVideoCall:peerjs.media.service');

            $rootScope.call.close();
            $rootScope.call = null;
            closeVideoStream('local-video');
            closeVideoStream('remote-video');
            $state.go("dashboard.list");

            if($rootScope.localStream)
            {
                var track = $rootScope.localStream.getVideoTracks()[0];
                track.stop();
            }

            LoggerService.debug('Saliendo del metodo endVideoCall:peerjs.media.service');
            
        }


        /**
         * @private
         * @description: Se encarga de detener la imagen en transmision 
         * @param {String} element elemento tipo video a ser manejado
         */
        function closeVideoStream(element)
        {
            LoggerService.debug('Entrando al metodo closeVideoStream:peerjs.media.service');

            var video = document.getElementById(element)
            video.pause();
            video.src="";

            LoggerService.debug('Saliendo del metodo closeVideoStream:peerjs.media.service');
        }


       /**
        * @private
         * @description: Metodo que se ejecuta cuando se recibe una llamada entrante del medico
         * @param {Call} call llamada recibida por el doctor 
         */
        function onReceiveCall(call)
        {
            LoggerService.debug('Entrando a metodo onReceiveCall:peerjs.media.service');
            LoggerService.info('Llamada entrante en progreso');

            $rootScope.receiveCall = true;

            var ringtoneCall = document.createElement('audio');
            ringtoneCall.src = '../../content/ringtone.mp3';
            ringtoneCall.loop = true;
            ringtoneCall.play();


            $rootScope.modal = ngDialog.openConfirm({
                scope: $rootScope,
                templateUrl: 'templates/modals/confirm.html'
            })            
            .then(function()
            {
                ringtoneCall.pause();

                $state.go("dashboard.video");

                //Accede a camara y microfono del dispositivo
                navigator.mediaDevices.getUserMedia({audio: true, video: true})
                    .then(function(stream)
                        {
                            $rootScope.call = call;

                            var receiveData = $rootScope.call.metadata;
                            $rootScope.mobileCaseId = receiveData.mobileCaseId;

                            $rootScope.call.answer(stream);
                            
                            // Evento que se activa cuando se recibe transmision del medico
                            $rootScope.call.on('stream', onRemoteStream);
                            $rootScope.call.on('close', onCloseVideoCall);
                            $rootScope.call.on('error', onErrorVideoCall);

                            onReceiveStreamLocal(stream);

                        })
                    .catch(function(err)
                        {
                            LoggerService.warning('Problemas al acceder a la camara o microfono del dispositivo');
                            call.close();
                            $state.go("dashboard.list");

                        });


            }, function()
            {
                ringtoneCall.pause();

                LoggerService.info('Llamada rechazada por el paciente');
                call.close();
            });

        }


        /**
         * @description: Evento que se ejecuta cuando se recibe stream remoto
         * @param {MediaStream} remotestream stream remoto
         */
        function onRemoteStream(remotestream)
        {
            LoggerService.debug('Entrando al metodo onRemoteStream:peerjs.media.service');

            var video = document.getElementById('remote-video');
            video.src = window.URL.createObjectURL(remotestream);
            video.onloadedmetadata = function ()
            {
                LoggerService.info('Iniciada videollamada');

                // Responde la llamada en caso de ser llamada recibida
                if($rootScope.receiveCall)
                {
                    VideoCallService.respondBeneficiaryCall()
                        .then(function()
                        {
                            LoggerService.info('Llamada atendida correctamente');    
                        })
                        .catch(function()
                        {
                            LoggerService.warning('Error al atender la llamada');
                        });

                }

            }


            LoggerService.debug('Saliendo del metodo onRemoteStream:peerjs.media.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando se cierra la video llamada
         */
        function onCloseVideoCall()
        {
            LoggerService.debug('Entrando al metodo onCloseVideoCall:peerjs.media.service');
            
            LoggerService.info('LLamada cerrada');
            $rootScope.call = null;
            closeVideoStream('local-video');
            closeVideoStream('remote-video');
            $state.go("dashboard.list");


            LoggerService.debug('Saliendo del metodo onCloseVideoCall:peerjs.media.service');
        }


        /**
         * @description: Metodo que se ejecuta cuando hay un error con la videollamada
         */
        function onErrorVideoCall()
        {
            LoggerService.debug('Entrando al metodo onErrorVideoCall:peerjs.media.service');

            $rootScope.call = null;
            $state.go("dashboard.list");

            LoggerService.debug('Saliendo del metodo onErrorVideoCall:peerjs.media.service');   
        }



    }

})();