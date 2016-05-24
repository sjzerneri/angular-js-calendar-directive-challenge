angular.module('calendarDemoApp', [])
    .controller('MainCtrl', function ($scope) {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();

        $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        $scope.date = {
            year: year,
            month: month
        };

        $scope.isCurrentMonth = function (date) {
            return date.getMonth() == $scope.date.month;
        }

        var years = [];

        var earliestYear = year - 100;
        for (var i = earliestYear; i <= year; i++) {
            years.push(i);
        }

        $scope.years = years;

        $scope.$watchCollection('date', function (date) {
            $scope.currentDate = new Date(date.year, date.month, 1);
        });
    })
    .directive('myCalendar', function () {
        return {
            terminal: true,
            priority: 1000,
            transclude: 'element',
            link: function (scope, element, attrs, ctrl, transclude) {
                var containerScope = scope.$new();
                var container = angular.element('<div></div>');
                container.addClass('calendar-container');
                element.after(container);

                scope.$watch(attrs.myCalendar, function (date) {
                    if (!date) return;

                    var range = CalendarRange.getMonthlyRange(date);

                    containerScope.$destroy();
                    containerScope = scope.$new();
                    container.html('');

                    angular.forEach(range.days, function (day) {
                        var newScope = containerScope.$new();
                        newScope.day = day;
                        transclude(newScope, function (newElement) {
                            newElement.addClass('calendar-cell');
                            container.append(newElement);
                        });
                    });
                });
            }
        }
    });
