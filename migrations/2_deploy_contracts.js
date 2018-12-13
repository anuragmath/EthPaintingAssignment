var PaintingCompetition = artifacts.require("./PaintingCompetition.sol");

module.exports = function(deployer) {

  const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
  };

  const registration_fee = web3.toWei(0.1);
  const timeNow = Math.floor(Date.now() / 1000);
  const registration_deadline = timeNow + duration.minutes(10);
  const voting_deadline = registration_deadline + duration.minutes(10);

  deployer.deploy(PaintingCompetition, registration_fee, registration_deadline, voting_deadline);
}
