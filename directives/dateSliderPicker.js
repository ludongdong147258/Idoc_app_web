angular.module('app.directives')
.directive('dateSliderPicker',['$compile',function($compile){

  return {
    restrict : 'E',
    link : function($scope,$elem,$attrs) {

      var monthDays = ['日','一','二','三','四','五','六'],
          onSelectDate = $attrs.onSelectDate,
          dateVar = $attrs.dateSelectVar,
          valueToWatch,
          configObj,
          dateStart = $attrs.dateStart,
          totalDays = ($attrs.totalDays && parseInt($attrs.totalDays)) || 90;

      if(dateVar) {
        initSelectedDate();
      }

      configObj = {
        totalDays : totalDays
      };

      function initSelectedDate() {

        var splitted = dateVar.split('.');

        if(splitted.length > 0) {
          valueToWatch = formatKeys(splitted);
        } else {
          valueToWatch = $scope.$eval(dateVar);
        }

      }

      if(!(onSelectDate)) {
        onSelectDate = function() {};
      }

      function formatKeys(key) {

        var props = key,
            len = props.length,
            index,
            obj = {},
            currKey;

        for(index = 0; index < len; index++) {
          currKey = props[index];
          obj = obj[currKey] ? obj[currKey] : $scope[currKey];
        }

        return obj;
      }

      function getKeys() {

        var arr = [],
            obj = this;

        for(var i in obj) {
          if(obj.hasOwnProperty(i)) {
            arr.push(i);
          }
        }

        return arr;
      }

      function daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
      }

      function generateDays() {
        // var date = new Date();
        if($scope.day.today) {
            date = new Date($scope.day.today);
        }
        var month = date.getMonth(),
            year = date.getFullYear(),
            days = daysInMonth((month + 1),year),
            totalDays = configObj.totalDays,
            currYear = date.getFullYear(),
            currMonth = date.getMonth(),
            dates = [],
            today = date.getDate(),
            counter = today,
            currDay = date.getDay(),
            calendar = [],
            index,
            dateObj,
            template;

        for(index = 1; index <= totalDays; index++) {

          if(counter > days) {
            counter = 1;
            currMonth = (currMonth === 11) ? 0 : (currMonth + 1);
            currYear = (currMonth === 0) ? (currYear + 1 ) : currYear;
            days = daysInMonth((currMonth + 1),currYear);
          }

          dateObj = {
            date : counter,
            month : monthDays[currDay],
            fullDay : (new Date(currYear, currMonth, counter)).toDateString()
          };

          counter++;
          currDay++;

          if(currDay === 7) {
            currDay = 0;
          }

          dates.push(dateObj);

        }

        counter = 0;

        for(var i=0;i<totalDays;i++) {

          if ((i+1)%7 === 0) {
            counter += 1;
          }

          calendar[counter] = calendar[counter] || [];
          calendar[counter].push(dates[i]);

          if(valueToWatch === dates[i].fullDay) {
            $scope.activeSlide = counter;
          }

        }

        return calendar;
      }

      function isActive(day) {
        initSelectedDate();
        return valueToWatch === day;
      }
      function init() {
          $scope.isActive = isActive;
          $scope.calendar = generateDays();
        template = "<ion-slide-box on-slide-changed=\"slideHasChanged($index)\" show-pager=\"false\" active-slide=\"activeSlide\"><ion-slide ng-repeat=\"week in calendar\"><div class=\"row row-center\"><div ng-repeat=\"day in week\" class=\"col\">{{day.month}}</div></div><div class=\"row row-center\"><div ng-repeat=\"day in week\" ng-click=" + onSelectDate + '(day.fullDay,$event)' + " class=\"col\"><span ng-class=\"{'active' : isActive(day.fullDay)}\">{{day.date}}</span></div></div></div></div></ion-slide></ion-slide-box>";
          template = $compile(template)($scope);

          $elem.html(template);
      }
      init();
      $elem.on('click',function(event){
          if(event.target.className == 'slider-picker') {
              initSelectedDate();
              init();
          }
      });
    }
  };

}]);
