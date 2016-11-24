require('./ingroup.scss');
angular.module('app.controllers')
    .controller('PatientInGroupCtr', function($rootScope, $scope, $state, $ionicModal, errorHandler, popupService, patientService, $stateParams, $timeout, PatientService) {
        var patientParams = {
            teamId: $stateParams.teamId,
            processId: $stateParams.processId,
            tabIndex: $stateParams.tabIndex
        };
        var curItem, curSubItem;
        var inGroupPatList = PatientService.getPatientList();
        $scope.back = function() {
            $state.go('patients', patientParams);
        };
        var params = {
            teamId: patientParams.teamId,
            pageNo: 1,
            pageSize: 10
        };
        patientService.getTeamResearchList(params).success(function(data) {
            $scope.researchList = data.researchList;
            angular.forEach($scope.researchList, function(item, index) {
                item.isSelected = false;
                angular.forEach(item.detailList, function(subItem, subIndex) {
                    subItem.isSelected = false;
                    subItem.itemList = item.detailList;
                });
            });
        }).error(errorHandler());
        $scope.selectParent = function(item) {
            if (item.isSelected) {
                curItem = item;
                angular.forEach($scope.researchList, function(researchItem, index) {
                    if(researchItem.teamResearchId != item.teamResearchId) {
                        researchItem.isSelected = false;
                        angular.forEach(researchItem.detailList,function(subItem,subIndex){
                            subItem.isSelected = false;
                        });
                    }
                });
            }else {
                angular.forEach(item.detailList,function(subItem,subIndex){
                    subItem.isSelected = false;
                });
            }
        };
        $scope.selectChild = function(subItem) {
            if (subItem.isSelected) {
                curSubItem = subItem;
                angular.forEach(subItem.itemList,function(item,index){
                    if(item.detailId != subItem.detailId) {
                        item.isSelected = false;
                    }
                });
            }
        };
        $scope.addIngroup = function() {
            if(!curItem){
                popupService.open('请选择需要入的组!');
                return;
            }
            if(!curSubItem) {
                popupService.open('请选择入组流程!');
                return;
            }
            var teamPids = [];
            angular.forEach(inGroupPatList, function(item, index) {
                teamPids.push(item.teamPid);
            });
            var params = {
                teamPids: teamPids,
                teamResearchId: curItem.teamResearchId,
                detailId: curSubItem.detailId
            };
            patientService.patientIngroup(params).success(function(data) {
                popupService.open('入组成功!');
                $timeout(function() {
                    $state.go('patients', patientParams);
                }, 2000);
            }).error(errorHandler());
        };
    });
