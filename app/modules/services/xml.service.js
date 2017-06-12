/**
 * Created by TRASCEND on 14/03/2017.
 * @description: Servicio para manejar el registro de los chats en xml
 */

(function(){

    'use strict';

    angular.module('911app.services.xml').service('XMLService', ['$q', '$rootScope', '$cordovaFile', 'LoggerService', XMLService]);

    function XMLService($q, $rootScope, LoggerService)
    {
        this.getXmlChat = getXmlChat;
        this.addMessageToChatInXml = addMessageToChatInXml;
        this.createXmlDocument = createXmlDocument;
        this.getChatMessages = getChatMessages;

        /**
         * @description: Metodo que devuelve el xml como blob para ser leido por un FileReader
         * @param chatAsDataUrl
         * @returns {Function}
         */
        function getXmlChat(chatAsDataUrl) 
        {
            LoggerService.debug("Leyendo xml de chat");

            var defered = $q.defer();
            var promise = defered.promise;

            var byteString = atob(chatAsDataUrl.split(',')[1]);
            var mimeString = chatAsDataUrl.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) 
            {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var blob = new Blob([ab], {type: mimeString});
            defered.resolve(blob);

            return promise;
        }



        function getChatMessages(chatAsDataUrl) 
        {
            LoggerService.debug("Obteniendo json de mensajes de chat");

            var defered = $q.defer();
            var promise = defered.promise;

            getXmlChat( chatAsDataUrl )
                .then(function (success) 
                {

                    //transformo el blob a string con filereader
                    var chatAsString = blobToString(success);

                    var chat = $.parseXML( chatAsString );

                    //obtengo los mensajes
                    var messages = chat.getElementsByTagName("message");

                    var jsonObject = [];

                    for (var i = 0; i<messages.length; i++)
                    {
                        var message = {};

                        message['content'] = $(messages[i]).attr('content');
                        message['sentby'] = $(messages[i]).attr('sentby');
                        message['when'] = $(messages[i]).attr('when');

                        jsonObject.push(message);
                    }

                    defered.resolve(jsonObject);

                },function (error) {

                    defered.reject(error);

                });
            return promise;
        }

        function blobToString(blob) 
        {

        }
    }

})();
