/**
 * 患者相关业务
 */
angular.module('app.services')
    .factory('patientService', function(apiService, localStorageService) {

        var DYNAMIC_FOR_PATIENT = 'team/dynamicForPatient';
        var DYNAMIC_FOR_PATIENT_LIST = 'team/dynamicForPatientList';
        var INFO_FOR_PATIENT = 'patient/infoForPatient';
        var WORDS_ADD = 'patient/processWordAdd';
        var PROCESS_CHANGE = 'patient/processChange';
        var PROCESS_END = 'patient/processEnd';
        var SELECT_LIST = 'select/list';
        var PATIENT_ADD_OR_UPDATE = 'patient/addOrUpdate';
        var PATIENT_TAG_LIST = 'patient/tagList';
        var PATIENT_TAG_ADD = 'patient/tagAdd';
        var SEARCH_PATIENT_LIST = 'patient/list';
        var PATIENT_PROCESS_EVENT_ADD = 'patient/processEventAdd';
        var PATIENT_INHOSPITAL_PLAN = 'patient/inHosPlan';
        var TASK_LIST = 'task/taskForTeamList';
        var PATIENT_DEL_FROM_TEAM = 'patient/delFromTeam';
        var TEAM_BED_ADD = 'team/bedAdd';
        var TEAM_RESEARCH_LIST = 'team/researchList';
        var PATIENT_IN_GROUP = 'patient/inGroup';
        var PATIENT_OPT_PLAN = 'patient/optPlan';
        var VIEW_PROCESS_NOTICE = 'patient/processNoticeInfo';
        var VIEW_PROCESS_WORDSINFO = 'patient/processWordInfo';
        var VIEW_PROCESS_TASKINFO = 'patient/processTaskinfo';
        var PHONE_CODE_SEND = 'phoneCode/send';
        var PATIENT_ADD_FROM_USER = 'patient/addFromUser';
        var PROCESS_NODE_MOVE = 'patient/processNodeMove';
        var FILE_UPLOAD = 'file/upload';
        return {
            // 患者动态
            getDynamicForPatient: function(dynamicTime) {
                return apiService.post(DYNAMIC_FOR_PATIENT, {
                    dynamicTime: dynamicTime / 1000
                });
            },
            getDynamicForPatientList: function(teamId, dynamicTime, type) {
                return apiService.post(DYNAMIC_FOR_PATIENT_LIST, {
                    teamId: teamId,
                    dynamicTime: dynamicTime / 1000,
                    type: type
                });
            },
            getPatientInfo: function(teamPid) {
                return apiService.post(INFO_FOR_PATIENT, {
                    teamPid: teamPid
                });
            },
            addWords: function(params) {
                return apiService.post(WORDS_ADD, params);
            },
            changeProgress: function(teamPid, detailId) {
                return apiService.post(PROCESS_CHANGE, {
                    teamPid: teamPid,
                    detailId: detailId
                });
            },
            stopProgress: function(teamPid) {
                return apiService.post(PROCESS_END, {
                    teamPid: teamPid
                });
            },
            getDoctorList: function(teamId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 1004,
                        teamId: teamId
                    }]
                });
            },
            getTeamList: function() {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 1001
                    }]
                });
            },
            getProcessList: function(teamId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 1002,
                        teamId: teamId
                    }]
                });
            },
            getProcessDetailsList: function(teamId, processId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 1003,
                        teamId: teamId,
                        processId: processId
                    }]
                });
            },
            getNoPatientBedList: function(teamId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 1005,
                        teamId: teamId
                    }]
                });
            },
            getOptSiteList:function(){
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 2004
                    }]
                });
            },
            getOptTypeList:function(siteIds,teamId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 2013,
                        siteIds:siteIds,
                        teamId:teamId
                    }]
                });
            },
            getOptMaterialList:function(optTypeIds,teamId) {
                return apiService.post(SELECT_LIST, {
                    selectList: [{
                        type: 2014,
                        optTypeIds:optTypeIds,
                        teamId:teamId
                    }]
                });
            },
            patientAddOrUpdate: function(params) {
                return apiService.post(PATIENT_ADD_OR_UPDATE, params);
            },
            getPatientTagList: function(teamPid) {
                return apiService.post(PATIENT_TAG_LIST, {
                    teamPid: teamPid
                });
            },
            patientTagAdd: function(params) {
                return apiService.post(PATIENT_TAG_ADD, params);
            },
            searchPatientList: function(params) {
                return apiService.post(SEARCH_PATIENT_LIST, params);
            },
            // 查房
            finishRoundTask: function(params) {
                return apiService.post(PATIENT_PROCESS_EVENT_ADD, params);
            },
            // 入院
            patientInHospital: function(params) {
                return apiService.post(PATIENT_INHOSPITAL_PLAN, params);
            },
            getTaskList: function(teamId) {
                return apiService.post(TASK_LIST, {
                    teamId: teamId
                });
            },
            // 删除病人
            deletePatients:function(params){
                return apiService.post(PATIENT_DEL_FROM_TEAM, params);
            },
            // 添加床位
            addTeamBed:function(params){
                return apiService.post(TEAM_BED_ADD, params);
            },
            // 团队研究列表
            getTeamResearchList:function(params) {
                return apiService.post(TEAM_RESEARCH_LIST, params);
            },
            // 入组
            patientIngroup:function(params) {
                return apiService.post(PATIENT_IN_GROUP,params);
            },
            // 安排手术
            addOperation:function(params) {
                return apiService.post(PATIENT_OPT_PLAN,params);
            },
            // 查看须知
            viewNotice:function(params) {
                return apiService.post(VIEW_PROCESS_NOTICE,params);
            },
            // 查看文字
            viewWords:function(params){
                return apiService.post(VIEW_PROCESS_WORDSINFO,params);
            },
            // 查看任务
            viewTask:function(params) {
                return apiService.post(VIEW_PROCESS_TASKINFO,params);
            },
            // 获取验证码
            getPhoneCode:function(params){
                return apiService.post(PHONE_CODE_SEND,params);
            },
            // 添加已有患者
            addFromUser:function(params) {
                return apiService.post(PATIENT_ADD_FROM_USER,params);
            },
            moveNode:function(params){
                return apiService.post(PROCESS_NODE_MOVE,params);
            },
            uploadFile:function(params) {
                return apiService.post(FILE_UPLOAD,params);
            }
        };
    });
