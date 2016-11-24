angular.module('app.directives')
    .service('numPickerService', function() {
        var _this = this;
        //页面中选择器数量 default : 0
        _this.globalId = 0;
        return _this;
    })
    /*日期时间选择*/
    .directive('numPicker', [
        '$timeout',
        '$compile', '$ionicScrollDelegate', '$ionicBackdrop', '$q', 'numPickerService',
        function($timeout, $compile, $ionicScrollDelegate, $ionicBackdrop, $q, numPickerService) {
            return {
                template: '<div></div>',
                restrict: 'AE',
                replace: true,
                scope: {
                    numResult: '=',
                    okHandler: '&' //回调函数
                },
                link: function(scope, elm, attrs) {
                    var globalId = ++numPickerService.globalId;
                    var tem = "<div class='pickerContainer datetimeactive'>" +
                        "<div class='main'>" +
                        "<div  class='header'>" +
                        "<div><span ng-click='cancel()'>取消</span><h2 ng-show='options.title'>{{options.title}}</h2><span ng-click='ok()'>确定</span></div>" +
                        /* "<div>{{selectDateTime.show}}</div>" +*/
                        "</div>" +
                        "<div class='body'>" +
                        "<div class='row row-no-padding'>" +
                        "<div class='col'><ion-scroll  on-scroll='scrollingEvent(\"num\")' delegate-handle='numScroll_" + globalId + "' scrollbar-y='false' class='yearContent'>" + "<ul>" + "<li ng-style='num.selected ? { color: \"#43cea9\",fontWeight: \"bold\", fontSize: \"16px\"}:{}' ng-click='selectEvent(\"num\",$index)' ng-repeat='num in numList'>{{num.data}}</li>" + "</ul>" + "</ion-scroll></div>" +
                        "</div>" +
                        "<div class='body_center_highlight'></div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var options = {
                        title: attrs.title || "添加天数",
                        startNum: attrs.startNum || 1,
                        endNum: attrs.endNum || 99,
                        height: 40, // 每个滑动 li 的高度 这里如果也配置的话 要修改css文件中的高度的定义
                        inModal: attrs.inmodal || false, //是否在Modal 中使用插件
                    }
                    scope.options = options;
                    scope.numScrollTimer = null; //滑动定时器
                    scope.numList = [];
                    scope.selectNum = {
                        num: {
                            item: null,
                            index: 0
                        },
                        show: ""
                    };
                    scope.options = options;
                    init(options);

                    elm.on("click", function() {
                        show();
                        scrollToElm(scope.numScroll, scope.numList[scope.selectNum.num.index - 3]);
                    });
                    //滑动Event
                    scope.scrollingEvent = function(type) {
                            var opEntity = getOperateEntity(type);
                            //当前存在滑动则取消
                            scope[opEntity.scrollTimer] && $timeout.cancel(scope[opEntity.scrollTimer]);

                            var posi = scope[opEntity.scrollHandler].getScrollPosition();
                            var index = Math.abs(Math.round(posi.top / scope.options.height));
                            if (posi.top == index * scope.options.height) {
                                updateSelect(index + 3, type);
                            } else {
                                scope[opEntity.scrollTimer] = $timeout(function() {
                                    posi.top = index * 40;
                                    updateSelect(index + 3, type);
                                    scrollToPosi(scope[opEntity.scrollHandler], posi);
                                }, 100);
                            }
                        }
                        //点击Event
                    scope.selectEvent = function(type, index) {
                        var opEntity = getOperateEntity(type);
                        if (index > 2 && index <= scope[opEntity.data].length - 3) {
                            scrollToElm(scope[opEntity.scrollHandler], scope[opEntity.data][index - 3]);
                        }
                    }

                    //初始化
                    function init(options) {
                        initNum(options);
                        tem = angular.element(tem);
                        $compile(tem)(scope);
                        angular.element(document.body).append(tem);
                        getSelectNum();
                    }

                    //初始化
                    function initNum(options) {
                        scope.numScroll = $ionicScrollDelegate.$getByHandle("numScroll_" + globalId);
                        var defaultNum = options.startNum;
                        var numSpan = options.endNum - options.startNum;
                        var text, data, top = 0,
                            item, defaultItem, defaultIndex;
                        prependLi(scope.numList, 3, "b");
                        for (var i = 0; i <= numSpan; i++) {
                            text = (i + 1);
                            data = (i + 1);
                            var tempTop = 0;
                            var tempItem = scope.numList[scope.numList.length - 1];
                            if (tempItem) {
                                tempTop = tempItem.top;
                                top = options.height + tempTop;
                            }
                            item = createDateTimeLi(0, top, data, data == defaultNum, text);
                            if (data == defaultNum) {
                                defaultItem = item;
                                defaultIndex = scope.numList.length;
                            }
                            scope.numList.push(item);
                        }
                        //设置默认选择
                        scope.selectNum.num.item = defaultItem;
                        scope.selectNum.num.index = defaultIndex;
                        prependLi(scope.numList, 0, "e");
                    }


                    //计算默认的选择时间
                    function getDefaultSelectTime(options) {
                        var hour;
                        var minu;
                        //不设置 或者默认时间 除以 时间间隔的(timeSpan) 不为整数的
                        if (options.minuteSkip || parseInt((options.DateTime.getMinutes() / options.timeSpan)) != (options.DateTime.getMinutes() / options.timeSpan)) {
                            options.minuteSkip = options.minuteSkip || 30;
                            var datetimeNow = new Date();
                            hour = datetimeNow.getHours();
                            minu = datetimeNow.getMinutes();
                            minu = minu + options.minuteSkip;
                            var span = minu - 60;
                            var spanNum;
                            if (span >= 0) {
                                hour += 1;
                                spanNum = Math.round(Math.abs(span) / options.timeSpan);
                            } else {
                                spanNum = Math.round(minu / options.timeSpan);
                            }
                            switch (spanNum) {
                                case 1:
                                    minu = options.timeSpan;
                                    break;
                                case 2:
                                    minu = options.timeSpan * 2;
                                    break;
                                case 3:
                                    minu = options.timeSpan * 3;
                                    break;
                                case 4:
                                    hour += 1;
                                    minu = 0;
                                default:
                                    minu = 0;
                                    break;
                            }
                        } else {
                            hour = options.DateTime.getHours();
                            minu = options.DateTime.getMinutes();
                        }
                        return prependZero(hour, 10) + ":" + prependZero(minu, 10);
                    }

                    function prependZero(data, num) {
                        return data >= num ? data : "0" + data;
                    }

                    function createDateTimeLi(left, top, data, selected, text) {
                        var li = {
                            left: left,
                            top: top,
                            data: data,
                            selected: selected,
                            text: text
                        };
                        return li;
                    }

                    function prependLi(arr, num, loc) {
                        loc = loc || "b";
                        switch (loc) {
                            case "b":
                                for (var i = 0; i < num; i++) {
                                    arr.push(createDateTimeLi(0, (options.height * i), "", false, ""));
                                }
                                break;
                            case "e":
                                //最后那个li元素的 top
                                var lastPosiTop = arr[arr.length - 1].top;
                                for (var j = 0; j < num; j++) {
                                    arr.push(createDateTimeLi(0, (options.height * (i + 1) + lastPosiTop), "", false, ""));
                                }
                                break;
                        }
                    }

                    //滑动到指定元素
                    function scrollToElm(scorllHandler, elm) {
                        if (scorllHandler) {
                            scorllHandler.scrollTo(elm.left, elm.top, true);
                        }
                    }

                    //滑动到指定位置
                    function scrollToPosi(scorllHandler, posi) {
                        scorllHandler.scrollTo(posi.left, posi.top, true);
                    }

                    function updateSelect(index, type) {
                        switch (type) {
                            case "num":
                                //强制
                                $timeout(function() {
                                    scope.selectNum.num.item.selected = false;
                                    scope.numList[index].selected = true;
                                    scope.selectNum.num.item = scope.numList[index];
                                    scope.selectNum.num.index = index;
                                });
                                break;

                        }
                    }
                    //获取选中的时间结果
                    function getSelectNum() {
                        scope.numResult = scope.selectNum.num.item.data;
                        return scope.numResult;
                    }

                    function getOperateEntity(type) {
                        var entity = new Object();
                        var scrollTimer, scrollHandler, data, defaultSelected, selectedItem;
                        switch (type) {
                            case "num":
                                entity.scrollTimer = "numScrollTimer";
                                entity.type = type;
                                entity.scrollHandler = "numScroll";
                                entity.data = "numList";
                                entity.defaultSelected = scope.selectNum.num.item.data;
                                entity.selectedItem = "num";
                                break;
                        }
                        return entity;
                    }

                    scope.ok = function() {
                        var num = getSelectNum();
                        hide();
                        if (scope.okHandler) {
                            var aa = scope.okHandler({
                                result: num
                            });
                        }
                    }
                    scope.cancel = function() {
                        hide();
                    }

                    function show() {
                        //是否在Modal 中使用
                        if (scope.options.inModal) {
                            angular.element(document.body).removeClass("modal-open");
                        }
                        $ionicBackdrop.retain();
                        tem.css("display", "block");
                    }

                    function hide() {
                        //是否在Modal 中使用
                        if (scope.options.inModal) {
                            angular.element(document.body).addClass("modal-open");
                        }
                        tem.css("display", "none");
                        $ionicBackdrop.release();
                    }

                    function remove() {
                        tem.remove();
                    }
                    scope.$on("$destroy", function() {
                        remove();
                    })
                }
            }
        }
    ]);
