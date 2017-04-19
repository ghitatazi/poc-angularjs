'use strict';

angular.module('clientApplication')

		.controller('nav-controller', ['$scope', '$location', '$log', 'Online', 'Offline', function ($scope, $location, $log, Online, Offline) {

		$scope.navClass = function(page) {
				var currentRoute = $location.path().substring(1) || 'main';
				return page == currentRoute ? 'active' : '';
		};
		
		$scope.isActive = true;
		$scope.switchOnOff = ONLINE;
		$scope.size = 'medium';
		$scope.animate = true;
		$scope.radioOff = false;
		$scope.labelText = '&nbsp;';
		$scope.onColor = 'primary';
		$scope.offColor = 'warning';
		
		$scope.$watch('switchOnOff', function(newValue, oldValue) {
			//$log.info('Selection changed.');
			if (newValue === oldValue) {
				return;
			}
			if (newValue == true) {
				Online.query({}, function() {});
			} else {
				Offline.query({}, function() {});
			}
			
		});
		
}]);
		