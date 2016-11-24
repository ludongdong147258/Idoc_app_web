require('./inhospital.scss');
require('./addbed.scss');
angular.module('app.controllers')
    .controller('PatientInhospitalCtr', function($rootScope, $scope, $state, $stateParams, $ionicModal, patientService, popupService, $timeout, errorHandler, PatientService) {
        var patientParams = {
            teamId: $stateParams.teamId,
            processId: $stateParams.processId,
            tabIndex: $stateParams.tabIndex,
            nodeId: $stateParams.nodeId
        };
        var teamId = $stateParams.teamId,
            nodeId = $stateParams.nodeId;
        patientService.getNoPatientBedList(teamId).success(function(data) {
            var manBedList = data.manBedList;
            var womanBedList = data.womanBedList;
            $scope.inhospitalPatList = PatientService.getPatientList();
            angular.forEach($scope.inhospitalPatList, function(item, index) {
                item.showBed = false;
                item.patBebInfo = {};
                item.radioName = 'bed' + index;
                item.data = {};
                if (item.gender == '男') {
                    item.bedList = manBedList;
                } else if (item.gender == '女') {
                    item.bedList = womanBedList;
                }
            });
        }).error(errorHandler());
        $scope.back = function() {
            $state.go('patients', patientParams);
        };
        $scope.showBedList = function(item) {
            item.showBed = !item.showBed;
        };
        $scope.hideBedList = function(item) {
            item.showBed = false;
        };
        $scope.selectBed = function(subItem, item) {
            item.patBebInfo = subItem;
            item.showBed = false;
        };
        $scope.patientInHospital = function() {
            if (!$scope.inTime) {
                popupService.open('入院时间节点不能为空!');
                return;
            }
            var bedList = [];
            angular.forEach($scope.inhospitalPatList, function(item, index) {
                if (item.data.bedId) {
                    bedList.push({
                        teamPid: item.teamPid,
                        teamBedId: item.data.bedId
                    });
                }
            });
            var params = {
                nodeId: nodeId,
                nodeTimeValue: ((new Date($scope.inTime)).getTime() / 1000)
            };
            params.bedList = bedList;
            patientService.patientInHospital(params).success(function(data) {
                popupService.open('已成功安排住院!');
                $timeout(function() {
                    $state.go('patients', patientParams);
                }, 2000);
            }).error(errorHandler());
        };
        var bedModal = $ionicModal.fromTemplate(require('./addbed-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openBedModal = function() {
            $scope.bedInfo = {
                bedType: 2
            };
            $scope.data = {};
            $scope.displayStates = [true, false, false];
            $scope.showPatient = false;
            $scope.patInfo = null;
            bedModal.show();
        };
        $scope.closeBedModal = function() {
            bedModal.hide();
        };
        $scope.$on('$destroy', function() {
            bedModal.remove();
        });
        $scope.showPatientList = function() {
            $scope.showPatient = true;
        };
        $scope.hidePatientList = function() {
            $scope.showPatient = false;
        };
        $scope.selectPatient = function(item) {
            $scope.patInfo = item;
            $scope.showPatient = false;
        };
        $scope.selectDetailsBed = function(type, curIndex) {
            $scope.bedInfo.bedType = type;
            angular.forEach($scope.displayStates, function(item, index) {
                $scope.displayStates[index] = false;
            });
            $scope.displayStates[curIndex] = true;
        };
        $scope.addBed = function() {
            var bedInfo = $scope.bedInfo;
            if (!bedInfo.buildingText) {
                popupService.open('请输入楼名!');
                return;
            }
            if (!bedInfo.floorNum) {
                popupService.open('请输入楼层!');
                return;
            }
            if (!bedInfo.roomNum) {
                popupService.open('请输入房间名!');
                return;
            }
            if (!bedInfo.bedNum) {
                popupService.open('请输入床位号!');
                return;
            }
            if (!$scope.patInfo.pname) {
                popupService.open('请选择患者!');
                return;
            }
            var params = angular.extend($scope.bedInfo, {
                teamId:teamId,
                pid: $scope.patInfo.teamPid
            });
            patientService.addTeamBed(params).success(function(data) {
                popupService.open('添加成功!');
                bedModal.hide();
            }).error(errorHandler());
        };
        $scope.selectDate = function(){
            angular.element(document.getElementById('patInHos')).click();
        };
        $scope.callback = function(data) {
            $scope.inTime = data;
        };
    });
