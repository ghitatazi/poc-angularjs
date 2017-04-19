'use strict';

angular.module('clientApplication')

	.controller('search-controller', ['$scope', 'Document', 'Documents', '$location', 'Delete', '$window', 'Download',
	function ($scope, Document, Documents, $location, Delete, $window, Download) {
		
		$scope.showFailureAlert = false;
		
		$scope.switchBool = function (value) {
			$scope[value] = !$scope[value];
		};
		
		$scope.searchDoc = function(guid) {

			if (guid) {
				
				$scope.document = Document.query({guid: guid}, function() {
					//success:
					$scope.document.typeList = TYPES[$scope.document.type];
				}, function() {
					//error:
					$scope.showFailureAlert = true;
					$scope.errorMessage = MESSAGES.search.msgErrorSearch;
				});
				
			} else {
				$scope.showFailureAlert = true;
				$scope.errorMessage = MESSAGES.search.msgErrorSearchGuidNotValid;
			}
		};
		
		$scope.showDetails = function(document) {
			$location.path('/vue-principale/details/guid=' + document.guid);
		};
		
		$scope.download = function(guid) {
			Download.redirect(guid);
		};
		
		$scope.deleteFile = function(guid) {
			Delete.query({guid: guid}, function() {});
			$window.location.reload();
		};
}]);
		