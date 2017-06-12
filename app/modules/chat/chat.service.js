/**
 * @description: Servicio encargado de manejar el proceso de chat
 */
(function()
{
    'use strict';

    angular.module('911app.services.chat').service('ChatService', 
            ['$rootScope', 'ngDialog', 'PeerDataService', 'LoggerService', 'ValidateService', 'PeerFileService', 'MessageService', 'FileService', ChatService]);

    function ChatService($rootScope, ngDialog, PeerDataService, LoggerService, ValidateService, PeerFileService, MessageService, FileService)
    {

        this.send = sendMessage;
        this.transfer = sendFile;


        /**
         * @description: Metodo encargado de enviar los mensajes
         * @param {String} message contenido del mensaje a enviar
         */
        function sendMessage(content)
        {
            LoggerService.debug('Entrando al metodo sendMessage:chat.service');

            if(ValidateService.isValidContent(content))
            {
                let message = PeerDataService.sendMessage(content);
                MessageService.showMessage(message, false);
            }

            LoggerService.debug('Saliendo del metodo sendMessage:chat.service');
        }


        /**
         * @description: Metodo encargado de enviar los archivos adjuntos
         * @param {Blob} file archivo a enviar 
         */
        function sendFile(file)
        {
            LoggerService.debug('Entrando al metodo sendFile:chat.service');

            ngDialog.openConfirm
            ({
                scope: $rootScope,
                template: 'templates/modals/confirm.html',
            })
            .then(function (confirm) 
            {
                if(file && FileService.calculateBytesAttached(file))
                {
                    PeerFileService.sendFile(file);
                }
                else
                {
                    LoggerService.debug( 'Peso total de archivos supera el maximo permitido');
                    MessageService.addMessage('Peso total de archivos supera el maximo permitido (700kb)', true);
                    MessageService.showAlert();
                }


            }, function() 
            {

            });




            LoggerService.debug('Saliendo del metodo sendFile:chat.service');
        }





    }

})();


