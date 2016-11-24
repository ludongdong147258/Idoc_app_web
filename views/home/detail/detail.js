require('./detail.scss');

angular.module('app.controllers')
    .controller('HomeCtrl', function($rootScope, $scope, $state,
        $ionicModal, $templateCache, $timeout, $ionicHistory, errorHandler,
        homeService, popupService) {
        var curIndex = 0;
        var obj = {
            getFinishiText: function(timeNum) {
                var finishiDate = new Date(timeNum),
                    hour = finishiDate.getHours(),
                    minutes = finishiDate.getMinutes(),
                    finishiText = (hour < 10 ? '0' + hour : hour) + ":" + (minutes < 10 ? '0' + minutes : minutes);
                return finishiText;
            },
            loadTaskList: function() {
                var that = this;
                homeService.getTaskForDoctorList().success(function(data) {
                    if (data.code == 200) {
                        $scope.taskList = data.doctorTaskList;
                        angular.forEach($scope.taskList, function(item, index) {
                            item.isExpand = false;
                            item.msgcount = 0;
                            item.actions = [];
                            angular.forEach(item.taskList, function(subItem, subIndex) {
                                var finishiText = that.getFinishiText(parseInt(subItem.finishTime * 1000));
                                var isFinish = subItem.isFinish == '1';
                                if (!isFinish) {
                                    item.msgcount += 1;
                                }
                                item.actions.push({
                                    taskId: subItem.teamTaskId,
                                    isComplete: isFinish,
                                    actionText: subItem.taskTitle,
                                    actionDetails: isFinish ? finishiText + subItem.dname + '已完成' : '',
                                    actionName: isFinish ? '已完成' : '完成'
                                })
                            });
                        });
                    }
                }).error(errorHandler()).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            },
            loadDynamicList: function() {
                homeService.getDynamicForDoctorList().success(function(data) {
                    if (data.code == 200) {
                        $scope.teamDynamicList = data.teamDynamicList;
                        angular.forEach($scope.teamDynamicList, function(item, index) {
                            angular.forEach(item.dynamicList, function(subItem, subIndex) {
                                var createDate = new Date(parseInt(subItem.createTime)),
                                    hour = createDate.getHours(),
                                    minutes = createDate.getMinutes(),
                                    timeText = (hour < 10 ? '0' + hour : hour) + ":" + (minutes < 10 ? '0' + minutes : minutes);
                                subItem.timeText = timeText;
                            });
                        })
                    }
                }).error(errorHandler()).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
        };
        obj.loadTaskList();
        $scope.displayState = [true, false];
        // 选项卡切换
        $scope.tabChange = function(index) {
            curIndex = index;
            if (index) {
                $scope.displayState = [false, true];
                obj.loadDynamicList();
            } else {
                $scope.displayState = [true, false];
                obj.loadTaskList();
            }
        };
        // 显示操作
        $scope.showAction = function(item) {
            item.isExpand = !item.isExpand;
        };
        // 完成任务
        $scope.finishiTask = function(subItem, event, item) {
            event.preventDefault();
            event.stopPropagation();
            popupService.confirm('您确定已完成?').then(function(res) {
                if (res) {
                    homeService.finishiTask(subItem.taskId).success(function(data) {
                        var doctorInfo = data.doctorInfo;
                        var finishiText = obj.getFinishiText(parseInt(doctorInfo.finishTime)*1000);
                        item.msgcount -= 1;
                        item.isExpand = true;
                        subItem.isComplete = true;
                        subItem.actionDetails = finishiText + doctorInfo.dname + '已完成';
                    }).error(errorHandler());
                }
            });
        };
        $scope.doRefresh = function() {
            if (curIndex) {
                obj.loadDynamicList();
            } else {
                obj.loadTaskList();
            }
        };
    });
