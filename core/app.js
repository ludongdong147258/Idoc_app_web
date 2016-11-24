angular.module('ngCordova.plugins', []);
angular.module('app.services', []);
angular.module('app.filters', []);
angular.module('app.directives', []);
angular.module('app.controllers', []);
angular.module('app', [
    'ionic',
    'ngAnimate',
    'ngMessages',
    'xuiSlider',
    'ngCordova.plugins',
    'app.services',
    'app.filters',
    'app.directives',
    'app.controllers'
]);
require('./app-config-global-constant.js');
require('./app-config-global.js');
require('./app-config-global-diff.js');
require('./app-config-api.js');
require('./app-config-url-router-dev.js');
angular.module('app')
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.views.maxCache(3);
        $ionicConfigProvider
            .backButton.text('')
            .icon('ion-ios-arrow-back');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.scrolling.jsScrolling(true);
        if (!AGL.isCordova()) {
            if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS() && !ionic.Platform.isIPad() && !ionic.Platform.isFullScreen) {
                $('body').addClass('platform-web');
            } else {
                $('body').addClass('platform-app');
            }
        }
    });
(function bootstrap() {
    if (window.cordova) {
        document.addEventListener("deviceready", start, false);
    } else {
        $(start);
    }

    function start() {
        angular.bootstrap(document.body, ['app'], {
            strictDi: true
        });
    }
}());
require('./_webpack-icomoon.scss');
require('./_webpack-images.scss');
