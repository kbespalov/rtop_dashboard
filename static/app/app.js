var app = angular.module('examples', ['ngRoute', 'ngResource', 'chart.js']);

app.factory('MetricsService', MetricsService);
app.factory('ConnectionStateService', ConnectionStateService);


function ConnectionStateService($resource) {
    return $resource('/api/state', {});
}
function MetricsService($resource) {
    return $resource('/api/metrics', {});
}

app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider.when('/instances', {
        templateUrl: '/static/pages/instances.html',
        controller: InstancesController
    }).when('/settings', {
        templateUrl: '/static/pages/settings.html',
        controller: SettingsCtrl
    })
}]);


app.controller('InstancesController', InstancesController);
app.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl($scope, $http, ConnectionStateService) {
    $scope.ampq_url = "amqp://rtop:rtop@localhost:5672";
    $scope.state = ConnectionStateService.get().$promise.then(function (result) {
        $scope.state = result.toJSON()['state']
    });
    $scope.onConnect = function () {
        $http.post('/api/start', {'url': $scope.ampq_url})
    }
}

function InstancesController($scope, MetricsService) {
    var data = MetricsService.get();
    $scope.loaded = false;

    data.$promise.then(function (result) {
        $scope.loaded = true;
        $scope.data = result.toJSON();
        $scope.upd();
    });

    $scope.instances = [];
    $scope.timeline = {};
    $scope.ram_values = {};
    $scope.cpu_values = {};
    $scope.disk_values = {};
    $scope.cpu_series = ['usr', 'sys', 'total'];
    $scope.disk_series = ['free', 'used'];
    $scope.ram_seria = ['used in MB'];
    $scope.procs = {};
    $scope.proc_labels = ['pid', 'name', 'status', 'uid', 'rss', '%rss', '%cpu', '%wait', 'threads', 'write (Mb)', 'read (Mb)'];
    $scope.current_proc = {};
    $scope.date_view = {}
    $scope.upd = function () {
        if ($scope.loaded) {
            for (var instance in $scope.data) {
                var stat = $scope.data[instance];
                $scope.cpu_values[instance] = [[], [], []];
                $scope.ram_values[instance] = [[]];
                $scope.procs[instance] = [];
                $scope.instances.push(instance);
                $scope.timeline[instance] = [];
                $scope.disk_values[instance] = [0, 0];
                for (time in stat) {
                    date = new Date(time * 1000);
                    view = date.getHours() + ":" + date.getMinutes();
                    $scope.date_view[view] = time;
                    $scope.timeline[instance].push(view)
                    $scope.disk_values[instance][0] = stat[time]['disk'][1]
                    $scope.disk_values[instance][1] = stat[time]['disk'][2]
                    $scope.ram_values[instance][0].push(stat[time]['ram'][2])
                    $scope.cpu_values[instance][0].push(stat[time]['cpu'][0])
                    $scope.cpu_values[instance][1].push(stat[time]['cpu'][1])
                    $scope.cpu_values[instance][2].push(stat[time]['cpu'][0] + stat[time]['cpu'][1])
                    $scope.procs[instance][time] = stat[time]['psnap']
                    $scope.current_proc[instance] = stat[time]['psnap']
                }
            }
        }
    };


    $scope.onClick = function (points, evt) {
        var time = $scope.date_view[points[0].label];
        var instance = evt.target.id;
        console.log(instance);
        $scope.current_proc[instance] = $scope.procs[instance][time];
    };

    $scope.upd();

    function loadData() {
        data = MetricsService.get();
        data.$promise.then(function (result) {
            $scope.loaded = true;
            $scope.data = result.toJSON();
            $scope.upd();
        });
    }

    setInterval(loadData, 5000);
}