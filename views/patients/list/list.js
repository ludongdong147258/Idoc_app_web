require('./list.scss');
require('./team-modal.scss');
angular.module('app.controllers')
    .controller('PatientsCtrl', function($rootScope, $scope, $state,
        $ionicModal, $templateCache, $timeout, $ionicHistory, errorHandler,
        patientService, popupService, PatientService, $stateParams) {
        $scope.selectedPatientList = [];
        $scope.isEdit = false;
        $scope.editText = $scope.isEdit ? '完成' : '编辑';
        $scope.hasMoreData = false;
        $scope.displayStates = [true, false, false, false, false, false];
        $scope.patientList = [];
        var pageIndex = 1,
            pageSize = 10,
            teamId, processId, nodeId = -1,
            curTabIndex = 0;
        $scope.curTeam = {
            k: '',
            v: '选择团队'
        };
        $scope.curProcess = {
            k: '',
            v: '选择基本流程'
        };
        $scope.callback = function(data) {
            if (data) {
                var teamPids = [];
                var tempId = '';
                angular.forEach($scope.selectedPatientList, function(item, index) {
                    if(tempId != item.teamPid) {
                        tempId = item.teamPid;
                        teamPids.push(item.teamPid);
                    }
                });
                var time = (new Date(data)).getTime() / 1000;
                var params = {
                    nodeId: $scope.curNodeInfo.k,
                    teamPids: teamPids.toString(),
                    nodeTimeValue: time,
                };
                patientService.moveNode(params).success(function(data) {
                    $scope.doRefresh();
                }).error(errorHandler());
            }
        };

        // if($stateParams.teamId) {
        //     teamId = $stateParams.teamId;
        // }
        // if($stateParams.processId) {
        //     processId = $stateParams.processId;
        // }
        // if($stateParams.tabIndex) {
        //     curTabIndex = $stateParams.tabIndex;
        // }
        var obj = {
            validateInput: function() {
                if (!$scope.curTeam.k) {
                    popupService.open('请选择团队!');
                    return false;
                }
                if (!$scope.curProcess.k) {
                    popupService.open('请选择基本流程!');
                    return false;
                }
                if (!$scope.curNodeInfo) {
                    popupService.open('该流程没有节点!');
                    return false;
                }
                // var patientParams = {
                //     teamInfo:$scope.curTeam,
                //     processInfo:$scope.curProcess
                // };
                // PatientService.setPatientsParams(patientParams);
                return true;
            },
            getParams: function() {
                return {
                    teamId: $scope.curTeam.k,
                    processId: $scope.curProcess.k,
                    nodeId: $scope.curNodeInfo.k,
                    tabIndex: curTabIndex
                }
            },
            loadList: function(patParams) {
                var that = this;
                var params = {
                    teamId: patParams.teamId,
                    processId: patParams.processId,
                    nodeId: patParams.nodeId,
                    pageNo: pageIndex,
                    pageSize: pageSize,
                    sk: 0
                };
                patientService.searchPatientList(params).success(function(data) {
                    if (params.nodeId == -1) {
                        curTabIndex = 0;
                        angular.forEach($scope.displayStates, function(item, index) {
                            $scope.displayStates[index] = false;
                        });
                        $scope.displayStates[curTabIndex] = true;
                        $scope.processNodeList = data.processNodeList;
                        PatientService.setProcessNodeList(data.processNodeList);
                        $scope.curNodeInfo = {
                            k: $scope.processNodeList[0].nodeId,
                            v: $scope.processNodeList[0].linkName,
                            tabIndex: curTabIndex
                        };
                    }
                    that.setPatParams();
                    $scope.patientList = $scope.patientList.concat(data.patientList);
                    angular.forEach($scope.patientList, function(item, index) {
                        item.isSelected = false;
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
                }).error(errorHandler()).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            },
            hasSetPatientList: function() {
                var flag = false;
                if ($scope.selectedPatientList.length) {
                    PatientService.setPatientList($scope.selectedPatientList);
                    flag = true;
                    var patientParams = {
                        teamInfo: $scope.curTeam,
                        processInfo: $scope.curProcess,
                        nodeInfo: $scope.curNodeInfo
                    };
                    PatientService.setPatientsParams(patientParams);
                } else {
                    popupService.open('未选择任何患者!');
                }
                return flag;
            },
            setPatParams: function() {
                var patientParams = {
                    teamInfo: $scope.curTeam,
                    processInfo: $scope.curProcess,
                    nodeInfo: $scope.curNodeInfo
                };
                PatientService.setPatientsParams(patientParams);
            }
        };
        // 从缓存中取团队信息和流程信息
        $scope.processNodeList = PatientService.getProcessNodeList();
        var patParams = PatientService.getPatientsParams();
        if (patParams.teamInfo && patParams.processInfo && patParams.nodeInfo) {
            $scope.curTeam = patParams.teamInfo;
            if ($scope.curTeam.k) {
                $scope.team = $scope.curTeam;
            }
            $scope.curProcess = patParams.processInfo;
            if ($scope.curProcess.k) {
                $scope.process = $scope.curProcess;
            }
            $scope.curNodeInfo = patParams.nodeInfo;
            curTabIndex = patParams.nodeInfo.tabIndex;
            angular.forEach($scope.displayStates, function(item, index) {
                $scope.displayStates[index] = false;
            });
            $scope.displayStates[curTabIndex] = true;
            var patParams = {
                teamId: $scope.curTeam.k,
                processId: $scope.curProcess.k,
                nodeId: $scope.curNodeInfo.k
            }
            obj.loadList(patParams);
        } else {
            // 查询团队列表和流程列表(默认)
            patientService.getTeamList().success(function(data) {
                $scope.teamList = data.teamList;
                if (data.teamList.length > 0) {
                    $scope.curTeam = data.teamList[0];
                    if ($scope.curTeam.k) {
                        $scope.team = $scope.curTeam;
                    }
                    patientService.getProcessList($scope.curTeam.k).success(function(data) {
                        $scope.processList = data.teamProcessList;
                        if (data.teamProcessList.length > 0) {
                            $scope.curProcess = data.teamProcessList[0];
                            if ($scope.curProcess.k) {
                                $scope.process = $scope.curProcess;
                            }
                            var patParams = {
                                teamId: $scope.curTeam.k,
                                processId: $scope.curProcess.k,
                                nodeId: -1
                            }
                            obj.loadList(patParams);
                        }
                    }).error(errorHandler());
                }
            }).error(errorHandler());
        }

        $scope.changeTab = function(tabIndex, curNodeItem) {
            curTabIndex = tabIndex;
            angular.forEach($scope.displayStates, function(item, index) {
                $scope.displayStates[index] = false;
            });
            $scope.displayStates[tabIndex] = true;
            $scope.curNodeInfo = {
                k: curNodeItem.nodeId,
                v: curNodeItem.linkName,
                tabIndex: tabIndex
            };
            pageIndex = 1;
            $scope.hasMoreData = false;
            if ($scope.patientList) {
                $scope.patientList.length = [];
            }
            var params = {
                teamId: $scope.curTeam.k,
                processId: $scope.curProcess.k,
                nodeId: $scope.curNodeInfo.k
            };
            obj.loadList(params);
        };
        $scope.laodMore = function() {
            pageIndex++;
            var params = {
                teamId: $scope.curTeam.k,
                processId: $scope.curProcess.k,
                nodeId: $scope.curNodeInfo.k
            };
            obj.loadList(params);
        };

        // var paramInfo = PatientService.getPatientsParams();
        // if(paramInfo.teamInfo) {
        //     $scope.curTeam = paramInfo.teamInfo;
        // }
        // if(paramInfo.processInfo) {
        //     $scope.curProcess = paramInfo.processInfo;
        // }
        var teamModal = $ionicModal.fromTemplate(require('./select-team-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openTeamModal = function() {
            patientService.getTeamList().success(function(data) {
                $scope.teamList = data.teamList;
                // if(!$scope.curTeam.k) {
                //     $scope.team = $scope.curTeam;
                // }
                // if($scope.curProcess.k) {
                //     $scope.process = $scope.curProcess;
                // }
            }).error(errorHandler());
            teamModal.show();
        };
        $scope.closeTeamModal = function() {
            teamModal.hide();
        };
        $scope.$on('$destroy', function() {
            teamModal.remove();
        });
        $scope.data = {};
        $scope.showTeam = false;
        $scope.showTeamList = function() {
            $scope.showTeam = !$scope.showTeam;
        };
        $scope.hideTeamList = function() {
            $scope.showTeam = false;
        };

        $scope.selectTeam = function(item) {
            $scope.showTeam = false;
            $scope.team = item;
            patientService.getProcessList($scope.team.k).success(function(data) {
                $scope.processList = data.teamProcessList;
                if (!$scope.processList.length) {
                    $scope.process = {};
                }
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
            $scope.showProcess = false;
            $scope.process = item;
        };
        $scope.complete = function() {
            if (!$scope.team.k) {
                popupService.open('请选择团队!');
                return;
            }
            if (!$scope.process.k) {
                popupService.open('请选择基本流程!');
                return;
            }
            $scope.curTeam = $scope.team;
            $scope.curProcess = $scope.process;
            if ($scope.curProcess.v.length > 10) {
                $scope.curProcess.v = $scope.curProcess.v.substr(0, 10) + '...';
            }
            // var patientParams = {
            //     teamInfo:$scope.curTeam,
            //     processInfo:$scope.curProcess
            // };
            // PatientService.setPatientsParams(patientParams);
            teamModal.hide();
            var nodeItem = {
                nodeId: '-1'
            };
            $scope.changeTab(curTabIndex, nodeItem);
        };

        $scope.goToSearch = function() {
            var flag = obj.validateInput();
            if (flag) {
                $state.go('patientSearch', obj.getParams());
            }
        };
        $scope.goToAddPatient = function() {
            var flag = obj.validateInput();
            if (flag) {
                $state.go('patientAdd', obj.getParams());
            }
        };
        $scope.showEditList = function() {
            $scope.isEdit = !$scope.isEdit;
            if ($scope.isEdit) {
                $scope.editText = '完成';
            } else {
                $scope.editText = '编辑';
            }
        };
        $scope.addSelectedItem = function(item) {
            var patientList = $scope.selectedPatientList;
            if (item.isSelected) {
                patientList.push(item);
            } else {
                for (var i = 0; i < patientList.length; i++) {
                    var curItem = patientList[i];
                    if (curItem.teamPid == item.teamPid) {
                        patientList.splice(i, 1);
                        break;
                    }
                }
            }
        };
        $scope.goToPatientRound = function() {
            if (obj.hasSetPatientList()) {
                $state.go('patientRound', obj.getParams());
            }
        };
        $scope.goToDelete = function() {
            if (obj.hasSetPatientList()) {
                $state.go('patientDelete', obj.getParams());
            }
        };
        $scope.goToIngroup = function() {
            if (obj.hasSetPatientList()) {
                $state.go('patientIngroup', obj.getParams());
            }
        };
        $scope.doRefresh = function() {
            $scope.isEdit = false;
            $scope.editText = '编辑';
            pageIndex = 1;
            $scope.hasMoreData = false;
            if ($scope.patientList) {
                $scope.patientList.length = [];
            }
            var params = {
                teamId: $scope.curTeam.k,
                processId: $scope.curProcess.k,
                nodeId: $scope.curNodeInfo.k
            };
            obj.loadList(params);
        };
        $scope.goToTargetUrl = function(item) {
            if (obj.hasSetPatientList()) {
                var nodeType = item.nodeType;
                switch (nodeType) {
                    case "300": // 安排入院
                        $state.go('patientInhospital', obj.getParams());
                        break;
                    case "400": // 安排手术
                        $state.go('patientOperation', obj.getParams());
                        break;
                    default:
                        if (item.nodeTimeType == 1 || item.nodeTimeType == 2) {
                            angular.element(document.getElementById("timerPicker")).click();
                        } else {
                            var numTitle = '';
                            switch (parseInt(item.nodeTimeType)) {
                                case 3:
                                    numTitle = '添加天数';
                                    break;
                                case 4:
                                    numTitle = '添加周数';
                                    break;
                                case 5:
                                    numTitle = '添加月数';
                                    break;
                                case 6:
                                    numTitle = '添加年数';
                                    break;
                            }
                            $scope.numTitle = numTitle;
                            angular.element(document.getElementById("numPicker")).click();
                        }
                        break;
                }
            }
        };
        $scope.getSelectNum = function(num) {
            var teamPids = [];
            var tempId = '';
            angular.forEach($scope.selectedPatientList, function(item, index) {
                if(tempId != item.teamPid) {
                    tempId = item.teamPid;
                    teamPids.push(item.teamPid);
                }
            });
            var params = {
                nodeId: $scope.curNodeInfo.k,
                teamPids: teamPids.toString(),
                nodeTimeValue: num,
            };
            patientService.moveNode(params).success(function(data) {
                $scope.doRefresh();
            }).error(errorHandler());
        };
    });
