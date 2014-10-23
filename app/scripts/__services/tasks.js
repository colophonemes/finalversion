'use strict';
/**
 * @ngdoc function
 * @name finalversionApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('finalversionApp')
	.service('TasksService', function ( fbutil, $timeout, simpleLogin, $q) { // jshint ignore:line
			

			var err;

			// expose API
			return {
				getTasks : getTasks,
				deleteTask: deleteTask,
				toggleTaskSelected: toggleTaskSelected,
				alert: alert
			};

			// function loadTasks(){
			// 	simpleLogin.getUser()
			// 	.then(function(user){
			// 		console.log('Getting tasks for user:',user.uid);
			// 		tasks = fbutil.syncArray('/tasks/' + user.uid + '');
			// 		return tasks;
			// 	}).then( function(data){
			// 		console.log('Got data',data);
			// 		return data;
			// 	});				
			// }


			function getTasks(){
				var deferred = $q.defer();
				
				return deferred;
			}


			// // synchronize tasks
			// var tasks = fbutil.syncArray('/tasks/'+user.uid+'');
			// // do things when the promise resolves
			// tasks.$loaded(function(){
			// 	console.log(tasks[0].name);
			// // display any errors
			// }).catch(alert);



			// var initNewTaskForm = function(){
			// 	newTask.name = '';
			// 	newTask.taskRecurring = false;
			// 	newTask.taskRecurringInterval = 1;				
			// 	newTask.form.$setPristine();
			// };


			// // provide a method for adding a task
			// var newTaskSubmitted = function() {
			// 	// push a message to the end of the array
			// 	tasks.$add({
			// 											name: newTask.name,
			// 											recurring: newTask.taskRecurring,
			// 											recurringInterval: newTask.taskRecurringInterval,
			// 											status: 'incomplete',
			// 											selected: false
			// 										})
			// 		// display any errors
			// 		.catch(alert);
			// 		initNewTaskForm();
			// };



			// delete task from the array
			function deleteTask(id){
				for (var i = 0; i < tasks.length; i++) {
					if(tasks[i].$id === id){
						tasks.$remove(i);
						return;
					}
				}
			}

			// mark task as selected
			function toggleTaskSelected(id){
				for (var i = 0; i < tasks.length; i++) {
					if(tasks[i].$id === id){
						tasks[i].selected = !tasks[i].selected;
						return;
					}
				}
			}

			function alert(msg) {
				err = msg;
				$timeout(function() {
					err = null;
				}, 5000);
			}

		
	});
