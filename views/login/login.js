require('./login.scss');

angular.module('app.controllers')
    .controller('LoginCtrl', function($rootScope, $scope, $state,
        $ionicModal, $templateCache, $timeout, $ionicHistory, errorHandler,
        accountService) {

        var INTERVAL = 60; // 发送短信的时间周期，单位 s
        var MOBILE_CODE_SEND_DEFAULT = '获取验证码';
        var MOBILE_CODE_SEND_LOADING = '发送中';
        var MOBILE_CODE_SEND_SUCCESS = '发送成功';

        var SUBMIT_DEFAULT = '登录';
        var SUBMIT_LOADING = '登录中 ...';

        // 监听视图进入事件
        $scope.$on('$ionicView.beforeEnter', function() {

        });

        // 订阅视图销毁事件
        $scope.$on('$destroy', function() {

        });

        angular.extend($scope, {
            sendMessageBtn: {
                text: MOBILE_CODE_SEND_DEFAULT,
                disabled: false,
                counter: 0,
                interval: 120
            },

            // 登录按钮
            submitBtn: {
                disabled: false,
                text: SUBMIT_DEFAULT
            },

            data: {
                loginName: null, // 手机号
                password: null // 验证码
            },

            // 发送手机验证码
            sendMessage: function(type) { // 1001注册 1002登录 1004忘记密码
                $scope.sendMessageBtn.disabled = true;
                $scope.sendMessageBtn.text = MOBILE_CODE_SEND_LOADING;

                // 恢复按钮默认状态
                function unlockBtn() {
                    $scope.sendMessageBtn.disabled = false;
                    $scope.sendMessageBtn.text = MOBILE_CODE_SEND_DEFAULT;
                }
                accountService.sendMessage($scope.data.loginName, type)
                    .success(function(data) {
                        // 赋值
                        $scope.sendMessageBtn.counter = INTERVAL;
                        $scope.sendMessageBtn.text = INTERVAL + ' s';

                        // 倒计时
                        function countdown() {
                            $scope.$apply(function() {
                                $scope.sendMessageBtn.counter -= 1;

                                if ($scope.sendMessageBtn.counter > 0) {
                                    $scope.sendMessageBtn.text = $scope.sendMessageBtn.counter + ' s';

                                    // 启动定时器
                                    $timeout(countdown, 1000);
                                } else {
                                    unlockBtn();
                                    $scope.verificationCount++;
                                }
                            });
                        }

                        // 启动定时器
                        $timeout(countdown, 1000);
                    })
                    .error(errorHandler())
                    .finally(function() {
                        if ($scope.sendMessageBtn.counter === 0) {
                            $scope.sendMessageBtn.disabled = false;
                            $scope.sendMessageBtn.text = MOBILE_CODE_SEND_DEFAULT;
                        }
                    });
            },

            // 登录
            login: function() {
                $scope.submitBtn.text = SUBMIT_LOADING;
                $scope.submitBtn.disabled = true;

                accountService.login($scope.data.loginName, $scope.data.password)
                    .success(function(data) {
                        $state.go('home');
                    })
                    .error(errorHandler())
                    .finally(function() {
                        $scope.submitBtn.disabled = false;
                        $scope.submitBtn.text = SUBMIT_DEFAULT;
                    });
            },

            // 忘记密码
            // --------------------------------------------------------------------------------------
            // forgetUser
            forgetPassword: function(){

            }

        });

        //  忘记密码 Modal
        //  -----------------------------------------------------------------------------------------
        $scope.forgetPasswordModal = $ionicModal.fromTemplate(require('./forget-password.html'), {
            scope: $scope,
            animation: 'slide-in-up' // 'slide-in-right'
        });

        //  注册 Modal
        //  -----------------------------------------------------------------------------------------
        $scope.registerModal = $ionicModal.fromTemplate(require('./register.html'), {
            scope: $scope,
            animation: 'slide-in-up' // 'slide-in-right'
        });

    });
