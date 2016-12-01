import './services';

angular
.module('Randomizer.candidates.controllers', ['Randomizer.candidates.services'])
.controller('CandidatesListCtrl', function CandidatesListCtrl(candidates) {
    const candidatesListCtrl = this;
    candidatesListCtrl.candidates = candidates;
})
.controller('CandidatesEditCtrl', function CandidatesEditCtrl(CandidatesService, candidate, $state) {
    const candidatesEditCtrl = this;
    candidatesEditCtrl.candidate = candidate;
    candidatesEditCtrl.update = () => {
        CandidatesService.update(candidate).$promise.then((data) => {
            $state.reload();
        });
    };
    candidatesEditCtrl.delete = () => {
        CandidatesService.delete(candidate).$promise.then((data) => {
            console.log('ok');
            $state.go('candidates', {}, { reload: true });
        });
    };
})
.controller('CandidatesAddCtrl', function CandidatesAddCtrl(CandidatesService, $state) {
    const candidatesAddCtrl = this;
    candidatesAddCtrl.candidate = {'name': ''};
    candidatesAddCtrl.save = () => {
        const c = CandidatesService.save(candidatesAddCtrl.candidate).$promise.then((data) => {
            $state.reload();
        });
    };
});
