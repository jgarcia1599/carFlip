//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";


contract Escrow {
	address public arbiter;
	address payable public beneficiary;
	address public depositor;
	string public carVIN;

	bool public isApproved;
	bool public isCarOk = false;

	constructor(address _arbiter, address payable _beneficiary, string memory _carVIN) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		carVIN = _carVIN;
		depositor = msg.sender;
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter);
		require(isCarOk == true);
		uint balance = address(this).balance;
		beneficiary.transfer(balance);
		emit Approved(balance);
		isApproved = true;
	}
	function carIsOkay() external {
		require(msg.sender == beneficiary);
		isCarOk = true;
	}
}
