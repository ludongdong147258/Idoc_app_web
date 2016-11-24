require('./demo.scss');
angular.module('app.controllers')
    .controller('DemoModalCtrl', function($scope, $state,
        $ionicModal,
        loadingService, errorHandler, popupService) {


        // 订阅模态窗打开的事件
        $scope.$on('someNameModal.show', function(modal, data) {

        });

        // 扩展 $scope 属性和方法
        angular.extend($scope, {

            // 可选方法，若关闭弹出窗时需要父作用域给出响应结果，请使用如下方法，否则可以直接在父作用域中使用关闭弹出层的方法
            someNameModalClose: function() {
                $scope.$emit('someNameModal.close');
            }
        });




        // 复制以下代码，保存到打开该模态层的Ctrl中  modal命名规范符合驼峰命名，后缀为Modal
        // ---------------------------------------------------------------------

        // 创建服务项模态窗
        // $scope.someNameModal = $ionicModal.fromTemplate(require(''), {
        //     scope: $scope,
        //     animation: 'slide-in-up' // 'slide-in-right'
        // });

        // someNameModal.close事件
        $scope.$on('someNameModal.close', function(modal, data) {
            $scope.someNameModal.hide();
        });

        // 显示模态窗
        $scope.someNameModalShow = function() {
            $scope.$broadcast('someNameModal.show', $scope.xxxxx);
            $scope.someNameModal.show();
        };

        // 订阅视图销毁事件
        $scope.$on('$destroy', function() {
            $scope.someNameModal.remove();
        });
    });
