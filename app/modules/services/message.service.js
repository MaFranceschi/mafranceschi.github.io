/**
* @description: Servicio encargado de mostrar mensajes en el sistema 
*/

(function()
{

    'use strict';

    angular.module('911app.services.message').service('MessageService', 
            ['$rootScope', 'ngDialog', MessageService]);

    function MessageService($rootScope, ngDialog) 
    {
        this.showAlert = showAlert;
        this.addMessage = addValue;
        this.showMessage = displayMessage;
        this.showFile = displayFile;

        this.addMessageToConnection = addMessageToConnection;
        this.displayAllMessages = displayAllMessages;
        this.getReceivedMessagesUnreaded = getReceivedMessagesUnreaded;


        /**
         * @description: Agrega un mensaje dependiendo del evento ocurrido
         * @param: {message} contenido del mensaje
         * @param: {type} bool indica el tipo del mensaje, true es error, false es exito
         */
        function addValue(message, type) 
        {
            $rootScope.message = 
            {
                value: message,
                error: type
            }
        }


        /**
         * @description: muestra en pantalla el mensaje almacenado mediante un popup
         */
        function showAlert() 
        {
            ngDialog.open({
                templateUrl: 'templates/modals/info.html'
            });
        }


        /**
         * @description: Muestra el mensaje recibido por el beneficiario
         * @param {String} message contenido del mensaje
         * @param {Boolean} receiveMessage indica si el mensaje es recibido (true) o no (false)
         */
        function displayMessage(message, receiveMessage) 
        {
            var messages = $('#messagesContainer');

            if (messages) 
            {
                var messageBubble = document.createElement('message');
                messageBubble.className = 'row';
                messageBubble.dataset.when = message.when;
                messageBubble.setAttribute('sentBy',message.sentBy);
                messageBubble.setAttribute('type', message.type);

                var paragraph = document.createElement('p');
                paragraph.className = (receiveMessage)? 'chat-bubble chat-left-bubble pull-left' : 'chat-bubble chat-right-bubble pull-right';
                paragraph.innerText = message.content;

                messageBubble.appendChild(paragraph);

                messages.append(messageBubble);
            }

        }


        /**
         * @description: Se encarga de mostrar el archivo recibido dependiendo del tipo de dato enviado
         * @param {DataUri} dataUri datos del archivo recibido
         */
        function displayFile(file, receiveFile)
        {
            //Obtiene el tipo de dato
            var mimeType = file.content.split(':')[1].split(';')[0];

            switch(mimeType)
            {
                case "application/pdf":
                    file.mimeType = 'application/pdf';
                    file.fileExtension = '.pdf';
                    showPdf(file, receiveFile);
                break;
                case "image/jpeg":
                    file.mimeType = 'image/jpeg';
                    file.fileExtension = '.jpeg';
                    showImage(file, receiveFile);
                break;
                case "image/png":
                    file.mimeType = 'image/png';
                    file.fileExtension = '.png';
                    showImage(file, receiveFile);
                break;
            }


        }


        /**
         * @private
         * @description: Muestra en pantalla un enlace una imagen
         * @param {Image} image imagen recibida por el medico
         * @param {Boolean} receiveImage indica si el archivo es recibido (true) o no (false)
         */
        function showImage(imageFile, receiveImage)
        {
            var messages = $('#messagesContainer');

            if(messages)
            {
                var imageContainer = document.createElement('figure');
                imageContainer.className = (receiveImage)? 'image-container pull-left' : 'image-container pull-right';

                var image = document.createElement('img');
                image.src = imageFile.content;
                image.className = 'image-thumbnail';

                imageContainer.appendChild(image);

                imageContainer.addEventListener('click', function()
                {
                    window.open(imageFile.content);
                });

                messages.append(imageContainer);
            }
        }



        /**
         * @private
         * @description: Muestra en pantalla un enlace para abrir el archivo pdf
         * @param {PDF} pdf archivo pdf recibido por el medico
         * @param {Boolean} receivePdf indica si el archivo es recibido (true) o no (false)
         */
        function showPdf(pdfFile, receivePdf)
        {
            var messages = $('#messagesContainer');

            if(messages)
            {
                var pdfContainer = document.createElement('figure');
                pdfContainer.className = (receivePdf)? 'image-container pull-left' : 'image-container pull-right';


                var image = document.createElement('img');
                image.src = '../../content/images/pdfLogo.png';
                image.className = 'image-thumbnail';

                var pdfDescription = document.createElement('figcaption');
                pdfDescription.innerText = 'Abrir PDF';


                pdfContainer.appendChild(image);
                pdfContainer.appendChild(pdfDescription);

                pdfContainer.addEventListener('click', function ()
                {
                    window.open(pdfFile.content);
                });

                messages.append(pdfContainer);
            }
        }





        /**
         * @description: Muestra el historial de la conversacion el beneficiario
         * @param {String} beneficiary nombre del beneficiario
         */
        function displayAllMessages(beneficiary) 
        {
            for (var i = 0; i< Object.keys($rootScope.connections).length; i++)
            {
                if($rootScope.connections[Object.keys($rootScope.connections)[i]].dataConnection.metadata.username == beneficiary)
                {
                    for (var j = 0; j<$rootScope.connections[Object.keys($rootScope.connections)[i]].messages.length; j++)
                    {
                        if ($rootScope.connections[Object.keys($rootScope.connections)[i]].messages[j].sentBy == beneficiary)
                        {
                            displayMessage($rootScope.connections[Object.keys($rootScope.connections)[i]].messages[j], true);
                        }
                        else
                        {
                            displayMessage($rootScope.connections[Object.keys($rootScope.connections)[i]].messages[j], false);
                        }
                    }

                    $rootScope.connections[Object.keys($rootScope.connections)[i]].receiveMessages = 0;
                }
            }
        }


        /**
         * @description: Agrega el mensaje a la conexion para su posterior consulta
         * @param {Message} message objeto mensaje para guardar 
         * @param {Boolean} isFromBEneficiary indica si el mensaje proviene del beneficiario (true) o no (false)
         */
        function addMessageToConnection(message, isFromBEneficiary) 
        {
            for (var i = 0; i< Object.keys($rootScope.connections).length; i++)
            {
                if($rootScope.connections[Object.keys($rootScope.connections)[i]].dataConnection.metadata.username == message.sentBy)
                {
                    var sentBy = $rootScope.mpps;

                    if (isFromBEneficiary) 
                    {
                        sentBy = message.sentBy;
                    }

                    if (message.type == 'text')
                    {
                        $rootScope.connections[Object.keys($rootScope.connections)[i]].addMessage(message)
                    }
                    else
                    {
                        $rootScope.connections[Object.keys($rootScope.connections)[i]].addFile(message)
                    }

                    $rootScope.connections[Object.keys($rootScope.connections)[i]].receiveMessages++;
                }
            }
        }


        /**
         * @description: Muestra la cantidad de mensajes sin leer
         * @param {String} beneficiary nombre del beneficiario
         */
        function getReceivedMessagesUnreaded(beneficiary) 
        {
            for (var i = 0; i< Object.keys($rootScope.connections).length; i++)
            {
                if($rootScope.connections[Object.keys($rootScope.connections)[i]].dataConnection.metadata.username == beneficiary)
                {
                    return $rootScope.connections[Object.keys($rootScope.connections)[i]].receiveMessages;
                }
            }
        }

    }

})();
