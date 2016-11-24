// api请求常规配置项
angular.module('app')
    .config(function($httpProvider, apiServiceProvider, localStorageServiceProvider) {

        // 初始化全局信息
        AGL.appInfo.os = ionic.Platform.platform();
        AGL.appInfo.osVersion = ionic.Platform.version();
        AGL.appInfo.uuid = window.device ? window.device.uuid : AGL.getGuid();
        AGL.user = localStorageServiceProvider.get(AGL.KEY_USER) || AGL.user;
        AGL.config = localStorageServiceProvider.get(AGL.KEY_CONFIG) || AGL.config;

        // 注入服务请求根地址
        apiServiceProvider.serviceAddress = AGL.appConfig.service;

        // 设置异步post请求header的Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ?
                apiServiceProvider.serializeParams(data) : data; // 序列化对象参数
        }];

        // 更加健壮的响应数据转换器，当响应数据为 json 字符串时，
        // 将按照 json 格式进行解析，否则直接当作字符串返回。
        var defaultJsonTransformResponse = $httpProvider.defaults.transformResponse[0];
        $httpProvider.defaults.transformResponse = [function(data, headers) {
            try {
                return defaultJsonTransformResponse(data, headers);
            } catch (e) {
                return data;
            }
        }];
    });
