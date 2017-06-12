(function () {

    'use strict';

    angular.module('911app.services.chat').service('ChatListService', ['$rootScope', '$q', '$http', '$filter', 'LoggerService', 'MessageService', 'PeerDataService', 'RESOURCE', 'GNOAPI', ChatListService]);

    function ChatListService($rootScope, $q, $http, $filter, LoggerService, MessageService, PeerDataService, RESOURCE, GNOAPI) 
    {
        this.close = closeChat;
        this.getActiveChats = getActiveChats;


        /**
         * @description: Metodo encargado de cerrar una conversacion existente
         */
        function closeChat() 
        {
            LoggerService.debug('Entrando al metodo closeChat:chat-list.service');

            var defered = $q.defer();
            var promise = defered.promise;

            var requestData = setCloseConferenceRequestData();

            $http({
                method: 'DELETE',
                url: GNOAPI.URL + RESOURCE.CHAT,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(requestData)
            }).then(
                function success(response) {
                    LoggerService.info('Chat cerrado correctamente');
                    PeerDataService.close();
                    defered.resolve();
                },
                function error(response) {
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
         * @description: Metodo encargado de obtener los chats abiertos del medico
         */
        function getActiveChats() 
        {
            LoggerService.debug('Entrando al metodo getActiveChats:chat-list.service');

            var defered = $q.defer();
            var promise = defered.promise;

            var requestData = $rootScope.mpps;

            $http({
                method: 'GET',
                url: GNOAPI.URL + RESOURCE.CHAT + '/' + requestData,
                headers: {'Content-Type': 'application/json'},
                data: ''
            }).then(
                function success(response) 
                {
                    LoggerService.info('Chats consultados exitosamente');
                    var chats = responseTranslator(response.data);
                    defered.resolve(chats);
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
         * @description: Prepara peticion para cerrar caso
         */
        function setCloseConferenceRequestData() 
        {
            var data =
            {
                casoMovil: 
                {
                    id: $rootScope.actualConferenceId
                }
            };

            return data;
        }


        function responseTranslator(response) 
        {

            var chats = [];

            for (var i = 0; i<response.length; i++)
            {
                var chat = {};

                if (response[i].beneficiario != null)
                {
                    chat['beneficiary'] = response[i].beneficiario.nombre;
                    chat['email'] = response[i].beneficiario.correo;
                    chat['peerId'] = response[i].beneficiario.peerId;
                }

                chats.push(chat);
            }

            return chats;
        }
    }

})();