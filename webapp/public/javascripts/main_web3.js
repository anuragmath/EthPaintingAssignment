const paintingCompetition_address = '0x7265534f82c7ff41a12e2a49f2078bc222a149fe';

var paintingCompetitionInstance;
var user;
var absolute_url;

window.onload = function() {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  if (!web3.isConnected()) {
    console.error("Ethereum - no conection to RPC server");
  } else {
    console.log("Ethereum - connected to RPC server");
  }

  absolute_url = window.location.origin;

  web3.eth.defaultAccount = web3.eth.accounts[0];

  user = web3.eth.accounts[0];

  const PaintingCompetitionContract = web3.eth.contract(PaintingCompetitionABI);
  paintingCompetitionInstance = PaintingCompetitionContract.at(paintingCompetition_address);


  paintingCompetitionInstance.registration_deadline.call(function(err, result){
    date = new Date(result.toNumber() * 1000),
    datevalues = [
       date.getFullYear(),
       date.getMonth()+1,
       date.getDate(),
       date.getHours(),
       date.getMinutes(),
       date.getSeconds(),
    ];
    document.getElementById("registration_deadline").innerHTML = datevalues[2] + "/" + datevalues[1] + "/" + datevalues[0] + "  " + datevalues[3] + ":" + datevalues[4] + ":" + datevalues[5];
  });

  paintingCompetitionInstance.voting_deadline.call(function(err, result){
    date = new Date(result.toNumber() * 1000),
    datevalues = [
       date.getFullYear(),
       date.getMonth()+1,
       date.getDate(),
       date.getHours(),
       date.getMinutes(),
       date.getSeconds(),
    ];
    document.getElementById("voting_deadline").innerHTML = datevalues[2] + "/" + datevalues[1] + "/" + datevalues[0] + "  " + datevalues[3] + ":" + datevalues[4] + ":" + datevalues[5];

  });

  paintingCompetitionInstance.winner.call(function(err, result) {

    if(result == 0x0000000000000000000000000000000000000000)
      document.getElementById("winningArtist").innerHTML = "No Winner Yet";
    else
      document.getElementById("winningArtist").innerHTML = "Winner is " + result;
  });


  $("#register").click(function() {
    var name = $("#name").val();
    var email = $("#email").val();
    var url = $("#url").val();
    registerArtist(name, email, url);
    return false;
  });

  $(".vote").click(function() {
    var artist = $(this).closest("tr").find('td:eq(3)').text();
		vote(artist);
	});

  $(".certify").click(function() {
    var artist = $(this).closest("tr").find('td:eq(3)').text();
		certifyArtist(artist);
  });

  $("#winner").click(function() {
		getWinner();
  });
}

function registerArtist(name, email, url) {
  let fee = web3.toWei(0.1);
  paintingCompetitionInstance.registerArtist(name, email, url, {
      from: user,
      value: fee
    },
    function(err, res) {
      if (!err) {
        Snackbar.show({
          pos: 'top-center',
          text: "Transaction is Posted"
        });
      } else {
        Snackbar.show({
          pos: 'top-center',
          text: "Transaction is Cancelled"
        });
      }
    });
}


function vote(artist_address) {
  paintingCompetitionInstance.vote(artist_address, {
    from: user
  }, function(err, res) {
    console.log(res);
    if (!err) {
      Snackbar.show({
        pos: 'top-center',
        text: "Transaction is Posted"
      });
    } else {
      Snackbar.show({
        pos: 'top-center',
        text: "Transaction Was Cancelled"
      });
    }
  });
}

function certifyArtist (artist_address) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", absolute_url + '/api/certify', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    from: user,
    artist_address: artist_address
  }));
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      Snackbar.show({
        pos: 'top-center',
        text: "Artist Certified successfully"
      });
    } else if (xhr.readyState === 4 && xhr.status === 400)  {
      console.log(xhr.response);
    }
  }
}

function getWinner() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", absolute_url + '/api/winner', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    from: user
  }));

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.response);
      Snackbar.show({
        pos: 'top-center',
        text: "Transaction is Posted"
      });
    } else if (xhr.readyState === 4 && xhr.status === 400)  {
      console.log(xhr.response);
    }
  }

}
