angular.module('app.controllers')
    .factory('PatientService', function() {
        var service = {
            patientList: [],
            patientParams: {},
            processNodeList:[],
            setPatientList: function(selectedPatientList) {
                this.patientList = selectedPatientList;
            },
            getPatientList: function() {
                return this.patientList;
            },
            setPatientsParams: function(params) {
                this.patientParams = params;
            },
            getPatientsParams: function() {
                return this.patientParams;
            },
            getProcessNodeList:function(){
                return this.processNodeList;
            },
            setProcessNodeList:function(processNodeList) {
                this.processNodeList = processNodeList;
            }
        };
        return service;
    });
