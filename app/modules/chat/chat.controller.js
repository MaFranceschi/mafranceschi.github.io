/**
 * @description: Controlador encargado de manejar el proceso de chat
 */
(function()
{

    'use strict';

    angular.module('911app.controllers.chat').controller('ChatCtrl', 
            ['$rootScope', 'ngDialog', 'LoggerService','ChatService', 'FileService', 'MessageService', ChatCtrl]);


    function ChatCtrl($rootScope, ngDialog, LoggerService, ChatService, FileService, MessageService)
    {

        var self = this;
        self.text = "";

        document.getElementById("uploadBtn").onchange = function () 
        {
            $rootScope.fileAttached = document.getElementById("uploadBtn").files[0];
            attachFile();
        };

        MessageService.displayAllMessages($rootScope.actualChat.beneficiary);

        self.sendMessage = function(content)
        {
            ChatService.send(content);
            self.text = null;
        }


        function attachFile() 
        {
            var file = $rootScope.fileAttached;
            LoggerService.debug('Archivos seleccionados ------------');

            LoggerService.debug(file.name);

            LoggerService.debug('-----------------------------------');

            ChatService.transfer(file);
        }

    }

})();


