'use strict';

angular.module('clientApplication')

		.controller('details-techniques-controller', ['$scope', 'Document', '$stateParams', 'jsonFilter', '$location', '$filter',
		'Download', function($scope, Document, $stateParams, jsonFilter, $location, $filter, Download) {
			
			$scope.list = [];
			
			$scope.document = Document.query({guid: $stateParams.guid}, function() {
				//console.log($scope.document.properties);
				var jsonString = jsonFilter($scope.document.properties); //json -> jsonString
				$scope.list = angular.fromJson(jsonString); // deserialize jsonString
			});
			
			$scope.download = function(guid) {
				Download.redirect(guid);
			};
				
			$scope.getDetails = function(guid, document) {
				$location.path('/vue-principale/details/guid=' + document.guid);
			};
			
}]);
		
		