function () {
    'use strict';

    angular.module('CollabAll', [
        'ui.router',

        'CollabAllRoutes',
        'AuthModule',

        'LoginControllerModule',
        'InsideControllerModule',
        'HomeControllerModule',
        'UserCreateControllerModule',
        'GroupManageControllerModule',
        'GroupMyControllerModule',
        'GroupCardsControllerModule',
        'CardManageControllerModule',
        'GroupChatControllerModule',
        'MyProfileControllerModule',
        'MyPasswordControllerModule',
        'GroupInterjectionsControllerModule',
        'InterjectionManageControllerModule'
    ]);
}());
