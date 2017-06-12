/**
 * @description: Controlador encargado de listar los chats abiertos con un medico
 *
 */
(function(){

    'use strict';

    angular.module('911app.controllers.chat').controller('ChatListCtrl', ['$rootScope', '$state', 'ChatListService', 'MessageService', ChatListCtrl]);

    function ChatListCtrl($rootScope, $state, ChatListService, MessageService)
    {
        var self = this;
        self.chats = [];
        $rootScope.actualChat = {};

        self.isFrom = true;


        /**
         * @description: Carga los chats abiertos para ser listados
         */
        self.getOpenChats = function()
        {
            ChatListService.getActiveChats()
                .then(function (success) 
                {
                    for (var i = 0; i<success.length; i++)
                    {
                        success[i]['messagesUnreaded'] = MessageService.getReceivedMessagesUnreaded(success[i].email);
                    }
                    self.chats = success;
                })
                .catch(function()
                {

                });
        }


        /**
         * @description: Cierra uno de los chats seleccionado
         */
        self.closeChat = function()
        {
            ChatListService.close()
                .then(function()
                {
                    self.getOpenChats();
                })
                .catch(function()
                {

                });
        }


        /**
         * @description: Redirecciona a un chat en especifico
         * @param {String} peerId identificador
         * @param {String} email correo del beneficiario
         * @param {String} name nombre del beneficiario
         */
        self.goToChat = function (peerId, email, name) 
        {
            $rootScope.actualChat['doctor'] = $rootScope.mpps;
            $rootScope.actualChat['beneficiary'] = email;
            $rootScope.actualChat['nameToShow'] = name;
            $rootScope.userPeerId = peerId;

            $state.go('dashboard.chat');
        }
    }

})();