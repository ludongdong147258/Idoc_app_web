angular.module("app.services").provider("apiService",function(){var r=this;r.serviceAddress="",r.serviceAddressSuffix="",r.serializeParams=function(r){var t,e,n="";for(t in r)e=r[t],e instanceof Object?e=encodeURIComponent(JSON.stringify(e)):void 0!==e&&null!==e||(e=""),n+=encodeURIComponent(t)+"="+e+"&";return n.length?n.substr(0,n.length-1):n},r.getErrorInfo=function(r){r=r||{};var t={_isErrorInfo:!0,_response:r,isAbortError:!1,isHttpError:!1,httpStatus:void 0,errorCode:void 0,errorText:void 0,errorData:void 0};r.$aborted?t.isAbortError=!0:(r.status<200||r.status>=300)&&(t.isHttpError=!0),t.httpStatus=r.status;try{t.errorCode=r.data.code}catch(e){}try{t.errorText=r.data.msg}catch(e){}try{t.errorData=r.data.data}catch(e){}return t},r.extendPromise=function(t,e){return t._then=t.then,t.then=function(){var t=this._then.apply(this,arguments);return r.extendPromise(t,e),t},t.success=function(r){return this.then(function(t){return r(t.data,t.status,t.headers,t.config),t})},t.error=function(r){return this.then(null,function(t){throw r(t),t})},t.abort=function(r){return!!e&&(e.reject({$aborted:r||!0}),!0)},t},r.$get=["$http","$q",function(t,e){var n=function(e){var n=a.defer();return e.url=r.serviceAddress+e.url+r.serviceAddressSuffix,t(e).then(function(t){t.config=e,void 0===t.data||t.data&&t.data.code===AGL.STATE_CODE_SUCCESS?(t._data=t.data,t.data=t._data||{},n.resolve(t)):n.reject(r.getErrorInfo(t))},function(t){t.config=e,n.reject(r.getErrorInfo(t))}),n.promise},o=function(t,e){var n,o;return t&&t._isErrorInfo===!0?o=t:n=t&&"object"==typeof t?t:{data:{code:t,msg:e},status:200},o=o||r.getErrorInfo(n)},a={extendPromise:r.extendPromise,get:function(t,e,o){return e&&(t+="?"+r.serializeParams(e)),n(angular.extend(o||{},{method:"get",url:t,data:e}))},post:function(r,t,e){return n(angular.extend(e||{},{method:"post",url:r,data:{data:t||{},doctorToken:AGL.user.doctorToken||"",signature:"",platform:2}}))},reject:function(r,t){var n=o(r,t);return this.extendPromise(e.reject(n))},when:function(r){return this.extendPromise(e.when({data:r}))},defer:function(){var r=e.defer();return r.promise=this.extendPromise(r.promise,r),r._resolve=r.resolve,r._reject=r.reject,r.resolve=function(r){return r=r||{data:{},status:200},this._resolve(r)},r.reject=function(r,t){var e=o(r,t);return this._reject(e)},r},all:function(r){var t=e.all(r);return this.extendPromise(t)}};return a}]});
angular.module('app.services')
    .factory('errorHandler', function($rootScope, $state, $ionicHistory,
        $ionicModal, $templateCache, $timeout,
        popupService, localStorageService) {
        var _defaultErrorHandler = {
            abort: function(errorInfo) {
                popupService.open(AGL.MESSAGE_ABORT_REQUEST);
            },

            network: function(errorInfo) {
                popupService.open(AGL.MESSAGE_NETWORK_ANOMALY);
            },

            http: function(errorInfo) {
                popupService.open(AGL.MESSAGE_SERVICE_EXCEPTION);
            },

            noLogin: function(errorInfo, $scope) {
                angular.extend(AGL.user, {
                    doctorToken: ''
                });

                localStorageService.put(AGL.KEY_USER, AGL.user, {
                    path: '/',
                    expires: 7
                });

                $state.go('login');
                return;
            },

            other: function(errorInfo) {
                errorInfo.errorData = errorInfo._response ? errorInfo._response.data : AGL.MESSAGE_UNKNOW_EXCEPTION;
                errorInfo.errorText = errorInfo._response ? errorInfo._response.data.msg : AGL.MESSAGE_UNKNOW_EXCEPTION;
                popupService.open(errorInfo.errorText);
            }
        };
        function _errorResponse(errorInfo, errorHandler, $scope) {

            if (errorInfo.isAbortError) {
                return errorHandler.abort(errorInfo);
            } else if (errorInfo.isHttpError) {
                if (errorInfo.httpStatus === 0) {
                    return errorHandler.network(errorInfo);
                } else {
                    return errorHandler.http(errorInfo);
                }
            } else if (errorInfo.errorCode === AGL.STATE_CODE_NO_LOGIN) {
                return errorHandler.noLogin(errorInfo, $scope);
            } else {
                return errorHandler.other(errorInfo);
            }
        }

        return function(errorHandlerExtension, $scope) {
            errorHandler = angular.extend({}, _defaultErrorHandler, errorHandlerExtension);

            return function(errorInfo) {
                _errorResponse(errorInfo, errorHandler, $scope);
            };
        };
    });
angular.module("app.services").factory("loadingService",function(n,e){return{show:function(){n.show({duration:3e4})},hide:function(){n.hide()}}});
angular.module("app.services").provider("localStorageService",function(){var o=this;o.get=function(o){var t=window.localStorage[o];return t?JSON.parse(t):void 0},o.$get=["$window",function(o){return{isSupport:function(){try{return"localStorage"in window&&null!==window.localStorage}catch(o){return!1}},calcSize:function(){var t,r,e,i;e="";for(t in o.localStorage)o.localStorage.hasOwnProperty(t)&&t.indexOf("data-")>-1&&(r=o.localStorage[t],e+=r);return i=8*e.length/1048576,i.toFixed(2)},clear:function(){for(var t in o.localStorage)o.localStorage.hasOwnProperty(t)&&t.indexOf("data-")>-1&&this.remove(t)},has:function(t){return!!o.localStorage[t]},put:function(t,r,e){this.isSupport()&&(void 0===r?this.remove(t):(r="object"==typeof r?JSON.stringify(r):r,o.localStorage[t]=r)),e&&this.cookie.put(t,r,e)},get:function(t){var r;if(this.isSupport()&&(r=o.localStorage[t]),!r)return this.cookie.get(t);var e;try{e=JSON.parse(r)}catch(i){e=r}finally{return e?e:void 0}},remove:function(t,r){this.isSupport()&&delete o.localStorage[t],this.cookie.remove(t,r)},cookie:{isSupport:function(){return!(!window.navigator||!window.navigator.cookieEnabled)},put:function(o,t,r){this.isSupport()&&$.cookie(o,t,r)},get:function(o){if(this.isSupport()){var t=$.cookie(o);return t?JSON.parse(t):void 0}},remove:function(o,t){if(this.isSupport())return $.removeCookie(o,t)}}}}]});
angular.module("app.services").factory("makePhoneCallService",function(o,n){var i=ionic.Platform.isIOS(),a=ionic.Platform.isAndroid();return{callSomeone:function(o){(i&&window.cordova&&window.cordova.plugins||a)&&n.confirm("您确定要呼叫<a>"+o+"</a>吗？").then(function(n){n?a?document.location.href="tel:+"+o:i&&window.cordova&&window.cordova.plugins.PhoneDialer.dial(o):this.close()})}}});
angular.module("app.services").factory("md5Service",function(){function r(r){return h(n(i(r),r.length*l))}function n(r,n){r[n>>5]|=128<<n%32,r[(n+64>>>9<<4)+14]=n;for(var t=1732584193,a=-271733879,i=-1732584194,h=271733878,v=0;v<r.length;v+=16){var l=t,A=a,d=i,g=h;t=u(t,a,i,h,r[v+0],7,-680876936),h=u(h,t,a,i,r[v+1],12,-389564586),i=u(i,h,t,a,r[v+2],17,606105819),a=u(a,i,h,t,r[v+3],22,-1044525330),t=u(t,a,i,h,r[v+4],7,-176418897),h=u(h,t,a,i,r[v+5],12,1200080426),i=u(i,h,t,a,r[v+6],17,-1473231341),a=u(a,i,h,t,r[v+7],22,-45705983),t=u(t,a,i,h,r[v+8],7,1770035416),h=u(h,t,a,i,r[v+9],12,-1958414417),i=u(i,h,t,a,r[v+10],17,-42063),a=u(a,i,h,t,r[v+11],22,-1990404162),t=u(t,a,i,h,r[v+12],7,1804603682),h=u(h,t,a,i,r[v+13],12,-40341101),i=u(i,h,t,a,r[v+14],17,-1502002290),a=u(a,i,h,t,r[v+15],22,1236535329),t=e(t,a,i,h,r[v+1],5,-165796510),h=e(h,t,a,i,r[v+6],9,-1069501632),i=e(i,h,t,a,r[v+11],14,643717713),a=e(a,i,h,t,r[v+0],20,-373897302),t=e(t,a,i,h,r[v+5],5,-701558691),h=e(h,t,a,i,r[v+10],9,38016083),i=e(i,h,t,a,r[v+15],14,-660478335),a=e(a,i,h,t,r[v+4],20,-405537848),t=e(t,a,i,h,r[v+9],5,568446438),h=e(h,t,a,i,r[v+14],9,-1019803690),i=e(i,h,t,a,r[v+3],14,-187363961),a=e(a,i,h,t,r[v+8],20,1163531501),t=e(t,a,i,h,r[v+13],5,-1444681467),h=e(h,t,a,i,r[v+2],9,-51403784),i=e(i,h,t,a,r[v+7],14,1735328473),a=e(a,i,h,t,r[v+12],20,-1926607734),t=c(t,a,i,h,r[v+5],4,-378558),h=c(h,t,a,i,r[v+8],11,-2022574463),i=c(i,h,t,a,r[v+11],16,1839030562),a=c(a,i,h,t,r[v+14],23,-35309556),t=c(t,a,i,h,r[v+1],4,-1530992060),h=c(h,t,a,i,r[v+4],11,1272893353),i=c(i,h,t,a,r[v+7],16,-155497632),a=c(a,i,h,t,r[v+10],23,-1094730640),t=c(t,a,i,h,r[v+13],4,681279174),h=c(h,t,a,i,r[v+0],11,-358537222),i=c(i,h,t,a,r[v+3],16,-722521979),a=c(a,i,h,t,r[v+6],23,76029189),t=c(t,a,i,h,r[v+9],4,-640364487),h=c(h,t,a,i,r[v+12],11,-421815835),i=c(i,h,t,a,r[v+15],16,530742520),a=c(a,i,h,t,r[v+2],23,-995338651),t=o(t,a,i,h,r[v+0],6,-198630844),h=o(h,t,a,i,r[v+7],10,1126891415),i=o(i,h,t,a,r[v+14],15,-1416354905),a=o(a,i,h,t,r[v+5],21,-57434055),t=o(t,a,i,h,r[v+12],6,1700485571),h=o(h,t,a,i,r[v+3],10,-1894986606),i=o(i,h,t,a,r[v+10],15,-1051523),a=o(a,i,h,t,r[v+1],21,-2054922799),t=o(t,a,i,h,r[v+8],6,1873313359),h=o(h,t,a,i,r[v+15],10,-30611744),i=o(i,h,t,a,r[v+6],15,-1560198380),a=o(a,i,h,t,r[v+13],21,1309151649),t=o(t,a,i,h,r[v+4],6,-145523070),h=o(h,t,a,i,r[v+11],10,-1120210379),i=o(i,h,t,a,r[v+2],15,718787259),a=o(a,i,h,t,r[v+9],21,-343485551),t=f(t,l),a=f(a,A),i=f(i,d),h=f(h,g)}return Array(t,a,i,h)}function t(r,n,t,u,e,c){return f(a(f(f(n,r),f(u,c)),e),t)}function u(r,n,u,e,c,o,f){return t(n&u|~n&e,r,n,c,o,f)}function e(r,n,u,e,c,o,f){return t(n&e|u&~e,r,n,c,o,f)}function c(r,n,u,e,c,o,f){return t(n^u^e,r,n,c,o,f)}function o(r,n,u,e,c,o,f){return t(u^(n|~e),r,n,c,o,f)}function f(r,n){var t=(65535&r)+(65535&n),u=(r>>16)+(n>>16)+(t>>16);return u<<16|65535&t}function a(r,n){return r<<n|r>>>32-n}function i(r){for(var n=Array(),t=(1<<l)-1,u=0;u<r.length*l;u+=l)n[u>>5]|=(r.charCodeAt(u/l)&t)<<u%32;return n}function h(r){for(var n=v?"0123456789ABCDEF":"0123456789abcdef",t="",u=0;u<4*r.length;u++)t+=n.charAt(r[u>>2]>>u%4*8+4&15)+n.charAt(r[u>>2]>>u%4*8&15);return t}var v=0,l=8;return{hex_md5:r}});
angular.module('app.services')
    .factory('popupService', function($ionicPopup, $timeout) {
        var DELAY_HIDE = 2200;

        return {
            open: function(message, iconClassName) {

                var template;
                if (arguments.length === 2) {
                    template = '<i class="' + iconClassName + '"></i><p>' + message + '</p>';
                } else {
                    template = '<p>' + message + '</p>';
                }

                var myPopup = $ionicPopup.show({
                    template: template
                });

                $timeout(function() {
                        myPopup.close();
                    }, DELAY_HIDE)
                    .then(function() {
                        $('.popup-container').remove();
                    });

                return myPopup;
            },

            confirm: function(message, iconClassName,okText,cancelText) {
                var template;
                if (arguments.length === 2) {
                    template = '<i class="' + iconClassName + '"></i><p>' + message + '</p>';
                } else {
                    template = '<p>' + message + '</p>';
                }
                return $ionicPopup.confirm({
                    template: template,
                    okText: (okText ? okText:'确认'),
                    okType: 'button-default',
                    cancelText: (cancelText ? cancelText:'取消'),
                    cancelType: 'button-line'
                });
            },

            alert: function(message, iconClassName) {
                var template;
                if (arguments.length === 2) {
                    template = '<i class="' + iconClassName + '"></i><p>' + message + '</p>';
                } else {
                    template = '<p>' + message + '</p>';
                }
                return $ionicPopup.alert({
                    template: template,
                    okText: '确认',
                    okType: 'button-default'
                });
            },

            openWithClose: function(templates) {
                var template = '<i ng-click="$buttonTapped({}, $event)" class="icon-popup-close"></i>' + templates;

                var myPopup = $ionicPopup.show({
                    template: template
                });
                return myPopup;
            },

            openWithInput: function(templates) {

                var template = '<input class="" id="j-popueInput" type="text" value="' + templates + '" /><i class="input-line"></i>';

                return $ionicPopup.confirm({
                    template: template,
                    okText: '确认',
                    okType: 'button-default',
                    cancelText: '取消',
                    cancelType: 'button-line'
                });
            },

            show: $ionicPopup.show
        };
    });
angular.module("app.services").service("tabsSliderMixin",function(e){return{tabSlideIndex:0,tabHasChanged:function(i,n){e.$getByHandle(n).select(i)},slideHasChanged:function(e,i){this.tabSlideIndex=e;var n=$('ion-view[nav-view="active"]'),a=window.innerHeight;n.find("ion-slide").eq(e).find(".lazyload").find("img").each(function(e,i){var n=$(i);n.offset().top<=a&&n.trigger("appear")})}}});
/**
 * 账户相关业务
 */
angular.module('app.services')
    .factory('accountService', function(apiService, md5Service, localStorageService) {

        var SEND_MESSAGE = 'phoneCode/send';
        var LOGIN = 'doctor/login';

        function storageUser(user) {
            AGL.user = angular.extend(AGL.user, user);

            localStorageService.put(AGL.KEY_USER, AGL.user, {
                path: '/',
                expires: 7
            });
        }
        function cleanUser() {
            angular.extend(AGL.user, {
                doctorToken: 0
            });

            localStorageService.put(AGL.KEY_USER, AGL.user, {
                path: '/',
                expires: 7
            });
        }

        return {
            sendMessage: function(phone, type) {
                return apiService.post(SEND_MESSAGE, {
                    phone: phone,
                    type: type
                });
            },
            login: function(phone, password) {
                return apiService.post(LOGIN, {
                        phone: phone,
                        password: md5Service.hex_md5(password)
                    })
                    .success(function(data) {
                        var serverData = data.doctorInfo;

                        storageUser({
                            // 用户名，用于会员中心展示
                            doctorToken: serverData.doctorToken
                        });
                    });
            }
        };

    });
