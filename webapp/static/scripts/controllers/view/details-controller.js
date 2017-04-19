'use strict';

angular.module('clientApplication')
		.controller('details-controller', ['$scope', 'Document', '$stateParams', 'Download', '$filter', '$location',
		function ($scope, Document, $stateParams, Download, $filter, $location) {
			
			$scope.switchBool = function (value) {
				$scope[value] = !$scope[value];
			};
			
			$scope.document =  Document.query({guid: $stateParams.guid}, function() {
				
			}, function(error) {
					//cas d'erreur:
					$scope.errorMessage = error.data;
			});
			
			$scope.download = function(guid) {
				Download.redirect(guid);
			};
				
			$scope.getTechnicalDetails = function(guid) {
				$location.path('/vue-principale/details/techniques/guid=' + guid);
			};
			
}]);
		