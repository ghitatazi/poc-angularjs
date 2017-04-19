'use strict';

angular.module('clientApplication.services', ['ngResource'])

	.factory('Documents', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/documents/list';
			return $resource(url, {}, {
				query: { method:'GET', isArray:true }
			});
		}
	])
	.factory('Document', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/document/:guid';
		return $resource(url, {}, {
					query: { method:'GET'}
				});
		}
	])

	.factory('Download', ['$resource', '$window', function($resource, $window) {
		return {
				redirect : function(guid) {
					var url = CONTEXT_PATH + 'api/document/' + guid + '/download';
					$window.location.href = url;
				}
			};
		}
	])
	.factory('Delete', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/document/:guid/delete';
		return $resource(url, {}, {
					query: { method:'GET'}
				});
		}
	])
	.factory('GenerateGuid', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/document/generate/guid';
		return $resource(
				url, {}, {
						query: { method:'GET', isArray: false}
				});
		}
	])
	.factory('Online', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/online';
		return $resource(
				url, {}, {
					query: { method:'GET', isArray: false, responseText:"text"}
				});
		}
	])
	.factory('Offline', ['$resource', function($resource) {
		var url = CONTEXT_PATH + 'api/offline';
		return $resource(url, {}, {
					query: { method:'GET', isArray: false, responseText:"text"}
				});
		}
	])
	.factory('AlertService', ['$rootScope', function($rootScope) {
		var alertService = {
			alertMessages: [],
			addAlertMessage : function(text) {
				this.alertMessages.push(text);
				$rootScope.$broadcast('messageAdded');
			},
			deleteAlertMessage: function() {
				this.alertMessages.splice(0,1);
			}
		};
		return alertService;
	}])
	.factory('transformRequestAsFormPost', function() {
		function transformRequest(data, getHeaders) {
			 var headers = getHeaders();
			 headers[ "Content-Type" ] = "application/x-www-form-urlencoded; charset=utf-8";
			 return(serializeData(data));
		}
		return(transformRequest);
		  
		function serializeData(data) {
			// If this is not an object, defer to native stringification.
			if ( ! angular.isObject( data ) ) {
				return( ( data == null ) ? "" : data.toString() );
			}
			var buffer = [];
			// Serialize each key in the object.
			for ( var name in data ) {
				if ( ! data.hasOwnProperty( name ) ) {
					continue;
				}
				var value = data[ name ];
				buffer.push(
						encodeURIComponent( name ) +
						"=" +
						encodeURIComponent( ( value == null ) ? "" : value )
				);
			}
			// Serialize the buffer and clean it up for transportation.
			var source = buffer
				.join( "&" )
				.replace( /%20/g, "+" );
				return(source);
			} 
	});

