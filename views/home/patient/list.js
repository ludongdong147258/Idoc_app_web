require('./list.scss');

angular.module('app.controllers')
    .controller('InPatientListCtr', function($rootScope, $scope, $state, patientService, $stateParams,errorHandler) {
        var teamId = $stateParams.teamId,
            dynamicTime = $stateParams.dynamicTime,
            type = parseInt($stateParams.type);
        var typeStr = '';
        switch (type) {
            case 1:
                typeStr = '入院';
                break;
            case 2:
                typeStr = '手术';
                break;
            case 3:
                typeStr = '出院';
                break;
        }
        var date = new Date(parseInt(dynamicTime)),
            month = date.getMonth() + 1,
            day = date.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        dateStr = date.getFullYear() + '/' + month + '/' + day;
        $scope.pageTitle = dateStr + typeStr;
        // 返回
        $scope.back = function() {
            $state.go('dynamicList', {
                dynamicTime: dynamicTime
            });
        };
        var obj = {
            convertDate: function(date) {
                var year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                return year + '-' + month + '-' + day;
            },
            getAddress: function(bedInfo) {
                if(bedInfo.buildingText) {
                    var prefix = bedInfo.isBook == '1' ? '预定:' : '';
                    return prefix + bedInfo.buildingText + bedInfo.floorNum + bedInfo.roomNum + '-' + bedInfo.bedNum;
                }else{
                    return '';
                }
            }
        };
        patientService.getDynamicForPatientList(teamId, dynamicTime, type).success(function(data) {
            if (data.code == 200) {
                $scope.teamPatientList = data.teamPatientList;
                angular.forEach($scope.teamPatientList, function(item, index) {
                    var gender;
                    switch (item.gender) {
                        case '1':
                            gender = '男';
                            break;
                        case '2':
                            gender = '女';
                            break;
                        case '3':
                            gender = '未知';
                            break;
                    }
                    item.gender = gender;
                    if(item.optTime) {
                        var optTime = new Date(parseInt(item.optTime) * 1000);
                        item.optTime = obj.convertDate(optTime);
                    }
                    if(item.goHosTime) {
                        var goHosTime = new Date(parseInt(item.goHosTime)*1000);
                        item.goHosTime = obj.convertDate(goHosTime);
                    }
                    if(item.leaveTime) {
                        var leaveTime = new Date(parseInt(item.leaveTime)*1000);
                        item.leaveTime = obj.convertDate(leaveTime);
                    }
                    item.address = obj.getAddress(item.bedInfo);
                });
            }
        }).error(errorHandler());
        $scope.goToPatientInfo = function(item) {
            var params = angular.extend({teamPid:item.teamPid,state:'inpatientList'},$stateParams);
            $state.go('patientInfo',params)
        };
    });
