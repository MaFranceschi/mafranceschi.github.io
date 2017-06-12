
(function()
{

    'use strict';

    angular.module('911app.services.validate').service('ValidateService', 
            ['$rootScope', '$filter', 'MessageService', 'LoggerService', ValidateService]);

    function ValidateService($rootScope, $filter, MessageService, LoggerService)
    {
        this.login = validateLogin;
        this.encrypt = encrypt;
        this.isValidContent = validateContentMessage;


        /**
        * @description: Encripta el password suministrado por el usuario utilizando SHA1
        * @param: {password} acepta caracteres alfanumericos
        * @return: password encriptado en formato string
        */
        function encrypt( value )
        {
            LoggerService.debug('Encriptando : ' + value);
            var bytes = CryptoJS.SHA1( value );

            var hashedValue = bytes.toString();
            LoggerService.debug( 'Hash obtenido: ' + hashedValue );
            return hashedValue;
        }
 


        function validateLogin( user )
        {
            var result = false;

            if( requiredAttributes(user.username, user.password)
            &&  isValidUser(user.username)
            && isValidPassword(user.password))
            {
                result = true;
            }

            return result;
        }

        function isValidEmail( email )
        {
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = new RegExp( pattern );
        var m = re.exec( email );
        var result = false;

        if ( m == null )
        {
            MessageService.addMessage( $filter('translate')('messageserror-invalidemail'), true);
        }
        else
        {
            result = true;
        }

        return result;
        }

        function isValidUser( username )
        {
            var pattern = /^[a-z0-9]{3,15}$/;
            var re = new RegExp( pattern );
            var m = re.exec( username );
            var result = false;

            if ( m == null )
            {
                MessageService.addMessage($filter('translate')('messageserror-invaliduser'), true);
            }
            else
            {
                result = true;
            }

            return result;
        }

        function isValidPassword( password )
        {
        var pattern = /^[a-zA-Z0-9_.*-]{6,30}$/;
        var re = new RegExp( pattern );
        var m = re.exec( password );
        var result = false;

        if ( m == null )
        {
            MessageService.addMessage($filter('translate')('messageserror-invalidpassword'), true);
        }
        else
        {
            result = true;
        }

        return result;
        }

        function isValidText( text )
        {
            var pattern = /^[a-zA-Z ]{3,15}$/;
            var re = new RegExp( pattern );
            var m = re.exec( text );
            var result = false;

            if( m == null )
            {
                MessageService.addMessage($filter('translate')('messageserror-invalidtext'), true);
            }
            else
            {
                result = true;
            }

            return result;
        }

        function isValidNumber( number )
        {
            var result = false;

            if( isNaN( number ) )
            {
                MessageService.addMessage($filter('translate')('messageserror-invalidtext'), true);
            }
            else
            {
                result = true;
            }

            return result;
        }

        function requiredAttributes()
        {
            var result = true;

            for(var i = 0; i < arguments.length; i++)
            {
                if(arguments[i] === undefined || arguments[i] === null)
                    result = false;
            }

            if(!result)
                MessageService.addMessage($filter('translate')('messageserror-requiredvalue'), true);

            return result;
        }


        /**
         * @description: Encargado de validar el contenido del mensaje
         * @param {String} message 
         */
        function validateContentMessage(message)
        {
           LoggerService.debug( 'Entrando al metodo validateContentMessage:validate.service' );

            var pattern = /^[a-zA-Z0-9áéíóúñÑÁÉÍÓÚ?¿!¡,.; ]{1,300}$/;
            var re = new RegExp( pattern );
            var m = re.exec( message );
            var result = false;

            if( m == null )
            {
                MessageService.addMessage($filter('translate')('messageserror-invalidmessage'), true);
                LoggerService.warning('Contenido de mensaje no apto para ser enviado');
            }
            else
            {
                result = true;
                LoggerService.info('Contenido de mensaje valido para ser enviado');
            }

            LoggerService.debug( 'Entrando al metodo validateContentMessage:validate.service con resultado: ' + result );

            return result;
        }

    }

})();