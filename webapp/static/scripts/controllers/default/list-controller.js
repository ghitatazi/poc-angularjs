'use strict';

angular.module('clientApplication')

	.controller('list-controller',['$scope', 'Documents', '$location', 'Delete', 'AlertService', '$timeout', '$rootScope', '$filter',
	'Download', function($scope, Documents, $location, Delete, AlertService, $timeout, $rootScope, $filter, Download) {
		
		var timer=false;
		$scope.alertNoExistingDocuments = false;
		
		if (AlertService.alertMessages.length > 0) {
			$scope.alertMessage = AlertService.alertMessages[0];
			if(timer){
				$timeout.cancel(timer);
			}
			timer= $timeout(function(){
				AlertService.deleteAlertMessage();
				},2000);
		}
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
				
		$scope.loadData = function() {
				
			$scope.documents = Documents.query({}, function() {
				//success
				if ($scope.documents.length > 0) {
					$scope.documents.forEach(function(document) {
						document.typeList = TYPES[document.type];
					});
				} else {
					$scope.alertNoExistingDocuments = true;
				}
			});
		};
			
		$scope.loadData();
			
		$scope.showDetails = function(document) {
			$location.path('/vue-principale/details/guid=' + document.guid);
		};
		
		$scope.download = function(guid) {
			Download.redirect(guid);
		};
				
		$scope.deleteFile = function(guid) {
			Delete.query({guid: guid}, function() {
				$scope.loadData();
			});
		};
	}]);