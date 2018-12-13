var express = require('express');
var router = express.Router();
var dashboardController = require('../api/dashboardController');

/* GET home page. */
router.get('/', function(req, res, next) {
  dashboardController.getDashboardData(function(err, registered, certified){
    res.render('index', { certified_artists_list: certified, registered_artists_list: registered });
  });
});

module.exports = router;
