/**
 *  @description: Controlador encargado del inicio de sesion del doctor
 */
(function()
{

    'use strict';


    angular.module('911app.controllers.login').controller('LoginCtrl', 
            ['$scope', '$rootScope', '$filter', '$state', 'LoginService', 'MessageService','DashboardService', LoginCtrl]);

        function LoginCtrl($scope, $rootScope, $filter, $state, LoginService, MessageService, DashboardService)
        {
            var self = this;
            self.user = {};

            $rootScope.connections = [];

            /**
             * @description: Encargado de ejecutar el proceso de login
             */
            self.login = function()
            {
                LoginService.login(self.user)
                    .then(function ()
                    {
                        $state.go( 'dashboard.list' );
                    })
                    .catch(function ()
                    {
                        MessageService.showAlert();
                        self.user = {};
                    });
            }


            /**
             * @description: Encargado de ejecutar el proceso de logout
             */
            self.logout = function()
            {
                LoginService.logout()
                    .then(function ()
                    {
                        $state.go( 'home' );
                    })
                    .catch(function ()
                    {
                        MessageService.showAlert();
                    });
            }



        }

})();