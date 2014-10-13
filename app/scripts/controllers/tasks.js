'use strict';
/**
 * @ngdoc function
 * @name finalversionApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('finalversionApp')
	.controller('TasksCtrl', function ($scope, fbutil, $timeout, user) {

			//console.log( user );

			// create this object for using form
			$scope.newTask = {};

			// synchronize a read-only, synchronized array of messages, limit to most recent 10
			$scope.tasks = fbutil.syncArray('/tasks/'+user.uid+'', {limit: 10});
			// display any errors
			$scope.tasks.$loaded().catch(alert);
			//console.log($scope.tasks);


			$scope.initNewTaskForm = function(){
				$scope.newTask.name = '';
				$scope.newTask.taskRecurring = false;
				$scope.newTask.taskRecurringInterval = 1;				
				$scope.newTask.form.$setPristine();
			};
			// provide a method for adding a message
			$scope.newTaskSubmitted = function() {
				// push a message to the end of the array
				$scope.tasks.$add({
														name: $scope.newTask.name,
														recurring: $scope.newTask.taskRecurring,
														recurringInterval: $scope.newTask.taskRecurringInterval,
														status: 'incomplete',
														selected: false
													})
					// display any errors
					.catch(alert);
					$scope.initNewTaskForm();
			};

			// close new tasks panel
			$scope.showNewTaskPanel = false;

			function alert(msg) {
				$scope.err = msg;
				$timeout(function() {
					$scope.err = null;
				}, 5000);
			}
		
	}).directive('autofocusWhen', function ($timeout) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.autofocusWhen, function(newValue){
                if ( newValue ) {
                    $timeout(function(){
                        element[0].focus();
                    },1);
                }
            });
        }
     };
	});
