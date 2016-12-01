import './controllers';
import './services';

angular
.module('Randomizer.groups.routes', ['ui.router', 'Randomizer.groups.services', 'Randomizer.candidates.services', 'Randomizer.groups.controllers'])
.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('groups', {
            url: '/groups',
            name: 'groups',
            resolve: {
                groups: (GroupsService) => {
                    return GroupsService.query();
                }
            },
            views: {
                '': {
                    templateUrl: '/groups/main.tmpl.html'
                },
                'list@groups': {
                    controller: 'GroupsListCtrl as groupsListCtrl',
                    templateUrl: '/groups/list.tmpl.html',
                }
            }
        })
        .state('groups.edit', {
            url: '/edit/:id',
            name: 'groups.edit',
            resolve: {
                group: (GroupsService, $stateParams) => {
                    return GroupsService.get({id: $stateParams.id}).$promise.then((result) => {
                        return result;
                    });
                },
                candidates: (CandidatesService, $stateParams) => {
                    return CandidatesService.query().$promise.then((result) => {
                        return result;
                    });
                }
            },
            views: {
                'edit@groups': {
                    controller: 'GroupsEditCtrl as groupsEditCtrl',
                    templateUrl: '/groups/edit.tmpl.html',
                }
            }
        })
        .state('groups.add', {
            url: '/add',
            name: 'groups.add',
            views: {
                'edit@groups': {
                    controller: 'GroupsAddCtrl as groupsAddCtrl',
                    templateUrl: '/groups/add.tmpl.html',
                }
            }
        });
});
