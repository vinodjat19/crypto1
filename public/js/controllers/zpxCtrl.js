angular.module('zpxCtrl', []).controller('zpxCtrl', function($scope, $http) {


    $scope.snackBar = function(msg) {
        $scope.snackHead = msg;
        var x = document.getElementById("snackbar")
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.mainData = [];

    $scope.fetchDataOnLoad = function() {
        $http.get('/getNames')
            .then(function(resp) {
                console.log(resp);
                $scope.dataName = resp.data.docs;
                $scope.fetchDataByName($scope.dataName[$scope.dataName.length - 1], $scope.dataName.length - 1);
                // $scope.mainData = resp.data.docs;
                // $scope.drawGraph($scope.mainData, 'Low Price');
            }, function(resp) {
                /* Failure */
                
            });
    }
    $scope.fetchDataOnLoad();


    $scope.fetchDataByName = function(name, index) {
        for (var i = 0; i < $scope.dataName.length; i++) {
            $scope.dataName[i].class = "";
        }
        $scope.dataName[index].class = "blue-back";
       
        var data = {};
        data.name = name;
        $http.post('/getDataByName', data)
        .then(function(resp) {
            if (resp.data.success) {
                $scope.mainData = resp.data.docs;
                console.log(resp.data);
                $scope.drawGraph(resp.data.docs, 'Low Price');

               
            } else {
                $scope.snackBar('Something is wrong');
            }
            /* Success */
           
        }, function(resp) {

            /* Failure */
            
        });
    }

    $scope.getGraphByType = function(data, type) {

        $scope.dataGraph1 = [];
        if (type == 'Low Price') {
            for (var i = 0; i < data.length; i++) {
                $scope.dataGraph1[i] = [];
                $scope.dataGraph1[i].push(data[i].Timestamp);
                $scope.dataGraph1[i].push(data[i].Low);
            }
        } else if (type == 'High Price') {
            for (var i = 0; i < data.length; i++) {
                $scope.dataGraph1[i] = [];
                $scope.dataGraph1[i].push(data[i].Timestamp);
                $scope.dataGraph1[i].push(data[i].High);
            }
        } else if (type == 'Volume') {
            for (var i = 0; i < data.length; i++) {
                $scope.dataGraph1[i] = [];
                $scope.dataGraph1[i].push(data[i].Timestamp);
                $scope.dataGraph1[i].push(data[i].Volume);
            }
        }
        
        return $scope.dataGraph1;
    }

    $scope.dataGraph = [];
    $scope.drawGraph = function(data, type) {

        $scope.dataGraph = $scope.getGraphByType(data, type);
        
            Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Analysis over a period of time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: type,
                data: $scope.dataGraph
            }]
        });
    };

    $scope.viewType = function(type) {
        $scope.drawGraph($scope.mainData, type);
    }

    $scope.post  = function(url, data) {

        $http.post(url, data)
        .then(function(resp) {
            if (resp.data.success) {
                $scope.fetchDataOnLoad();
                $scope.snackBar('Succesful');
            } else {
                $scope.snackBar('Something is wrong');
            }
            /* Success */
           
        }, function(resp) {

            /* Failure */
            
        });
        
        // $scope.$apply();

    };
        

    $scope.name = '';

    $scope.addMore = function(name,email,age) {
        var obj = {
            'name' : name
        };
        
        $scope.post('/saveDataManual', obj);
    };

});