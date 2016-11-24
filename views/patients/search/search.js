require('./search.scss');
angular.module('app.controllers')
    .controller('PatientSearchCtr', function($rootScope, $scope, $state, patientService, errorHandler, $stateParams, popupService) {
        var patientParams = {
            teamId: $stateParams.teamId,
            processId: $stateParams.processId,
            tabIndex: $stateParams.tabIndex,
            nodeId: $stateParams.nodeId
        };
        var teamId = $stateParams.teamId,
            processId = $stateParams.processId,
            nodeId = $stateParams.nodeId;
        var currentIndex = 0;
        $scope.displayStates = [true, false, false, false, false];
        $scope.hasMoreData = false;
        $scope.patientList = [];
        $scope.searchTxt = '';
        var pageIndex = 1,
            pageSize = 10;
        var obj = {
            search: function(searchText) {
                var params = {
                    teamId: teamId,
                    processId: processId,
                    nodeId: nodeId,
                    pageNo: pageIndex,
                    pageSize: pageSize,
                    sk: (currentIndex + 1),
                    sv: (searchText ? searchText : '')
                };
                if (currentIndex == 4) {
                    if (!$scope.searchInfo.startDate) {
                        popupService.open('请选择开始时间!');
                        return;
                    }
                    if (!$scope.searchInfo.endDate) {
                        popupService.open('请选择结束时间!');
                        return;
                    }
                    var startTimeStamp = new Date($scope.searchInfo.startDate).getTime() / 1000;
                    var endTimeStamp = new Date($scope.searchInfo.endDate).getTime() / 1000;
                    if(endTimeStamp <= startTimeStamp) {
                        popupService.open('结束时间必须大于开始时间!');
                        return;
                    }
                    params.sv = startTimeStamp;
                    params.sv2 = endTimeStamp;
                }
                patientService.searchPatientList(params).success(function(data) {
                    $scope.patientList = $scope.patientList.concat(data.patientList);
                    if (data.patientList.length == 0) {
                        popupService.open('未查询到相关信息!');
                    }
                    angular.forEach($scope.patientList, function(item, index) {
                        switch (parseInt(item.gender)) {
                            case 1:
                                item.gender = '男';
                                break;
                            case 2:
                                item.gender = '女';
                                break;
                            default:
                                item.gender = '未知';
                                break;
                        }
                        if (item.optTime) {
                            item.optTime = new Date(parseInt(item.optTime) * 1000);
                        }
                        if (item.buildingText) {
                            item.bedInfo = item.buildingText + item.floorNum + item.roomNum + '-' + item.bedNum;
                        }
                        var pageInfo = data.pageInfo;
                        if (pageInfo.pageCount > pageSize) {
                            $scope.hasMoreData = true;
                        } else {
                            $scope.hasMoreData = false;
                        }
                    });
                }).error(errorHandler());
            }
        };
        // 返回
        $scope.back = function() {
            $state.go('patients', patientParams);
        };
        $scope.changeTab = function(curIndex) {
            pageIndex = 1;
            $scope.searchTxt = '';
            $scope.hasMoreData = false;
            if ($scope.patientList) {
                $scope.patientList.length = [];
            }
            angular.forEach($scope.displayStates, function(val, index) {
                $scope.displayStates[index] = false;
            });
            $scope.displayStates[curIndex] = true;
            currentIndex = curIndex;
        };
        $scope.searchInfo = {};
        $scope.searchPatientList = function(searchText) {
            pageIndex = 1;
            $scope.searchTxt = '';
            $scope.hasMoreData = false;
            if ($scope.patientList) {
                $scope.patientList.length = [];
            }
            obj.search(searchText);
            $scope.searchTxt = searchText;
        };
        $scope.laodMore = function() {
            pageIndex++;
            obj.search($scope.searchTxt);
        };
        $scope.goToPatientInfo = function(item) {
            $state.go('patientInfo',{
                state:'patientSearch',
                teamPid:item.teamPid,
                teamId:teamId,
                processId:processId,
                nodeId:nodeId
            });
        };
        var curNum = 1;
        $scope.selectDate = function(num){
            curNum = num;
            angular.element(document.getElementById('searchTimerPicker')).click();
        };
        $scope.callback = function(data) {
            if(curNum == 1) {
                $scope.searchInfo.startDate = data;
            }else if(curNum == 2){
                $scope.searchInfo.endDate = data;
            }
        };
    });
