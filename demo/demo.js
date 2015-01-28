angular.module('demo', ['ht.table']).controller('DemoCtrl', function ($scope, $filter) {
    $scope.data = [
        {id: 1, name: "Moroni", age: 50},
        {id: 1, name: "Tiancum", age: 43},
        {id: 3, name: "Jacob", age: 27},
        {id: 4, name: "Nephi", age: 29},
        {id: 5, name: "Enos", age: 34},
        {id: 6, name: "Tiancum", age: 43},
        {id: 7, name: "Jacob", age: 27},
        {id: 8, name: "Nephi", age: 29},
        {id: 9, name: "Enos", age: 33},
        {id: 10, name: "Tiancum", age: 43},
        {id: 11, name: "Jacob", age: 27},
        {id: 12, name: "Nephi", age: 29},
        {id: 13, name: "Enos", age: 34},
        {id: 14, name: "Tiancum", age: 43},
        {id: 15, name: "Jacob", age: 27},
        {id: 16, name: "Nephi", age: 29},
        {id: 17, name: "Enos", age: 34}
    ];

    $scope.settings = {
        data: $scope.data,
        fields: [
            {
                name: "imie",
                value: "name",
                sort: "asc"
            },
            {
                name: "wiek",
                value: "age",
                type: "sum"
            }
        ],
        init: function(data, pagination) {
            pagination.current = 3;
        },
        checked: function(rows) {
            console.log(rows);
        }
    };

});
