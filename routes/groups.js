const fs = require('fs');
const _ = require('lodash');
const shortId = require('shortid');
const express = require('express');
const config = require('../config.js');
const sharedService = require('./shared');
const router = express.Router();
const dataFile = config.dataFile;

function checkDataFile(req, res, next) {
    try {
        fs.statSync(dataFile).isFile();
    }
    catch (err) {
        createDataFile();
    }

    next();
}

sharedService.onRemoveCandidate((candidate) => {
    const data = getAllData();
    data.groups = _.forEach(data.groups, (group) => {
        _.remove(group.candidates, candidate);
    });
    updateAllData(data);

    return data.groups;
});

function createDataFile() {
    const data = {"groups":[],"groups":[]};
    return fs.writeFileSync(dataFile, JSON.stringify(data));
};

function getGroups() {
    const data = getAllData();
    return data.groups;
}

function getAllData() {
    return JSON.parse(fs.readFileSync(dataFile).toString());
}

function updateAllData(data) {
    return fs.writeFileSync(dataFile, JSON.stringify(data));
}

router.all("/*", checkDataFile, function(req, res, next) {
    return next();
});

router.get('/', function (req, res) {
    res.send(getGroups());
});

router.post('/', function (req, res) {
    const data = getAllData();
    const group = _.findIndex(data.groups, (group) => { return group.name === req.body.name });
    if (group === -1 && req.body.name && req.body.name.length > 0) {
        data.groups.push({id: shortId.generate(), name: req.body.name});
        updateAllData(data);
        res.send(_.last(data.groups));
    }else{
        res.status(500).send('Name exists');
    }
});

router.delete('/:id/:name', function (req, res) {
    const data = getAllData();
    const group = _.remove(data.groups, (group) => {
        return group.id === req.params.id;
    });
    updateAllData(data);

    res.send(group ? group[0] : '');
});


router.get('/:id', function (req, res) {
    const groups = getGroups();
    res.send(_.find(groups, (group) => { return group.id === req.params.id }));
});

router.post('/:id', function (req, res) {
    const data = getAllData();
    const group = _.findIndex(data.groups, (group) => { return group.id === req.params.id });
    if (group > -1 && req.body.name.length > 0) {
        data.groups[group] = req.body;
    }
    updateAllData(data);

    res.send(data.groups[group]);
});

module.exports = router;
