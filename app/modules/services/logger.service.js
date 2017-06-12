/**
* @description: Servicio encargado del manejo de logs de la aplicacion
*/


    'use strict';

    angular.module('911app.services.logger').service('LoggerService', 
            ['GNOAPI', LoggerService]);

    function LoggerService(GNOAPI)
    {
        var isDebug = (GNOAPI.ENV === 'development' || GNOAPI.ENV === 'localhost')? true : false;

        this.debug = debug;
        this.error = error;
        this.warning = warning;
        this.info = info;


        function error( message )
        {
            if ( isDebug )
            {
                console.error( '\t \t \t' + message );
            }
        }

        function warning( message )
        {
            if ( isDebug )
            {
                console.warn( '\t \t \t' + message );
            }
        }

        function info( message )
        {
            if ( isDebug )
            {
                console.info( '\t' + message );
            }
        }

        function debug( message )
        {
            if ( isDebug )
            {
                console.debug( '< ' + message + ' />');
            }
        }



    }

