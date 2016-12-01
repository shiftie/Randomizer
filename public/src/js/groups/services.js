import 'angular-resource';

angular.module('Randomizer.groups.services',  ['ngResource']).factory('GroupsService', function($resource) {
    return $resource('/groups/:id/:name', {id: '@id'}, {update: {method: 'POST'}});
});
