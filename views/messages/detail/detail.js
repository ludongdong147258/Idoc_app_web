require('./detail.scss');

angular.module('app.controllers')
    .controller('MessagesCtrl', function($rootScope, $scope, $state,
        $ionicModal, $templateCache, $timeout, $ionicHistory, errorHandler,
        messagesService) {

        // 监听视图进入事件
        $scope.$on('$ionicView.beforeEnter', function() {

        });

        // 订阅视图销毁事件
        $scope.$on('$destroy', function() {

        });

        angular.extend($scope, {

        });

    });
