require('./tag.scss');
require('./tag-modal.scss');
angular.module('app.controllers')
    .controller('PatientTagCtr', function($rootScope, $scope, $state, $stateParams, $ionicModal, patientService, popupService, $timeout) {
        var teamPid = $stateParams.teamPid;
        $scope.back = function() {
            $state.go('patientBaseInfo', $stateParams);
        };
        patientService.getPatientTagList(teamPid).success(function(data) {
            if (data.code == 200) {
                $scope.tagList = data.tagList;
            }
        });
        $scope.changeState = function(item) {
            if (item.isSelect == 0) {
                item.isSelect = 1;
            } else {
                item.isSelect = 0;
            }
        };
        $scope.saveTagInfo = function() {
            var tags = [];
            angular.forEach($scope.tagList, function(item, index) {
                if (item.isSelect == 1) {
                    tags.push(item.tagText);
                }
            });
            if (tags.length > 3) {
                popupService.open('最多只能选择3个标签!');
                return;
            }
            if (!tags.length) {
                popupService.open('未选择任何标签!');
                return;
            }
            var params = {
                teamPid: teamPid,
                tagText: tags
            };
            patientService.patientTagAdd(params).success(function(data) {
                if (data.code == 200) {
                    popupService.open('添加成功!');
                    $timeout(function() {
                        $state.go('patientBaseInfo', $stateParams);
                    }, 2000);
                }
            });
        };
        var tagModal = $ionicModal.fromTemplate(require('./tag-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openModal = function() {
            $scope.tagInfo = {};
            tagModal.show();
        };
        $scope.closeModal = function() {
            tagModal.hide();
        };
        $scope.$on('$destroy', function() {
            tagModal.remove();
        });
        $scope.addNewTag = function() {
            var tagInfo = $scope.tagInfo
            if (!tagInfo.tagText) {
                popupService.open('标签内容不能为空!');
                return;
            }
            tagInfo.isSelect = 0;
            $scope.tagList.push(tagInfo);
            tagModal.hide();
        };
    });
