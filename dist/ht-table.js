/*!
 * angular-ht-ng-table
 * https://github.com/hightest/angular-ng-table
 * Version: 0.0.1 - 2015-02-03T15:34:30.121Z
 * License: 
 */


var app = angular.module('ht.table', ['ui.bootstrap']);

app.directive('htTable', function() {
    return {
        templateUrl: 'ht-table.html',
        scope: {
            'htTable': '='
        },
        controller: function($scope, orderByFilter) {
            var self = this;
            var settings = $scope.htTable;
            var rowClick = angular.isDefined(settings.rowClick) ? settings.rowClick : function() {};
            var expand = angular.isDefined(settings.expand) ? settings.expand : function() {};
            var checkedRows = angular.isDefined(settings.checked) ? settings.checked : function() {};
            self.id = angular.isDefined(settings.id) ? settings.id : 'table';
            self.class = angular.isDefined(settings.class) ? settings.class : [];
            self.selectMultiple = angular.isDefined(settings.selectMultiple) ? settings.selectMultiple : false;
            var active = angular.isDefined(settings.active) ? settings.active : '';
            var originalData = settings.data;
            var init = angular.isDefined(settings.init) ? settings.init : function() {};
            var singleSelect = null;
            self.fields = settings.fields;
            self.pagination = {
                total: 0,
                current: 1,
                itemsPerPage: 10
            };
            var sorting = [];
            self.data = originalData;

            angular.forEach(self.fields, function(field) {
                if (angular.isDefined(field.sort)) {
                    sorting.push({field: field.value, sort: field.sort});
                }
            });
            $scope.$watch('htTable', function(newVal, oldVal) {
                if (newVal == oldVal)
                    return;
                originalData = newVal.data;
                self.reloadTable();
            }, true);
            angular.forEach(self.fields, function(field) {
                if (angular.isUndefined(field.visible)) {
                    field.visible = true;
                }
            });
            self.reloadTable = function() {
                var predicates = [];
                angular.forEach(sorting, function (sort) {
                    var predicate = '';
                    if (sort.sort == 'asc')
                        predicate = '+';
                    else
                        predicate = '-';
                    predicate += sort.field;
                    predicates.push(predicate);
                });
                var orderedData = sorting.length ? orderByFilter(originalData, predicates) : originalData;
                if (angular.isFunction(init)) {
                    init(orderedData, self.pagination);
                    init = null;
                }
                self.pagination.total = orderedData.length;
                if (!self.pagination.itemsPerPage)
                    self.data = orderedData;
                else
                    self.data = orderedData.slice((self.pagination.current - 1) * self.pagination.itemsPerPage, self.pagination.current * self.pagination.itemsPerPage);
            };
            self.reloadTable();

            $scope.$watch(function() {
                return self.pagination.itemsPerPage;
            }, function(newVal, oldVal) {
                if (newVal == oldVal)
                    return;
                self.reloadTable();
            });
            self.expand = function(row) {
                singleSelect = row;
                return rowClick(row);
            };

            self.show = function (row) {
                return expand(row);
            };

            self.pageChanged = function() {
                this.reloadTable();
            };


            self.rowStyle = function(element) {
                if ((self.selectMultiple && element.checked) || element == singleSelect)
                    return active;

                return '';
            };

            self.getFieldClass = function(field) {
                for (var i = 0; i < sorting.length; i++) {
                    if (field.value == sorting[i].field) {
                        if (sorting[i].sort == 'asc')
                            return 'ht-table-icon-up';
                        else
                            return 'ht-table-icon-down';
                    }
                }
                return '';
            };

            var findField = function (field) {
                for (var i = 0; i < sorting.length; i++) {
                    if (sorting[i].field == field.value) {
                        return i;
                    }
                }

                return null;
            };

            self.changeSorting = function(field, $event) {
                var shift = $event.shiftKey;

                var fieldPosition = findField(field);

                var newField = {};

                if (null === fieldPosition)
                    newField = {field: field.value, sort: 'asc'};
                else
                    newField = sorting[fieldPosition];

                if (null !== fieldPosition) {
                    var sort = newField.sort;
                    if (sort == 'asc') {
                        sorting[fieldPosition].sort = 'desc';
                        if (!shift) {
                            sorting = [sorting[fieldPosition]];
                        }
                    } else {
                        if (shift)
                            sorting.splice(fieldPosition, 1);
                        else
                            sorting = [];
                    }
                } else {
                    if (shift)
                        sorting.push(newField);
                    else
                        sorting = [newField];
                }
                self.reloadTable();
            };

            self.countColumns = function() {
                var count = 1;
                angular.forEach(self.fields, function(field) {
                    if (field.visible)
                        count++;
                });

                if (self.selectMultiple)
                    count++;

                return count;
            };

            self.checkedChange = function() {
                var checkedElements = self.getCheckedElements();

                checkedRows(checkedElements);
            };

            self.hasSum = function() {
                for (var i = 0; i < self.fields.length; i++) {
                    if (angular.isDefined(self.fields[i].type) && self.fields[i].type == 'sum')
                        return true;
                }

                return false;
            };
            self.getCheckedElements = function() {
                var checkedElements = [];

                angular.forEach(self.data, function(row) {
                    if (angular.isDefined(row.checked) && row.checked) {
                        this.push(row);
                    }
                }, checkedElements);

                return checkedElements;
            };

            self.sum = function(field) {
                var sum = 0;
                var checkedElements = self.getCheckedElements();

                if (!checkedElements.length)
                    checkedElements = originalData;

                angular.forEach(checkedElements, function(element) {
                    sum += element[field];
                });

                return sum;
            };
        },
        controllerAs: 'table'
    };
});
angular.module("ht.table").run(["$templateCache", function($templateCache) {$templateCache.put("ht-table.html","<div class=\"table-responsive\"><table class=\"table table-bordered\" id=\"{{table.id}}\" ng-class=\"table.class\"><thead><tr><th><div dropdown=\"\" class=\"btn-group\"><button class=\"btn btn-default dropdown-toggle\" type=\"button\" dropdown-toggle=\"\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span></button><ul class=\"dropdown-menu\" role=\"menu\" ng-click=\"$event.stopPropagation()\"><li ng-repeat=\"field in table.fields\"><label><input type=\"checkbox\" ng-model=\"field.visible\">{{field.name}}</label></li></ul></div></th><th ng-if=\"table.selectMultiple\"></th><th ng-repeat=\"field in table.fields\" ng-if=\"field.visible\" ng-click=\"table.changeSorting(field, $event)\" ng-class=\"table.getFieldClass(field)\" style=\"cursor:pointer\">{{field.name}}</th></tr></thead><tbody><tr ng-repeat-start=\"row in table.data\" ng-class=\"table.rowStyle(row)\"><td>{{(table.pagination.current - 1) * table.pagination.itemsPerPage + $index + 1}}.</td><th scope=\"row\" ng-if=\"table.selectMultiple\"><input type=\"checkbox\" ng-model=\"row.checked\"></th><td ng-repeat=\"field in table.fields\" ng-if=\"field.visible\" ng-click=\"table.expand(row)\">{{row[field.value]}}</td></tr><tr ng-repeat-end=\"\" ng-if=\"table.show(row)\"><td colspan=\"{{table.countColumns()}}\"><div ui-view=\"\"></div></td></tr></tbody><tfoot ng-if=\"table.hasSum()\"><tr><td>&nbsp;</td><td>&nbsp;</td><td ng-repeat=\"field in table.fields\" ng-if=\"field.visible\"><span ng-if=\"field.type\">Suma: {{table.sum(field.value) | number:2}}</span></td></tr></tfoot></table></div><div class=\"row\"><div class=\"col-xs-6\"><pagination total-items=\"table.pagination.total\" ng-model=\"table.pagination.current\" ng-change=\"table.pageChanged()\" max-size=\"5\" items-per-page=\"table.pagination.itemsPerPage\" previous-text=\"&laquo;\" next-text=\"&raquo;\"></pagination></div><div class=\"btn-group col-xs-6\"><label class=\"btn btn-primary\" ng-model=\"table.pagination.itemsPerPage\" btn-radio=\"10\">10</label> <label class=\"btn btn-primary\" ng-model=\"table.pagination.itemsPerPage\" btn-radio=\"25\">25</label> <label class=\"btn btn-primary\" ng-model=\"table.pagination.itemsPerPage\" btn-radio=\"50\">50</label> <label class=\"btn btn-primary\" ng-model=\"table.pagination.itemsPerPage\" btn-radio=\"100\">100</label> <label class=\"btn btn-primary\" ng-model=\"table.pagination.itemsPerPage\" btn-radio=\"0\">Wszystkie</label></div></div>");}]);