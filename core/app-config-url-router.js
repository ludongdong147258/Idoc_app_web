// 开发环境
if (__DEV__) {
    require('./app-config-url-router-dev');
}
// 测试环境
if (__TEST__) {
    require('./app-config-url-router-dev');
}
// 生产环境
if (__ONLINE__) {
    require('./app-config-url-router-online');
}
