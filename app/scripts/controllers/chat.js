'use strict';
/**
 * @ngdoc function
 * @name finalversionApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('finalversionApp')
	.controller('ChatCtrl', function ($scope, fbutil, $timeout, simpleLogin) {

		simpleLogin.getUser().then(function(user){
			console.log( user );
			// synchronize a read-only, synchronized array of messages, limit to most recent 10
			$scope.messages = fbutil.syncArray('/messages/'+user.uid+'', {limit: 10});
			// display any errors
			$scope.messages.$loaded().catch(alert);

			// provide a method for adding a message
			$scope.addMessage = function(newMessage) {
				if( newMessage ) {
					// push a message to the end of the array
					$scope.messages.$add({text: newMessage})
						// display any errors
						.catch(alert);
				}
			};

			function alert(msg) {
				$scope.err = msg;
				$timeout(function() {
					$scope.err = null;
				}, 5000);
			}
		});
	});
