'use strict';
/**
 * @ngdoc function
 * @name finalversionApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('finalversionApp')
	.controller('TasksCtrl', function ($scope, fbutil, user, $timeout, $location, Firebase) {

			// create this object for using form
			$scope.newTask = {};

			//TasksService.getTasks();
			// t.$loaded(function(tasks){
			// 	console.log('Controller -> tasks',tasks);
			// }).catch(function(error){
			// 	console.log(error);
			// });


			// synchronize tasks
			$scope.tasks = fbutil.syncArray('/tasks/'+user.uid+'');
			// do things when the tasks promise resolves
			$scope.tasks.$loaded(function(){

				$scope.setFirstTask();
				$scope.setCurrentTask();
				$scope.countSelected();
				// things to call if we're on the 'Select Tasks' route
				if($location.path() == '/tasks/select'){
					$scope.setTasksAsUnselected();
				}

				// things to call if we're on the 'Run Tasks' route
				if($location.path() == '/tasks/run'){
					console.log();
					//$scope.setTasksAsUnselected();
				}
			// display any errors
			}).catch(alert);



			$scope.initNewTaskForm = function(){
				$scope.newTask.name = '';
				$scope.newTask.taskRecurring = false;
				$scope.newTask.taskRecurringInterval = 1;				
				$scope.newTask.form.$setPristine();
			};


			// provide a method for adding a task
			$scope.newTaskSubmitted = function() {
				// push a message to the end of the array
				$scope.tasks.$add({
														name: $scope.newTask.name,
														recurring: $scope.newTask.taskRecurring,
														recurringInterval: $scope.newTask.taskRecurringInterval,
														status: 'incomplete',
														selected: false,
														timestamp: Firebase.ServerValue.TIMESTAMP,
														timeElapsed: 0,
														$priority: Firebase.ServerValue.TIMESTAMP
													})
					// display any errors
					.catch(alert);
					$scope.initNewTaskForm();
			};
			// delete task from the array
			$scope.deleteTask = function(id){
				for (var i = 0; i < $scope.tasks.length; i++) {
					if($scope.tasks[i].$id === id){
						$scope.tasks.$remove(i);
						return;
					}
				}
			};

			// mark task as selected
			$scope.toggleTaskSelected = function(id,val){
				for (var i = 0; i < $scope.tasks.length; i++) {
					if($scope.tasks[i].$id === id){
						var selected;
						if( val || (!val && val===false) ){
							selected = val;
						} else {
							selected = !$scope.tasks[i].selected;
						}
						$scope.tasks[i].selected = selected;
						$scope.tasks.$save(i);
						$scope.countSelected();
						return;
					}
				}
			};

			// mark task as completed
			$scope.toggleTaskCompleted = function(id,val){
				for (var i = 0; i < $scope.tasks.length; i++) {
					if($scope.tasks[i].$id === id){
						var complete;
						if( val || (!val && val===false) ){
							complete = val;
						} else {
							complete = !$scope.tasks[i].complete;
						}
						$scope.tasks[i].complete = complete;
						$scope.tasks.$save(i);
						return;
					}
				}
			};

			// mark task as done but not completed
			$scope.setTaskAsDoneButIncomplete = function(id){
				// unselect the task
				$scope.toggleTaskSelected(id);
				$scope.setCurrentTask();
				// update the timestamp
				for (var i = 0; i < $scope.tasks.length; i++) {
					if($scope.tasks[i].$id === id){
						$scope.tasks[i].timestamp = Firebase.ServerValue.TIMESTAMP;
						$scope.tasks[i].$priority = Firebase.ServerValue.TIMESTAMP;
						$scope.tasks.$save(i);

					}
				}
			}

			// mark task completed
			$scope.setTaskAsComplete = function(id){
				// unselect the task
				$scope.toggleTaskSelected(id);
				$scope.setCurrentTask();
				// set the task as complete
				for (var i = 0; i < $scope.tasks.length; i++) {
					if($scope.tasks[i].$id === id){
						$scope.tasks[i].complete = true;
						$scope.tasks.$save(i);
						return;
					}
				}
			}


			// work out which task is the current one
			$scope.setCurrentTask = function(){
				// iterate through tasks backwards
				for (var i = $scope.tasks.length-1; i > -1; i--) {
					// find the first selected task, mark as current, exit loop
					if($scope.tasks[i].selected){
						$scope.currentTask = $scope.tasks[i];
						return;
					}
				}
			};

			// set the first task for completion (gets rid of completed tasks)
			$scope.setFirstTask = function(){
				// iterate through tasks
				for (var i = 0, l = $scope.tasks.length; l > i; i++) {
					if(!$scope.tasks[i].complete){
						$scope.firstTask = $scope.tasks[i];
						return;
					}
				}
			};

			// count the number of selected tasks
			$scope.selectedCount = null;
			$scope.countSelected = function(){
				$scope.selectedCount = 0;
				// iterate through tasks
				for (var i = 0, l = $scope.tasks.length; l > i; i++) {
					if($scope.tasks[i].selected){
						$scope.selectedCount++;
					}
				}
			};
			$scope.$watch('selectedCount',function(){
				if($scope.selectedCount === 0 && $location.path() == '/tasks/run'){
					$location.path('/tasks');
				}
			});

			// set all tasks as unselected
			$scope.setTasksAsUnselected = function(){
				console.log('setting tasks as unselected');
				// iterate through tasks and unselect all
				for (var i = 0, l = $scope.tasks.length; l > i; i++) {
					$scope.tasks[i].selected = false;
					$scope.tasks.$save(i);
				}
				// reset first task as selected
				$scope.toggleTaskSelected($scope.firstTask.$id);
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
                if ( newValue === true ) {
                    $timeout(function(){
                        element[0].focus();
                    });
                }
            });
        }
     };
	}).directive('autofocusInit', function ($timeout) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.autofocusInit, function(newValue){
                if ( newValue === true ) {
                	console.log(newValue);
                    $timeout(function(){
                        element[0].focus();
                    });
                }
            });
        }
     };
	});
