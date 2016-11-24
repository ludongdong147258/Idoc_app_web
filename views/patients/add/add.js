require('./add.scss');
require('./mobile-modal.scss');
angular.module('app.controllers')
    .controller('PatientAddCtr', function($rootScope, $scope, $state, $ionicModal, errorHandler, popupService, patientService, $stateParams,$timeout) {
        var patientParams = {
            teamId:$stateParams.teamId,
            processId:$stateParams.processId,
            tabIndex:$stateParams.tabIndex
        };
        // 返回
        $scope.back = function() {
            $state.go('patients',patientParams);
        };
        $scope.showError = false;
        var teamId = $stateParams.teamId;
        $scope.data = {};
        $scope.showTeam = false;
        $scope.showTeamList = function() {
            $scope.showTeam = !$scope.showTeam;
        };
        $scope.hideTeamList = function() {
            $scope.showTeam = false;
        };
        $scope.selectTeam = function(item) {
            $scope.team = item;
            $scope.showTeam = false;
            patientService.getProcessList(item.k).success(function(data) {
                $scope.processList = data.teamProcessList;
            }).error(errorHandler());
        };
        $scope.showProcess = false;
        $scope.showProcessList = function() {
            $scope.showProcess = !$scope.showProcess;
        };
        $scope.hideProcessList = function() {
            $scope.showProcess = false;
        };
        $scope.selectProcess = function(item) {
            $scope.process = item;
            $scope.showProcess = false;
            patientService.getProcessDetailsList($scope.team.k, item.k).success(function(data) {
                $scope.processDetailsList = data.teamProcessDetailList;
            }).error(errorHandler());
        };
        $scope.showProcessDetails = false;
        $scope.showProcessDetailsList = function() {
            $scope.showProcessDetails = !$scope.showProcessDetails;
        };
        $scope.hideProcessDetailsList = function() {
            $scope.showProcessDetails = false;
        };
        $scope.selectProcessDetails = function(item) {
            $scope.processDetails = item;
            $scope.showProcessDetails = false;
        };
        $scope.showZRDoctor = false;
        $scope.showDirectorDoctorList = function() {
            $scope.showZRDoctor = !$scope.showZRDoctor;
        };
        $scope.hideDirectorDoctorList = function() {
            $scope.showZRDoctor = false;
        };
        $scope.selectDirectorDoctor = function(item) {
            $scope.directorDoctor = item;
            $scope.showZRDoctor = false;
        };
        $scope.showZZDoctor = false;
        $scope.showAttendDoctorList = function() {
            $scope.showZZDoctor = !$scope.showZZDoctor;
        };
        $scope.hideAttendDoctorList = function() {
            $scope.showZZDoctor = false;
        };
        $scope.selectAttendDoctor = function(item) {
            $scope.attendDoctor = item;
            $scope.showZZDoctor = false;
        };
        $scope.showGCDoctor = false;
        $scope.showBedDoctorList = function() {
            $scope.showGCDoctor = !$scope.showGCDoctor;
        };
        $scope.hideBedDoctorList = function() {
            $scope.showGCDoctor = false;
        };
        $scope.selectBedDoctor = function(item) {
            $scope.bedDoctor = item;
            $scope.showGCDoctor = false;
        };
        $ionicModal.fromTemplateUrl('add-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.team = null;
            $scope.process = null;
            $scope.processDetails = null;
            $scope.directorDoctor = null;
            $scope.attendDoctor = null;
            $scope.bedDoctor = null;
            $scope.patientInfo = {
                pid: 0,
                gender: 3,
                age: 0
            };
            patientService.getTeamList().success(function(data) {
                $scope.teamList = data.teamList;
            }).error(errorHandler());
            patientService.getDoctorList(teamId).success(function(data) {
                $scope.directorList = data.directorList;
                $scope.attendingList = data.attendingList;
                $scope.tubebedList = data.tubebedList;
            });
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
            mobileModal.remove();
            teamModal.remove();
            if(timer){
                $timeout.cancel(timer);
            }
        });
        // 手机号添加-modal
        var mobileModal = $ionicModal.fromTemplate(require('./mobile-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openMobileModal = function(){
            $scope.patInfo = {};
            mobileModal.show();
        };
        $scope.closeMobileModal = function(){
            mobileModal.hide();
        };
        // 选择团队流程modal
        var teamModal = $ionicModal.fromTemplate(require('./team-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openTeamModal = function(){
            $scope.teamInfo = {};
            $scope.team = {};
            $scope.process = {};
            $scope.processDetails = {};
            patientService.getTeamList().success(function(data) {
                $scope.teamList = data.teamList;
            }).error(errorHandler());
            teamModal.show();
        };
        $scope.closeTeamModal = function(){
            teamModal.hide();
        };
        $scope.addPatient = function() {
            if (!$scope.team) {
                popupService.open('请选择团队!');
                return;
            }
            if (!$scope.process) {
                popupService.open('请选择基本流程!');
                return;
            }
            if (!$scope.processDetails) {
                popupService.open('请选择详细流程!');
                return;
            }
            var patientInfo = $scope.patientInfo;
            if (!patientInfo.pname) {
                popupService.open('请输入姓名!');
                return;
            }
            if (!patientInfo.idCard) {
                popupService.open('请输入身份证号!');
                return;
            }
            if (!patientInfo.registerNum) {
                popupService.open('请输入登记号!');
                return;
            }
            if (!patientInfo.phone) {
                popupService.open('请输入联系方式!');
                return;
            }
            if (!patientInfo.diagnose) {
                popupService.open('请输入诊断信息!');
                return;
            }
            if (!$scope.directorDoctor) {
                popupService.open('请选择主任医师!');
                return;
            }
            if (!$scope.attendDoctor) {
                popupService.open('请选择主治医师!');
                return;
            }
            if (!$scope.bedDoctor) {
                popupService.open('请选择管床医生!');
                return;
            }
            var params = angular.extend($scope.patientInfo, {
                teamId: $scope.team.k,
                processId: $scope.process.k,
                detailId: $scope.processDetails.k,
                directorDid: $scope.directorDoctor.k,
                attendingDid: $scope.attendDoctor.k,
                tubebedDid: $scope.bedDoctor.k
            });
            patientService.patientAddOrUpdate(params).success(function(data) {
                popupService.open('新建成功!');
                $scope.modal.hide();
                // $scope.showError = true;
                // $scope.errorMsg = data.errorText;
            }).error(errorHandler());
        };
        $scope.getAge = function() {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            var idCard = $scope.patientInfo.idCard;
            if (reg.test(idCard)) {
                var date = new Date(),
                    year = date.getFullYear(),
                    birthday_year = parseInt(idCard.substr(6, 4));
                var userage = year - birthday_year;
                $scope.patientInfo.age = userage;
                if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
                    $scope.patientInfo.gender = 1;
                } else {
                    $scope.patientInfo.gender = 2;
                }
            }
        };
        var timer;
        $scope.showGetCode = false;
        $scope.getSmsCode = function() {
            if(!$scope.patInfo.phone) {
                popupService.open('请输入手机号!');
                return;
            }
            patientService.getPhoneCode({
                type:1003,
                phone:$scope.patInfo.phone
            }).success(function(data){
                $scope.count = 60;
                $scope.showGetCode = true;
                $timeout(function(){
                    reduceCount();
                },1000);
            }).error(errorHandler());
        };
        function reduceCount(){
            if($scope.count == 1) {
                if(timer){
                    $timeout.cancel(timer);
                    $scope.showGetCode = false;
                    return;
                }
            }
            $scope.count--;
            timer = $timeout(function(){
                reduceCount();
            },1000);
        };
        $scope.createPatInfo = function(){
            var patInfo = $scope.patInfo;
            if(!patInfo.idCard) {
                popupService.open('请输入身份证号!');
                return;
            }
            if(!patInfo.phone) {
                popupService.open('请输入手机号!');
                return;
            }
            if(!patInfo.code) {
                popupService.open('请输入验证码!');
                return;
            }
            mobileModal.hide();
            $scope.openTeamModal();
        };
        $scope.addFromUser = function() {
            var data = $scope.data;
            var params = angular.extend($scope.patInfo,$scope.teamInfo,{
                type:1
            });
            patientService.addFromUser(params).success(function(data){
                popupService.open('添加成功!');
                teamModal.hide();
            }).error(errorHandler());
        };
    });
