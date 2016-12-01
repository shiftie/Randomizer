import './services';
import _ from 'lodash';

angular
.module('Randomizer.groups.controllers', ['Randomizer.groups.services'])
.controller('GroupsListCtrl', function GroupsListCtrl(groups) {
    const groupsListCtrl = this;
    groupsListCtrl.groups = groups;
})
.controller('GroupsEditCtrl', function GroupsEditCtrl(GroupsService, group, candidates, $state) {
    function getAvailableCandidates() {
        return  _.differenceWith(candidates, groupsEditCtrl.group.candidates, (item, item2) => {
            return item.id === item2.id;
        });
    }

    candidates = _.map(candidates, (item) => {
        return item.toJSON();
    });

    const groupsEditCtrl = this;
    groupsEditCtrl.group = group;
    groupsEditCtrl.group.candidates = group.candidates || [];
    groupsEditCtrl.candidates = getAvailableCandidates();
    console.log(groupsEditCtrl.candidates, groupsEditCtrl.group.candidates);

    groupsEditCtrl.update = () => {
        GroupsService.update(groupsEditCtrl.group).$promise.then((data) => {
            $state.reload();
        });
    };
    groupsEditCtrl.delete = () => {
        GroupsService.delete(group).$promise.then((data) => {
            $state.go('groups', {}, { reload: true });
        });
    };
    groupsEditCtrl.addCandidate = (candidate) => {
        candidate = _.find(groupsEditCtrl.candidates, candidate);
        if (candidate) {
            groupsEditCtrl.group.candidates.push(candidate);
            groupsEditCtrl.candidates = getAvailableCandidates();
        }
    };
    groupsEditCtrl.removeCandidate = (candidate) => {
        candidate = _.find(groupsEditCtrl.group.candidates, candidate);
        if (candidate) {
            _.remove(groupsEditCtrl.group.candidates, candidate);
            groupsEditCtrl.candidates = getAvailableCandidates();
        }
    };
})
.controller('GroupsAddCtrl', function GroupsAddCtrl(GroupsService, $state) {
    const groupsAddCtrl = this;
    groupsAddCtrl.group = {'name': ''};
    groupsAddCtrl.save = () => {
        const c = GroupsService.save(groupsAddCtrl.group).$promise.then((data) => {
            $state.reload();
        });
    };
});
