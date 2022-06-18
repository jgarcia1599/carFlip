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

	bool public isApproved;

	constructor(address _arbiter, address payable _beneficiary) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter);
		uint balance = address(this).balance;
		beneficiary.transfer(balance);
		emit Approved(balance);
		isApproved = true;
	}
}
