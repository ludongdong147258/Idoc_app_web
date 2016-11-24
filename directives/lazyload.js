/**
 * 图片懒加载
 *
 * <img xui-lazyload="图片路径" />
 *
 */
angular.module('app.directives')
    .directive('xuiLazyload', function($document, $timeout) {
        return {
            restrict: 'A',
            priority: -1,
            replace: true,
            scope: {
                xuiLazyload: '='
            },

            link: function($scope, $el, $attrs) {

                var listener = $scope.$watch('xuiLazyload', function() {
                    var original = $scope.xuiLazyload;

                    if (!original) {
                        return;
                    }

                    var $elImgContainer = $el.parent('.p-img').addClass('lazyload');
                    var placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=';

                    $el.attr('data-original', original);
                    $el.attr('src', placeholder);

                    // 借助jquery.lazyload插件完成效果，原理是预加载图，图成功load之后与占位图切换
                    $el.lazyload({
                        effect: 'fadeIn',
                        container: $el.parents('.pane, .modal'),
                        load: function() {
                            $elImgContainer.removeClass('lazyload');
                        }
                    });

                    $el.trigger('appear');
                });

                $scope.$on('$destory', function() {
                    $timeout(function() {
                        listener();
                    });
                });
            }
        };
    });
