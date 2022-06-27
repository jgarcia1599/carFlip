//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";


contract Escrow {
	address payable public escrowAgent;
	uint public escrowAgentCommission; // percent comision integer. needs to be between 1 and 10. 
	address payable public carBuyer;
	address payable public carSeller;
	string public carVIN;
	uint public carPrice;


	bool public isApproved;
	bool public isCarOk = false;

	constructor(address payable _escrowAgent, address payable _carBuyer, uint _escrowAgentCommission, uint _carPrice,  string memory _carVIN) payable {
		escrowAgent = _escrowAgent;
		carBuyer = _carBuyer;
		require(_escrowAgentCommission >= 1, "Escrow Agent Commission needs to be greater than or equal to 1");
		require(_escrowAgentCommission <=10, "Escrow Agent Commission needs to be less than or equal to 10");
		escrowAgentCommission = _escrowAgentCommission;
		carVIN = _carVIN;
		carPrice  = _carPrice;
		carSeller = msg.sender;
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == escrowAgent, "Only the escrow agent can approve the transaction");
		require(isCarOk == true, "Car Buyer hasn't verified car condition!");
		uint balance = address(this).balance;
		uint commision = (balance * escrowAgentCommission) / 100;
		balance = balance - commision;
		emit Approved(balance);
		isApproved = true;
		carSeller.transfer(balance);
		escrowAgent.transfer(commision);
	}
	function carIsOkay() external payable{
		// car buyer must ensure the car is in optimal condition with certified car shop
		require(msg.value != carPrice, "You must send the amount desired by the car seller");
		require(msg.sender == carBuyer, "Only the car buyer can approve this transaction");
		isCarOk = true;
	}
}
