require('./delete.scss');
angular.module('app.controllers')
    .controller('PatientDeleteCtr', function($rootScope, $scope, $state, $stateParams, $ionicModal, patientService, popupService, $timeout, errorHandler, PatientService, $ionicPopup) {
        var patientParams = {
            teamId:$stateParams.teamId,
            processId:$stateParams.processId,
            tabIndex:$stateParams.tabIndex
        };
        $scope.back = function() {
            $state.go('patients',patientParams);
        };
        $scope.deletePatientList = PatientService.getPatientList();
        $scope.deletePatients = function() {
            $ionicPopup.prompt({
                cssClass: 'delete-head',
                title: '删除病人之后将无法恢复,确定删除?<br>请输入口令验证:dele',
                inputType: 'text',
                inputPlaceholder: '请输入删除口令(dele)',
                okText: '确认删除',
                okType: 'button-default',
                cancelText: '取消',
                cancelType: 'button-line'
            }).then(function(res) {
                if (res) {
                    if(res == 'dele') {
                        var teamPids = [];
                        angular.forEach($scope.deletePatientList, function(item, index) {
                            teamPids.push(item.teamPid);
                        });
                        var params = {
                            teamPids: teamPids
                        };
                        patientService.deletePatients(params).success(function(data) {
                            popupService.open('删除成功!');
                            $timeout(function() {
                                $state.go('patients',patientParams);
                            }, 2000);
                        }).error(errorHandler());
                    }else {
                        popupService.open('口令错误!');
                    }
                }
            });
        };
    });
