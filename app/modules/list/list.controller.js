/**
 * @description: Controlador encargado de manejar el proceso de sala de espera
 */
(function(){


    'use strict';


    angular.module('911app.controllers.list').controller('ListCtrl', 
            ['$rootScope', '$state', 'ngDialog', 'ListService', 'LoggerService', ListCtrl]);

    function ListCtrl($rootScope, $state, ngDialog, ListService, LoggerService )
    {
        var self = this;


        /**
         * @description: Obtiene la emergencia mas antigua al cargar la pagina
         */
        self.init = function()
        {
            LoggerService.debug('Obteniendo emergencia desde controlador');
            ListService.getEmergencies()
                .then(function()
                {

                })
                .catch(function()
                {

                });
        }

        /**
         * @description: Encargado de atender la emergencia y generar una llamada
         */
        self.confirmCall = function()
        {
            ngDialog.openConfirm({
                        scope: $rootScope,
                        template: 'templates/modals/confirm.html',
                    }).then(function (confirm) 
                    {
                        LoggerService.debug('Devolviendo llamada a paciente');
                        $state.go("dashboard.video");
                        ListService.respondEmergency();
                    }, function() 
                    {
                        LoggerService.warning('Cancelada accion de devolver llamada');
                    });
        }

        self.showChat = function(index)
        {

            $rootScope.indexChat = index;
            $state.go("dashboard.chat");
        }
    }

})();