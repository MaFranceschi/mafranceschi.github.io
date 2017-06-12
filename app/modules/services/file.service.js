/**
 * @description: Servicio encargado del manejo de archivos de la aplicacion
 */
(function()
{

    'use strict';

    angular.module('911app.services.file').service('FileService',
        ['$q', '$rootScope', 'MAX_BYTES', 'LoggerService', 'MessageService', FileService]);

    function FileService($q, $rootScope, MAX_BYTES, LoggerService, MessageService)
    {
        this.calculateBytesAttached = calculateBytesAttached;
        this.convert = convertToDataUri;


        /**
         * @description: Calcula que los archivos no superen el peso maximo establecido
         * @param {File} file archivo por analizar
         */
        function calculateBytesAttached(file)
        {

            LoggerService.debug('Entrando al metodo calculateBytesAttached:file.service');

            let result = false;

            LoggerService.debug( 'Bytes totales: ' + file.size + ' bytes');

            if (!(file.size > MAX_BYTES))
            {
                LoggerService.info('Peso de archivos no supera el maximo permitido');
                result = true;
            }

            LoggerService.debug('Saliendo del metodo calculateBytesAttached:file.service');

            return result;
        }


        /**
         * @description: Convierte en dataUri el archivo registrado
         * @param {File} file referencia del archivo adjunto
         */
        function convertToDataUri(file)
        {
            LoggerService.debug('Entrando al metodo convertToDataUri:file.service');

            var defered = $q.defer();
            var promise = defered.promise;

            var reader = new FileReader();
            var fileData;


            reader.onload = function(e)
            {
                fileData = e.target.result;
                defered.resolve(fileData);
            } 

            reader.onerror = function(e)
            {
                defered.reject();
            }

            reader.readAsDataURL(file);

            return promise;

        }




    }

})();