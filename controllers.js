'use strict';

/* Controllers */

angular.module('myApp.controllers', ['LocalStorageModule'])
    .controller('MyCtrl', ['$scope', 'localStorageService', function($scope, localStorageService) {

        $scope.all = localStorageService.get('all') || 1;
        $scope.active = localStorageService.get('active') || 0;
        $scope.completed = localStorageService.get('complete') || 0;
        $scope.all_work = localStorageService.get('all_work') || [];
        $scope.uncompleted_work = localStorageService.get('uncompleted_work') || [];
        $scope.completed_work = localStorageService.get('completed_work') || [];
        $scope.completed_count = localStorageService.get('completed_count') || 0;
        $scope.uncompleted_count = localStorageService.get('uncompleted_count') || 0;
        var id = 0;

        function compute_count() {
            $scope.uncompleted_count = $scope.uncompleted_work.length;
            $scope.completed_count = $scope.completed_work.length;
            localStorageService.set('completed_count', $scope.completed_count);
            localStorageService.set('uncompleted_count', $scope.uncompleted_count);
        }

        $scope.add_work = function(event) {
            if (event.keyCode == 13 && $(event.target).val()) {
                var work = {name: $(event.target).val(), is_complete: 0};
            }

            $scope.all_work.unshift(work);
            $scope.uncompleted_work.unshift(work);
            compute_count();
            $(event.target).val('');
            console.log($scope.all_work);
            localStorageService.set('all_work', $scope.all_work);
            localStorageService.set('uncompleted_work', $scope.uncompleted_work);
        };

        $scope.sign_work = function(work) {
            $(this).myPlugin(work);
            var all_index = $scope.all_work.indexOf(work);
            if (work.is_complete) {
                var index = $scope.completed_work.indexOf(work);
                $scope.completed_work.splice(index, 1);
                $scope.uncompleted_work.unshift(work);
            } else {
                var index = $scope.uncompleted_work.indexOf(work);
                $scope.uncompleted_work.splice(index, 1);
                $scope.completed_work.unshift(work);
            }
            $scope.all_work[all_index].is_complete = !$scope.all_work[all_index].is_complete;
            compute_count();
            localStorageService.set('completed_work', $scope.completed_work);
            localStorageService.set('uncompleted_work', $scope.uncompleted_work);
        };

        $scope.delete_work = function(work) {
            var all_index = $scope.all_work.indexOf(work);
            $scope.all_work.splice(all_index, 1);
            if (work.is_complete) {
                var index = $scope.completed_work.indexOf(work);
                $scope.completed_work.splice(index, 1);
                localStorageService.set('completed_work', $scope.completed_work);
            } else {
                var index = $scope.uncompleted_work.indexOf(work);
                $scope.uncompleted_work.splice(index, 1);
                localStorageService.set('uncompleted_work', $scope.uncompleted_work);
            }
            compute_count();
        };

        $scope.change_list = function(category) {
            switch(category) {
                case 'all' :
                    $scope.all = 1;
                    $scope.active = 0;
                    $scope.completed = 0;
                    break;
                case 'active':
                    $scope.active = 1;
                    $scope.all = 0;
                    $scope.completed = 0;
                    break;
                case 'completed':
                    $scope.completed = 1;
                    $scope.all = 0;
                    $scope.active = 0;
                    break;
                default:
                    $scope.all = 1;
                    $scope.active = 0;
                    $scope.completed = 0;

            }
            localStorageService.set('all', $scope.all);
            localStorageService.set('active', $scope.active);
            localStorageService.set('completed', $scope.completed);
        };

        $scope.remove_all_completed = function() {
            $scope.completed_work.splice(0, $scope.completed_work.length);
            for (var i =0; i < $scope.all_work.length; i++) {
                if ($scope.all_work[i].is_complete) {
                    $scope.all_work.splice(i, 1);
                    i--;
                }
            }
            compute_count();
            localStorageService.set('completed_work', $scope.completed_work);
            localStorageService.set('all_work', $scope.all_work);
            localStorageService.set('uncompleted_work', $scope.uncompleted_work);
        };
    }])
;
