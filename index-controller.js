angular.module('app.controllers')
    .controller('IndexCtrl', function($rootScope, $scope, $ionicHistory, $ionicModal) {
            console.log('sdssd');

        var self = this;
        angular.extend(self, {

            goBack: function() {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false
                });
                $scope.$ionicGoBack();
            }
        });

        $rootScope.$on('$ionicView.beforeEnter', function () {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').removeClass('active').addClass('hide');
        });
    });
