// 开发环境

angular.module('app')

.config(function($stateProvider, $urlRouterProvider) {

    //----------------------------------- views 主功能页面 begin --------------------------------------
    $stateProvider


    // ----------------------------------- 账户 begin ------------------------------------

    // 登录
        .state('login', {
        cache: false,
        url: '/login',
        template: require('../views/login/login.html'),
        controller: 'LoginCtrl'
    })


    // ----------------------------------- 账户 end --------------------------------------

    // ----------------------------------- 首页 begin ------------------------------------
    // 首页
    .state('home', {
        cache: false,
        url: '/home',
        template: require('../views/home/detail/detail.html'),
        controller: 'HomeCtrl'
    })


    // ----------------------------------- 首页 end   ------------------------------------

    // ----------------------------------- 消息通知 begin --------------------------------
    // 消息通知
    .state('messages', {
        cache: false,
        url: '/messages',
        template: require('../views/messages/detail/detail.html'),
        controller: 'MessagesCtrl'
    })


    // ----------------------------------- 消息通知 end   --------------------------------

    // ----------------------------------- 患者 begin ------------------------------------
    // 患者
    .state('patients', {
        cache: false,
        url: '/patients?teamId&processId&tabIndex',
        template: require('../views/patients/list/list.html'),
        controller: 'PatientsCtrl'
    })


    // ----------------------------------- 患者 end   ------------------------------------
    // ----------------------------------- 入院患者列表 begin ------------------------------------
    .state('inpatientList',{
        cache:false,
        url:'/inpatient/list?teamId&dynamicTime&type',
        template:require('../views/home/patient/list.html'),
        controller:'InPatientListCtr'
    })
    // ----------------------------------- 入院患者列表 end   ------------------------------------
    // ----------------------------------- 团队患者动态 begin ------------------------------------
    .state('dynamicList',{
        cache:false,
        url:'/dynamic/list?dynamicTime',
        template:require('../views/home/dynamic/list.html'),
        controller:'DynamicLstCtr'
    })
    // ----------------------------------- 团队患者动态 end   ------------------------------------
    // ----------------------------------- 患者详情 begin ------------------------------------
    .state('patientInfo',{
        cache:false,
        url:'/patientInfo?teamPid&state&teamId&processId&nodeId&dynamicTime&type',
        template:require('../views/patients/details/details.html'),
        controller:'PatientInfoCtr'
    })
    // ----------------------------------- 患者详情 end   ------------------------------------
    // ----------------------------------- 患者详情 begin ------------------------------------
    .state('patientAdd',{
        cache:false,
        url:'/patient/add?teamId&processId&tabIndex',
        template:require('../views/patients/add/add.html'),
        controller:'PatientAddCtr'
    })
    // ----------------------------------- 患者详情 end   ------------------------------------
    // ----------------------------------- 患者搜索 begin ------------------------------------
    .state('patientSearch',{
        cache:false,
        url:'/patient/search?teamId&processId&tabIndex&nodeId',
        template:require('../views/patients/search/search.html'),
        controller:'PatientSearchCtr'
    })
    // ----------------------------------- 患者搜索 end   ------------------------------------
    // ----------------------------------- 患者基本信息 begin ------------------------------------
    .state('patientBaseInfo',{
        cache:false,
        url:'/patient/baseInfo?teamPid&state&teamId&processId&nodeId&dynamicTime&type',
        template:require('../views/patients/baseInfo/baseInfo.html'),
        controller:'PatientBaseInfoCtr'
    })
    // ----------------------------------- 患者基本信息 end   ------------------------------------
    // ----------------------------------- 标签 begin ------------------------------------
    .state('patientTag',{
        cache:false,
        url:'/patient/tag?teamPid&state&teamId&processId&nodeId&dynamicTime&type',
        template:require('../views/patients/tag/tag.html'),
        controller:'PatientTagCtr'
    })
    // ----------------------------------- 标签 end   ------------------------------------
    // ----------------------------------- 查房 begin ------------------------------------
    .state('patientRound',{
        cache:false,
        url:'/patient/round?teamId&processId&tabIndex',
        template:require('../views/patients/round/round.html'),
        controller:'PatientRoundCtr'
    })
    // ----------------------------------- 查房 end   ------------------------------------
    // ----------------------------------- 安排住院 begin ------------------------------------
    .state('patientInhospital',{
        cache:false,
        url:'/patient/inhospital?teamId&nodeId&processId&tabIndex',
        template:require('../views/patients/inhospital/inhospital.html'),
        controller:'PatientInhospitalCtr'
    })
    // ----------------------------------- 安排住院 end   ------------------------------------
    // ----------------------------------- 删除病人 begin ------------------------------------
    .state('patientDelete',{
        cache:false,
        url:'/patient/delete?teamId&processId&tabIndex',
        template:require('../views/patients/delete/delete.html'),
        controller:'PatientDeleteCtr'
    })
    // ----------------------------------- 删除病人 end   ------------------------------------
    // ----------------------------------- 入组 begin ------------------------------------
    .state('patientIngroup',{
        cache:false,
        url:'/patient/ingroup?teamId&processId&tabIndex',
        template:require('../views/patients/ingroup/ingroup.html'),
        controller:'PatientInGroupCtr'
    })
    // ----------------------------------- 入组 end   ------------------------------------
    // ----------------------------------- 安排手术 begin ------------------------------------
    .state('patientOperation',{
        cache:false,
        url:'/patient/operation?teamId&processId&tabIndex&nodeId',
        template:require('../views/patients/operation/operation.html'),
        controller:'PatientOperationCtr'
    })
    // ----------------------------------- 安排手术 end   ------------------------------------
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('home');
});
