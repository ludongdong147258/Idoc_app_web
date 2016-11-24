require('./operation.scss');
angular.module('app.controllers')
    .controller('PatientOperationCtr', function($rootScope, $scope, $state,
        $ionicModal, $templateCache, $timeout, $ionicHistory, errorHandler,
        patientService, popupService, PatientService, $stateParams) {
        var patientParams = {
            teamId: $stateParams.teamId,
            processId: $stateParams.processId,
            tabIndex: $stateParams.tabIndex,
            nodeId: $stateParams.nodeId
        };
        var optSiteList = [],
            tempOptSiteList = [],
            optTypeList = [],
            tempOptTypeList = [],
            optMtList = [],
            tempOptMtList = [];
        var optPatList = PatientService.getPatientList();
        var obj = {
            getIds: function(dataList) {
                var ids = [];
                angular.forEach(dataList, function(item, index) {
                    ids.push(item.k);
                })
                return ids.toString();
            },
            getInputVal: function(item, list, tempList) {
                item.isSelected = !item.isSelected;
                if (item.isSelected) {
                    var count = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (item.k == list[i].k) {
                            count++;
                            break;
                        }
                    }
                    if (!count) {
                        list.push(item);
                    }
                } else {
                    for (var i = 0; i < list.length; i++) {
                        if (item.k == list[i].k) {
                            list.splice(i, 1);
                        }
                    }
                }
                tempList.length = 0;
                angular.forEach(list, function(item, index) {
                    tempList.push(item.v);
                });
                return tempList.toString();
            }
        };
        $scope.back = function() {
            $state.go('patients', patientParams);
        };
        $scope.data = {};
        patientService.getOptSiteList().success(function(data) {
            $scope.optSiteList = data.optSiteList;
            angular.forEach($scope.optSiteList, function(item, index) {
                item.data = {};
                item.isSelected = false;
            });
        }).error(errorHandler());
        $scope.showOptSite = false;
        $scope.showOptSiteList = function() {
            $scope.showOptSite = !$scope.showOptSite;
            if (!$scope.showOptSite) {
                var siteIds = obj.getIds(optSiteList);
                patientService.getOptTypeList(siteIds, patientParams.teamId).success(function(data) {
                    $scope.optTypeList = data.optTypeList;
                    angular.forEach($scope.optTypeList, function(item, index) {
                        item.data = {};
                        item.isSelected = false;
                    });
                }).error(errorHandler());
            }
        };
        $scope.selectOptSite = function(item) {
            $scope.data.optSite = obj.getInputVal(item, optSiteList, tempOptSiteList);
        };

        $scope.showOptType = false;
        $scope.showOptTypeList = function() {
            $scope.showOptType = !$scope.showOptType;
            if (!$scope.showOptType) {
                var optTypeIds = obj.getIds(optTypeList);
                patientService.getOptMaterialList(optTypeIds, patientParams.teamId).success(function(data) {
                    $scope.optMtList = data.optMtList;
                    angular.forEach($scope.optMtList, function(item, index) {
                        item.data = {};
                        item.isSelected = false;
                    });
                }).error(errorHandler());
            }
        };
        $scope.selectOptType = function(item) {
            $scope.data.optType = obj.getInputVal(item, optTypeList, tempOptTypeList);
        };

        $scope.showMt = false;
        $scope.showOptMtList = function() {
            $scope.showMt = !$scope.showMt;
            if (!$scope.showMt) {
                $scope.optMtNumList = optMtList;
                angular.forEach($scope.optMtNumList, function(item, index) {
                    item.mtlNum = 0;
                    item.optMtlId = item.k;
                });
            }
        };
        $scope.selectOptMt = function(item) {
            $scope.data.optMt = obj.getInputVal(item, optMtList, tempOptMtList);
        };
        $scope.addCount = function(item, num) {
            var tempNum = item.mtlNum + num;
            if (tempNum < 0) {
                popupService.open('数量不能小于0!');
                return;
            }
            item.mtlNum += num;
        }
        $scope.addOperation = function() {
            if(!$scope.optTime) {
                popupService.open('请选择手术时间!');
                return;
            }
            var optMtList = [];
            angular.forEach($scope.optMtNumList, function(item, index) {
                optMtList.push({
                    optMtlId: item.optMtlId,
                    mtlNum: item.mtlNum
                });
            });
            var teamPids = [];
            angular.forEach(optPatList, function(item, index) {
                teamPids.push(item.teamPid);
            });
            var optTime = ((new Date($scope.optTime)).getTime()) / 1000;
            var params = {
                nodeId: patientParams.nodeId,
                optMtlList: optMtList,
                teamPids: teamPids.toString(),
                optTime: optTime,
                nodeTimeValue:optTime
            };
            if(optMtList.length == 0) {
                popupService.open('请选择手术材料!');
                return;
            }
            patientService.addOperation(params).success(function(data) {
                popupService.open('安排手术成功!');
                $timeout(function() {
                    $state.go('patients', patientParams);
                }, 2000);
            }).error(errorHandler());
        };
        $scope.selectDate = function(){
            angular.element(document.getElementById('patOperation')).click();
        };
        $scope.callback = function(data) {
            $scope.optTime = data;
        };
    });
