require('./baseInfo.scss');
require('./doctor-modal.scss');
require('./diagnose-modal.scss');
angular.module('app.controllers')
    .controller('PatientBaseInfoCtr', function($rootScope, $scope, $state, $stateParams, $ionicModal, patientService, popupService, $timeout, errorHandler) {
        var teamPid = $stateParams.teamPid;
        var state = $stateParams.state;
        $scope.teamPid = teamPid;
        var obj = {
            getBedInfoDisplay: function(bedInfo) {
                return bedInfo.buildingText + bedInfo.floorNum + bedInfo.roomNum + '-' + bedInfo.bedNum;
            },
            getDirectorName: function(id) {
                var name = '';
                for (var i = 0; i < $scope.directorList.length; i++) {
                    if ($scope.directorList[i].k == id) {
                        name = $scope.directorList[i].v;
                        break;
                    }
                }
                return name;
            },
            getAttendName: function(id) {
                var name = '';
                for (var i = 0; i < $scope.attendingList.length; i++) {
                    if ($scope.attendingList[i].k == id) {
                        name = $scope.attendingList[i].v;
                        break;
                    }
                }
                return name;
            },
            getBedDname: function(id) {
                var name = '';
                for (var i = 0; i < $scope.tubebedList.length; i++) {
                    if ($scope.tubebedList[i].k == id) {
                        name = $scope.tubebedList[i].v;
                        break;
                    }
                }
                return name;
            }
        };
        // 主任
        $scope.showZRDoctor = false;
        $scope.showDirectorDoctorList = function() {
            $scope.showZRDoctor = !$scope.showZRDoctor;
        };
        $scope.selectDirectorDoctor = function(curItem) {
            $scope.showZRDoctor = false;
            $scope.directorDoctor = curItem;
        };
        $scope.changeZRState = function() {
            $scope.showZRDoctor = false;
        };
        // 主治
        $scope.showZZDoctor = false;
        $scope.showAttendDoctorList = function() {
            $scope.showZZDoctor = !$scope.showZZDoctor;
        };
        $scope.selectAttendDoctor = function(curItem) {
            $scope.showZZDoctor = false;
            $scope.attendDoctor = curItem;
        };
        $scope.changeAttendState = function() {
            $scope.showZZDoctor = false;
        };
        // 管床
        $scope.showGCDoctor = false;
        $scope.showBedDoctorList = function() {
            $scope.showGCDoctor = !$scope.showGCDoctor;
        };
        $scope.selectBedDoctor = function(curItem) {
            $scope.showGCDoctor = false;
            $scope.bedDoctor = curItem;
        };
        $scope.changeBedDState = function() {
            $scope.showGCDoctor = false;
        };
        $scope.data = {};
        // 返回
        $scope.back = function() {
            $state.go('patientInfo', $stateParams);
        };
        patientService.getPatientInfo(teamPid).success(function(data) {
            if (data.code == 200) {
                var gender = '未知';
                switch (data.patientInfo.gender) {
                    case '1':
                        gender = '男';
                        break;
                    case '2':
                        gender = '女';
                        break;
                }
                data.patientInfo.gender = gender;
                $scope.patientInfo = data.patientInfo;
                $scope.patientInfo.currentNodeType = data.patientInfo.processDetailInfo.currentNodeType;
                $scope.patientInfo.bedInfo = obj.getBedInfoDisplay(data.patientInfo.bedInfo);
                patientService.getDoctorList($scope.patientInfo.teamId).success(function(data) {
                    if (data.code == 200) {
                        $scope.directorList = data.directorList;
                        $scope.attendingList = data.attendingList;
                        $scope.tubebedList = data.tubebedList;
                    }
                });
            }
        }).error(errorHandler());
        // 医生modal
        var doctorModal = $ionicModal.fromTemplate(require('./doctor-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openDoctorModal = function() {
            var patientInfo = $scope.patientInfo;
            $scope.data = {
            };
            if(patientInfo.directorDid) {
                $scope.data.directorDoctorId = patientInfo.directorDid;
                $scope.directorDoctor = {
                    k:patientInfo.directorDid,
                    v:patientInfo.directorDname
                };
            }
            if(patientInfo.attendingDid) {
                $scope.data.attendDoctorId = patientInfo.attendingDid;
                $scope.attendDoctor = {
                    k:patientInfo.attendingDid,
                    v:patientInfo.attendingDname
                };
            }
            if(patientInfo.tubebedDid) {
                $scope.data.tubedDoctorId = patientInfo.tubebedDid;
                $scope.bedDoctor = {
                    k:patientInfo.tubebedDid,
                    v:patientInfo.tubebedDname
                };
            }
            doctorModal.show();
        };
        $scope.closeDoctorModal = function() {
            doctorModal.hide();
        };

        $scope.saveDoctorInfo = function() {
            var data = $scope.data;
            if (!data.directorDoctorId) {
                popupService.open('主任医师不能为空!');
                return;
            }
            if (!data.attendDoctorId) {
                popupService.open('主治医师不能为空!');
                return;
            }
            if (!data.tubedDoctorId) {
                popupService.open('管床医生不能为空!');
                return;
            }
            var params = {
                teamPid: teamPid,
                directorDid: data.directorDoctorId,
                attendingDid: data.attendDoctorId,
                tubebedDid: data.tubedDoctorId
            };
            patientService.patientAddOrUpdate(params).success(function(data) {
                if (data.code == 200) {
                    popupService.open('保存成功!');
                    doctorModal.hide();
                    $scope.patientInfo.directorDname = obj.getDirectorName(params.directorDid);
                    $scope.patientInfo.attendingDname = obj.getAttendName(params.attendingDid);
                    $scope.patientInfo.tubebedDname = obj.getBedDname(params.tubebedDid);
                }
            }).error(errorHandler());
        };

        // 诊断modal
        var diagnoseModal = $ionicModal.fromTemplate(require('./diagnose-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openDiagnoseModal = function() {
            $scope.diagnoseInfo = {
                value: $scope.patientInfo.diagnose
            };
            diagnoseModal.show();
        };
        $scope.closeDiagnoseModal = function() {
            diagnoseModal.hide();
        };
        $scope.saveDiagnoseInfo = function() {
            var diagnoseInfo = $scope.diagnoseInfo;
            if (!diagnoseInfo.value) {
                popupService.open('诊断信息不能为空!');
                return;
            }
            var params = {
                teamPid: teamPid,
                diagnose: diagnoseInfo.value
            };
            patientService.patientAddOrUpdate(params).success(function(data) {
                if (data.code == 200) {
                    popupService.open('保存成功!');
                    diagnoseModal.hide();
                    $scope.patientInfo.diagnose = diagnoseInfo.value;
                }
            }).error(errorHandler());
        };
        // 备注modal
        var remarkModal = $ionicModal.fromTemplate(require('./remark-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openRemarkModal = function() {
            $scope.remarkInfo = {
                value: $scope.patientInfo.remark
            };
            remarkModal.show();
        };
        $scope.closeRemarkModal = function() {
            remarkModal.hide();
        };
        $scope.saveRemarkInfo = function() {
            var remarkInfo = $scope.remarkInfo;
            if (!remarkInfo.value) {
                popupService.open('备注信息不能为空!');
                return;
            }
            var params = {
                teamPid: teamPid,
                remark: remarkInfo.value
            };
            patientService.patientAddOrUpdate(params).success(function(data) {
                if (data.code == 200) {
                    popupService.open('保存成功!');
                    remarkModal.hide();
                    $scope.patientInfo.remark = remarkInfo.value;
                }
            }).error(errorHandler());
        };
        $scope.$on('$destroy', function() {
            doctorModal.remove();
            diagnoseModal.remove();
            remarkModal.remove();
        });
        $scope.goToPatientTag = function(teamPid) {
            $state.go('patientTag',$stateParams);
        };
    });
