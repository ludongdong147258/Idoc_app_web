// 开发环境

angular.module('app')

.config(function($stateProvider, $urlRouterProvider) {

    //----------------------------------- views 主功能页面 begin --------------------------------------
    $stateProvider


    // ----------------------------------- 账户 begin --------------------------------------

    // 登录
    .state('login', {
        cache: false,
        url: '/login',
        template: require('../views/login/login.html'),
        controller: 'LoginCtrl'
    })



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');
});
