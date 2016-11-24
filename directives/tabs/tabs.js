/**
 * 标签页指令
 *
 * <xui-tabs active-tab-index="1"></xui-tabs>
 *
 */
require('./tabs.scss');

angular.module('app.directives')
    .constant('tabs', [{
        state: '#/home',
        title: '首页',
        iconOn: 'nav-1-active',
        iconOff: 'nav-1',
        navTransition: 'none'
    }, {
        state: '#/messages',
        title: '消息',
        iconOn: 'nav-2-active',
        iconOff: 'nav-2',
        navTransition: 'none'
    }, {
        state: '#/patients',
        title: '患者',
        iconOn: 'nav-3-active',
        iconOff: 'nav-3',
        navTransition: 'none'
    }, {
        state: '#/circle',
        title: '圈子',
        iconOn: 'nav-4-active',
        iconOff: 'nav-4',
        navTransition: 'none'
    }, {
        state: '#/ucenter',
        title: '个人中心',
        iconOn: 'nav-5-active',
        iconOff: 'nav-5',
        navTransition: 'none'
    }])
    .directive('xuiTabs', function($ionicViewSwitcher, $timeout, $state, tabs) {
        return {
            restrict: 'E',
            replace: true,
            template: require('./tabs.html'),
            unReadMsg: 0,
            isExpert: null,
            scope: {
                activeTabIndex: '@'
            },

            link: function($scope, $el, $attrs) {
                $scope.tabs = tabs;

                $el.on('click', 'a', function() {
                    var navTransition = $(this).data('nav-transition');
                    $ionicViewSwitcher.nextTransition(navTransition);

                });
            }
        };
    });
