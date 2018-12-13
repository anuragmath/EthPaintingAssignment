var express = require('express');
var router = express.Router();
var dashboardController = require('../api/dashboardController');

router.post('/certify', dashboardController.certifyArtist);

router.post('/winner', dashboardController.getCompetitionWinner);

module.exports = router;
