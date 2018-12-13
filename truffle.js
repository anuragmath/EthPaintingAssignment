var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "replace mnemonic here";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
    // ropsten: {
    //   provider: new HDWalletProvider(mnemonic, "ropsten node url"),
    //   network_id: 3,
    //   gas: 4612388
    // },
    // rinkeby: {
    //   provider: new HDWalletProvider(mnemonic, "rinkeby node url"),
    //   network_id: 4,
    //   gas: 6712390
    // }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
