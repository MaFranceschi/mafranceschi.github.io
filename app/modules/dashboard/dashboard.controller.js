/**
 * @description: Controlador encargado de manejar el dashboard del doctor
 */
(function()
{

    'use strict';

    angular.module('911app.controllers.dashboard').controller('DashboardCtrl', 
            ['$state', '$rootScope', 'DatabaseService', 'MessageService', 'DashboardService', DashboardCtrl])

    function DashboardCtrl($state, $rootScope, DatabaseService,MessageService, DashboardService)
    {
        var self = this;

        DatabaseService.getDoctorDataWithoutParams();

        self.getChat = function () 
        {
            $state.go('dashboard.chat-list');
        }
    }

})();