# CarFlip 🚗
A platform to facilitate car ownership transfers by leveraging the Ethereum Blockchain. 

<im src="docs/app_image_1.png"/>
<im src="docs/app_image_2.png"/>

## Description
CarFlip is a Dapp platform that facilitates car ownership transfers by leveraging the Ethereum Blockchain. It is an escrow-type application that makes it easier for car buyers and sellers to transfer car ownership through a three-step process that renders powerful third-party intermediaries useless. In places where the second-hand car market is completely saturated, it becomes challenging for both car buyers and sellers to undergo the car ownership transfer process efficiently. Car Sellers often need to scour through thousands of fraudulent car buy requests, leading them to outsource this process through intermediaries that charge very high commission fees. Car Buyers often need to rely on such intermediaries to find a reliable car and buyer. However, such intermediaries often play in cahoots with the car buyer as they are paying them, leaving the car buyer blind-sighted from the intrinsic details of the car transfer process. With this Dapp, car buyers and sellers can rely on anonymous escrow agents to ensure that the process is legitimate. Escrow Agents gain recognition through an in-app review system, and the app (through smart contracts) guarantees that a certified car shop has inspected the car before the money transfer occurs. 

<b>Our three steps process is as follows:</b>
- Car Seller issues a contract with the desired car price, car buyer address, desired escrow agent address,  and commission to give to the escrow agent.  
- Car Buyer is now free to take the car through an inspection with the car owner to a certified car shop to ensure the vehicle is in pristine condition before the money transfer occurs. After the car buyer inspects the car and uploads the inspection report to the app, the money is transferred to the smart contract. 
- The Escrow Agent can now review the inspection report and approve the transaction, which sends the money to the car seller and the commission to the escrow agent.

After the above process culminates, car buyers and sellers can rate the escrow agent. The escrow agents' performance stats are publicly shown in the app for transparency and reliability. 


## Installation Steps

- Install Metamask
- Delete unnecessary files created during development
```
bash ./remove-files.sh
```
- Install all dependencies
```
npm install
```
- Run hardhat local network
```
npx hardhat node
```
- Connect metamask ot hardhat local network
- Grab 3 accounts from the hardhat local network and import them into metamask. If you are setting up the app again after some usage, it helps to reset the account as the local network has no remembrance of previous transactions, hence creating nonce related transaction errors. Go to Settings > Advanced > Reset Account in metamask and click on Reset Account to delete all history. 
- Compile Smart Contract
```
npx hardhat --network localhost compile
```
-  Run API
```
nodemon api/index.js
```

- Run UI

```
cd frontend/
npm start
```

- Create postgres database: 
```
sudo -u postgres psql
postgres=# create database hardhat;
postgres=# create user hardhatuser with encrypted password 'hardhatpassword';
postgres=# grant all privileges on database hardhat to hardhatuser;
```
The connection string for the above db would be ```postgres://hardhatuser:hardhatpassword@127.0.0.1:5432/hardhat```.


## Miscellaneous 
### Sample Test accounts Hardhat 
These are the hardhat public keys I used while developing this app. 
Account 2: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 3: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account 4: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC



<b>Everything written below this line is the hardhat boilerplate project documentation...</b>

# Hardhat Hackathon Boilerplate

This repository contains a sample project that you can use as the starting point
for your Ethereum project. It's also a great fit for learning the basics of
smart contract development.

This project is intended to be used with the
[Hardhat Beginners Tutorial](https://hardhat.org/tutorial), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, `scripts` and `frontend` directories.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/nomiclabs/hardhat-hackathon-boilerplate.git
cd hardhat-hackathon-boilerplate
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

> Note: There's [an issue in `ganache-core`](https://github.com/trufflesuite/ganache-core/issues/650) that can make the `npm install` step fail. 
>
> If you see `npm ERR! code ENOLOCAL`, try running `npm ci` instead of `npm install`.

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://hardhat.org/tutorial).

- [Writing and compiling contracts](https://hardhat.org/tutorial/writing-and-compiling-contracts/)
- [Setting up the environment](https://hardhat.org/tutorial/setting-up-the-environment/)
- [Testing Contracts](https://hardhat.org/tutorial/testing-contracts/)
- [Setting up Metamask](https://hardhat.org/tutorial/hackathon-boilerplate-project.html#how-to-use-it)
- [Hardhat's full documentation](https://hardhat.org/getting-started/)

For a complete introduction to Hardhat, refer to [this guide](https://hardhat.org/getting-started/#overview).

## What’s Included?

Your environment will have everything you need to build a Dapp powered by Hardhat and React.

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/v5/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.
- [A sample frontend/Dapp](./frontend): A Dapp which uses [Create React App](https://github.com/facebook/create-react-app).

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.

## Feedback, help and news

We'd love to have your feedback on this tutorial. Feel free to reach us through
this repository or [our Discord server](https://invite.gg/HardhatSupport).

Also you can [follow us on Twitter](https://twitter.com/HardhatHQ).

**Happy _building_!**
