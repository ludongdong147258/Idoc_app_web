require('./round.scss');
angular.module('app.controllers')
    .controller('PatientRoundCtr', function($rootScope, $scope, $state, $stateParams, $ionicModal, patientService, popupService, $timeout, errorHandler, PatientService) {
        var patientParams = {
            teamId: $stateParams.teamId,
            processId: $stateParams.processId,
            tabIndex: $stateParams.tabIndex
        };
        var roundPatientList = PatientService.getPatientList();
        $scope.taskList = [];
        $scope.back = function() {
            $state.go('patients', patientParams);
        };
        patientService.getTaskList($stateParams.teamId).success(function(data) {
            $scope.taskList = data.taskList;
        }).error(errorHandler());
        $scope.finishRoundTask = function() {
            var taskList = $scope.taskList;
            var eventTargetIds = [],
                teamPids = [];
            angular.forEach(taskList, function(item, index) {
                if (item.isAdd) {
                    eventTargetIds.push(item.taskId);
                }
            });
            if (eventTargetIds.length <= 0) {
                popupService.open('未选择任何查房内容!');
                return;
            }
            angular.forEach(roundPatientList, function(item, index) {
                teamPids.push(item.teamPid);
            });
            var params = {
                teamPids: teamPids.toString(),
                eventTargetIds: eventTargetIds.toString()
            };
            patientService.finishRoundTask(params).success(function(data) {
                popupService.open('查房成功!');
                $timeout(function() {
                    $state.go('patients', patientParams);
                }, 2000);
            }).error(errorHandler());
        };
        $scope.changeState = function(item) {
            if (item.isAdd) {
                item.isAdd = 0;
            } else {
                item.isAdd = 1;
            }
        };
    });
