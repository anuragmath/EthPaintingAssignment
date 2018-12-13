'use strict'

var PaintingCompetitionABI = require('../JSONABI/paintingCompetition.json');
var w = require('../app');
var web3 = w.web3js;

var default_account;
var paintingCompetition_address = "0x7265534f82c7ff41a12e2a49f2078bc222a149fe";

/* Getting account address for doing transaction*/
web3.eth.getAccounts()
  .then(function(accounts) {
    default_account = accounts[0];
  });

var PaintingCompetitionInstance= new web3.eth.Contract(PaintingCompetitionABI,
  paintingCompetition_address, {
    from: default_account,
    gas: 4712388,
    gasPrice: '200000000000'
  });

function createArtistList(artistList, callback) {
  var count = 0;
	var data = {};
	data['artists'] = [];
	for (var i=0; i< artistList.length; i++){
		var artistAddress = artistList[i];


			PaintingCompetitionInstance.methods.getArtistDetails(artistAddress).call(
				function(err, result){
					var obj = { "id": count+1,
											"name": result[0],
											"email": result[1],
											"url": result[2],
                      "votes": result[3],
											"certified": result[4],
                      "address": result[5]
										};
					data['artists'].push(obj);
					if(++count == artistList.length){
						return callback(data);
					}
			});
	}
}

function getCertifiedArtists(callback) {
  PaintingCompetitionInstance.methods.getCertifiedArtists().call(function(err, result){
    if(result.length == 0){
      var data = {};
      data['artists'] = [];
      return callback(null, data);
    } else {
      createArtistList(result, function(data) {
        return callback(null, data);
      });
    }
  });
}

function getRegisteredArtists(callback) {
  PaintingCompetitionInstance.methods.getRegisteredArtists().call(function(err, result){
    if(result.length == 0){
      var data = {};
      data['artists'] = [];
      return callback(null, data);
    } else {
      createArtistList(result, function(data) {
        return callback(null, data);
      });
    }
  });
}


exports.certifyArtist = function(req, res, next) {

  PaintingCompetitionInstance.methods
    .certifyPainting(req.body.artist_address).send({
      from: default_account
    }).on('transactionHash', function(hash) {
      console.log(hash);
    }).on('receipt', function(receipt) {
      console.log(receipt);
      res.send(receipt);
    }).on('error', function(error){
      console.log(error);
      res.send("error");
    });
}

exports.getCompetitionWinner = function(req, res, next) {
  PaintingCompetitionInstance.methods
    .getWinner().send({
      from: default_account
    }).on('transactionHash', function(hash) {
      console.log(hash);
    }).on('receipt', function(receipt) {
      console.log(receipt);
      res.send(receipt);
    }).on('error', console.error);
}

exports.getDashboardData = function(callback) {
  getRegisteredArtists(function(err, registered_artists){
    getCertifiedArtists(function(err, certified_artists){
      return callback( null, registered_artists, certified_artists);
    });
  });
}
