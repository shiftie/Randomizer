import './services';
import _ from 'lodash';
import * as d3 from 'd3';

angular
.module('Randomizer.groups.controllers', ['Randomizer.groups.services'])
.controller('GroupsListCtrl', function GroupsListCtrl(groups) {
    const groupsListCtrl = this;
    groupsListCtrl.groups = groups;
})
.controller('GroupsPlayCtrl', function GroupsPlayCtrl(group) {
    const groupsPlayCtrl = this;
    groupsPlayCtrl.group = group;
    groupsPlayCtrl.group.candidates.map((item) => {
        item.count = 10;
    });
    groupsPlayCtrl.slices = 4;

    groupsPlayCtrl.updateChart = () => {
        let dataset = [...groupsPlayCtrl.group.candidates];

        for (let i = 0; i < groupsPlayCtrl.slices - 1 ; i++) {
            dataset.push(...groupsPlayCtrl.group.candidates);
        }

        dataset.forEach(function(d) {
            d.enabled = true;                                         // NEW
        });
        let width = 360;
        let height = 360;
        let radius = Math.min(width, height) / 2;
        let donutWidth = 75;
        let legendRectSize = 18;
        let legendSpacing = 4;
        let color = d3.scaleOrdinal(d3.schemeCategory20b);
        let svg = d3.select('#chart')
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'wheel')
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
        let arc = d3.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);
        let pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);
        let path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.name);
            })
            .each(function(d) { this._current = d; });

        let legend2 = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

        let legend = legend2.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                let height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });


        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on('click', function(name) {
                var rect = d3.select(this);
                var enabled = true;
                var totalEnabled = d3.sum(dataset.map(function(d) {
                    return (d.enabled) ? 1 : 0;
                }));

                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', '');
                } else {
                    if (totalEnabled < 2) return;
                    rect.attr('class', 'disabled');
                    enabled = false;
                }

                pie.value(function(d) {
                    if (d.name === name) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                path = path.data(pie(dataset));

                path.transition()
                .duration(750)
                .attrTween('d', function(d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
            });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });
    }

    groupsPlayCtrl.play = () => {
        console.log(d3.randomUniform(1080, 4096)());
        d3.select('.wheel')
            .classed('wheel--play', false)
            .attr('style', `transform: rotateZ(0deg)`);

        setTimeout(() => {
            d3.select('.wheel').classed('wheel--play', true)
                .attr('style', `transform: rotateZ(${d3.randomUniform(1080, 4096)()}deg)`);
        }, 0);
    }

    groupsPlayCtrl.updateChart();

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
