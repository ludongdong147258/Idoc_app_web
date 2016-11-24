require('./list.scss');
angular.module('app.controllers')
    .controller('DynamicLstCtr', function($rootScope, $scope, $state, patientService, errorHandler,$stateParams) {
        $scope.back = function() {
            $state.go('home');
        };
        var obj = {
            getNowStr: function(date) {
                return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
            },
            loadData:function(dynamicTime){
                patientService.getDynamicForPatient(dynamicTime).success(function(data) {
                    if (data.code == 200) {
                        $scope.patientDynamicList = data.teamPatientDynamicList;
                    }
                }).error(errorHandler());
            }
        };
        var now = new Date();
        if($stateParams.dynamicTime) {
            now = new Date(parseInt($stateParams.dynamicTime));
        }
        $scope.displayDate = obj.getNowStr(now);
        var dateStr = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        var dynamicTime = (new Date(dateStr)).getTime();
        obj.loadData(dynamicTime);
        $scope.timeStamp = dynamicTime; // 时间戳
        $scope.selectDate = function() {
            angular.element(document.getElementById('patTimerPicker')).click();
        };
        var isOk = false;
        $scope.callback = function(data) {
            isOk = true;
            $scope.day = {
             today : (new Date(data).toDateString())
            };
            angular.element(document.getElementById('dateSlider')).click();
            var date = new Date(data);
            $scope.displayDate = obj.getNowStr(date);
            var dynamicTime = date.getTime();
            $scope.timeStamp = dynamicTime;
            obj.loadData(dynamicTime);
        };
        $scope.day = {
          today : (new Date()).toDateString(),
          start:(new Date()).toDateString()
        };
        if($stateParams.dynamicTime && !isOk) {
            $scope.day = {
              today : (new Date(parseInt($stateParams.dynamicTime))).toDateString()
            };
        }
        $scope.selectedDay = $scope.day.today;
        $scope.setDate = function(day,event) {
          event.stopPropagation();
          $scope.day.today = day;
          $scope.selectedDay = day;
          var date = new Date(day);
          $scope.displayDate = obj.getNowStr(date);
          var dynamicTime = date.getTime();
          $scope.timeStamp = dynamicTime;
          obj.loadData(dynamicTime);
        };
    });
