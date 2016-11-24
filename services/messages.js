/**
 * 消息相关业务
 */
angular.module('app.services')
    .factory('messagesService', function(apiService, localStorageService) {
        // 接口名称
        var INTERFACE_NAME = 'interface/name';


        return {
            /**
             * 名称
             * @param  {Object} param         参数
             * @return {Object} aipService  的 promise对象
             */
            functionName: function(param) {
                return apiService.post(INTERFACE_NAME, {
                    param: param
                });
            },
        };
    });
