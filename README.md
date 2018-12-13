# Documentation For Assignment

## Quick Setup (Using Local Geth)

This guide is for deploying of contract using Local Geth Node (ganache-cli)

```sh
$ ganache-cli -m "Account mnemonic here"
```

#### Contract Deployment

Step 1: Update the mnemonic with your 12 words mnemonic used for deploying the contract in truffle.js
        ```
        var mnemonic = "12 words mnemonic here";
        ```
Note: Before going to Step-2, please confirm that the truffle compiler version is updated.

  Check truffle verison using
  ```sh
  $ truffle version
  ```
  Output should be:
  ```
  Truffle v4.1.8 (core: 4.1.8)
  Solidity v0.4.23 (solc-js)
  ```
  if compiler version is not 0.4.23, please update compiler using
```sh
$ npm install -g truffle
```

Step 2: Install the node dependencies using

```sh
$ npm install
```

Step 3: Deploy the contracts. Inside project root directory run the following commands
```sh
$ truffle compile
$ truffle migrate
```

Step 4: Get the address of the deployed PaintingCompetition contract. Update that in /webapp/public/javascripts/main_web3.js. Also, Update the address in webapp/api/dashboardController.js

#### Application Deployment

Step 1: Update account mnemonic in app.js

Step 2: Install the node dependencies using

```sh
$ npm install
```

Step 7: Run the application

```sh
$ npm start
```

#### Details and Assumptions for development

1. Current Registration Deadline and Voting Deadline is set to 10 mins and 20 mins from the time of deployment of contract. If you want to change those, please check the migrations folder.

2. A user could vote multiple times for a artist.

3. Certify And Winner Api can be called by anyone from the frontend as there is not authorisation there. But the transaction for certifying a painting always happens using the account which is owner by gallery owner in backend without using metamask.

4. Winner API can be called once the voting period is over.

5. Deployer of contract is the certifier of paintings.
