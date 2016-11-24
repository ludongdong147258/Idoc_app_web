/**
 * 首页相关业务
 */
angular.module('app.services')
    .factory('homeService', function(apiService, localStorageService) {

        var TASK_FOR_DOCTOR = 'task/listForDoctorIndex';
        var FINISHI_TASK = 'task/finishForTeam';
        var DYNAMIC_FOR_DOCTOR = 'team/dynamicForDoctor';

        return {
            // 我的任务列表
            getTaskForDoctorList: function() {
                return apiService.post(TASK_FOR_DOCTOR, {});
            },
            // 完成任务
            finishiTask: function(doctorTaskId) {
                return apiService.post(FINISHI_TASK, {
                    teamTaskIds: doctorTaskId
                });
            },
            // 团队动态
            getDynamicForDoctorList: function() {
                return apiService.post(DYNAMIC_FOR_DOCTOR, {
                });
            }
        };
    });
