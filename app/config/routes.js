'use strict';

angular.module('911app.routes').config( function ($stateProvider, $urlRouterProvider)
{
    // $urlRouterProvider.when('/dashboard', '/dashboard/list');
    $stateProvider
        .state( 'home', {
            url: '/',
            templateUrl: 'templates/login/login.html',
            controller: 'LoginCtrl as ctrl'
        })
        .state( 'dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard/dashboard.html',
            controller: 'DashboardCtrl as ctrl'
        })
        .state( 'dashboard.list', {
            url: '/list',
            templateUrl: 'templates/list/list.html',
            controller: 'ListCtrl as ctrl'
        })
        .state( 'dashboard.chat-list', {
            url: '/chat-list',
            templateUrl: 'templates/chat-list/chat-list.html',
            controller: 'ChatListCtrl as ctrl'
        })
        .state( 'dashboard.chat', {
            url: '/chat',
            templateUrl: 'templates/chat/chat.html',
            controller: 'ChatCtrl as ctrl'
        })
        .state( 'dashboard.video', {
            url: '/video',
            templateUrl: 'templates/video/video.html',
            controller: 'VideoCtrl as ctrl'
        });
        
    $urlRouterProvider.otherwise('/');
});