(function()
{
    'use strict';

    angular.module('911app.directives.message').directive('message', [MessageDirective]);

    function MessageDirective()
    {
        var directive = 
        {
            restrict: 'E',
            scope: 
            {
                messageDate: '=when',
                messageBy: '=sentBy',
                messageType: '=type'
            },
            template: '<div class="row"></div>'
        };

        return directive;
    };

})();
