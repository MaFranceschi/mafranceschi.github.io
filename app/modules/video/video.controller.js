/**
 * @description: Controlador encargado del proceso de videoconferencia
 */

(function()
{

    'use strict';

    angular.module('911app.controllers.video').controller('VideoCtrl', 
        ['$scope', '$rootScope', '$state', 'VideoService', 'LoggerService', VideoCtrl]);

    function VideoCtrl($scope, $rootScope, $state, VideoService, LoggerService)
    {

        var self = this;


        /**
         * @description: Llama al beneficiario
         */
        self.callBeneficiary = function()
        {
            VideoService.callBeneficiary()
                .then(function ()
                {
                    LoggerService.info('Generar videollamada en proceso...');
                })
                .catch(function()
                {
                    LoggerService.warning('Imposible realizar videollamada');
                });
        }

        /**
        * @description: Cierra la videollamada en proceso
        */
        self.closeBeneficiaryCall = function()
        {
            VideoService.closeBeneficiaryCall()
                .then(function ()
                {
                    LoggerService.info('Videollamada cerrada correctamente');
                })
                .catch(function ()
                {
                    LoggerService.warning('Imposible cerrar videollamada en proceso');
                });
        }


            
    }

})();
