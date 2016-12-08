import './controllers';
import './services';

angular
.module('Randomizer.candidates.routes', ['ui.router', 'Randomizer.candidates.services', 'Randomizer.candidates.controllers'])
.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('candidates', {
            url: '/candidates',
            name: 'candidates',
            resolve: {
                candidates: (CandidatesService) => {
                    return CandidatesService.query();
                }
            },
            views: {
                '': {
                    templateUrl: '/candidates/main.tmpl.html'
                },
                'list@candidates': {
                    controller: 'CandidatesListCtrl as candidatesListCtrl',
                    templateUrl: '/candidates/list.tmpl.html',
                },
                'menu@': {
                    templateUrl: 'main.tmpl.html',
                }
            }
        })
        .state('candidates.edit', {
            url: '/edit/:id',
            name: 'candidates.edit',
            resolve: {
                candidate: (CandidatesService, $stateParams) => {
                    return CandidatesService.get({id: $stateParams.id}).$promise.then((result) => {
                        return result;
                    });
                }
            },
            views: {
                'edit@candidates': {
                    controller: 'CandidatesEditCtrl as candidatesEditCtrl',
                    templateUrl: '/candidates/edit.tmpl.html',
                }
            }
        })
        .state('candidates.add', {
            url: '/add',
            name: 'candidates.add',
            views: {
                'edit@candidates': {
                    controller: 'CandidatesAddCtrl as candidatesAddCtrl',
                    templateUrl: '/candidates/add.tmpl.html',
                }
            }
        });
});
