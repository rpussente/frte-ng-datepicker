(function () {
    'use strict';

    angular.module('frte.datepicker', []);

    angular.module('frte.datepicker')
        .directive('frteDatepicker', ['$timeout', Datepicker]);

    function Datepicker($timeout) {
        return {
            restrict: 'E',

            scope: {
                id: '@',
                date: '=ngModel',
                name: '@',
                format: '@',
                isRequired: '=',
                minviewmode: '@',
                startdate: '@',
                enddate: '@',
                fnChange: '@',
                isDisabled: '=',
                lowerLimit: '=',
                upperLimit: '='
            },
            require: 'ngModel',
            template: '<input id="{{tplId}}" class="form-control" data-date-format="{{tplFormat}}" \
                        data-date-language="pt-BR" data-date-autoclose="true" \
data-date-start-date="{{startdate}}" \
data-date-end-date="{{enddate}}" \
data-date-min-view-mode="{{tplMinviewmode}}" \
data-ng-disabled="isDisabled" \
ng-required="isRequired"> \
</input>',

            link: link
        };

        function link($scope, element, attrs, ngModelCtrl) {
            var datepicker;

            function setRequiredValidity(date, isRequired) {
                isRequired = isRequired || $scope.isRequired;
                ngModelCtrl.$setValidity('required', !!date || !isRequired);
            }

            function changeDate(date) {
                ngModelCtrl.$setViewValue(date);

                if (attrs.fnChange) {
                    $scope.$parent.$eval(attrs.fnChange);
                }
            }

            function configureDatepicker(datepicker) {
                datepicker.on('clearDate', function (event) {
                    changeDate(null);
                });

                datepicker.on('changeDate', function (event) {
                    changeDate(event.date);
                });
            }

            $scope.tplId = $scope.id || $scope.name;
            $scope.tplName = $scope.name || $scope.id;
            $scope.tplFormat = $scope.format || "dd/mm/yyyy";
            $scope.tplMinviewmode = $scope.minviewmode || "days";

            ngModelCtrl.$render = function() {
                if (!datepicker) {
                    return;
                }
                var viewValue = ngModelCtrl.$viewValue;

                if (viewValue) {
                    datepicker.datepicker('update', moment(viewValue).toDate());
                } else {
                    datepicker.datepicker('update', null);
                }
            };

            ngModelCtrl.$parsers.push(function (value) {
                setRequiredValidity(value);
                return value;
            });

            ngModelCtrl.$formatters.push(function (value) {
                setRequiredValidity(value);
                return value;
            });

            $scope.$watch('isRequired', function (value) {
                setRequiredValidity($scope.date, value);
            });

            $scope.$watch('lowerLimit', function (date) {
                if (date && datepicker) {
                    datepicker.datepicker('setStartDate', moment(date).toDate());
                }
            });

            $scope.$watch('upperLimit', function (date) {
                if (date && datepicker) {
                    datepicker.datepicker('setEndDate', moment(date).toDate());
                }
            });

            $timeout(function () {
                // datepicker must be created inside $timeout
                datepicker = element.find('input').datepicker();

                configureDatepicker(datepicker);
            });
        }
    }
})();
