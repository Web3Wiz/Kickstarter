// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = (address)(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint amount;
        address payable recepient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(uint minimum, address creator) {
        minimumContribution = minimum;
        manager = creator;
    }

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint amount,
        address payable recepient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.amount = amount;
        newRequest.recepient = recepient;
        newRequest.complete = false;
        newRequest.approvalsCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalsCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage request = requests[index];

        require(request.approvalsCount > (approversCount / 2));

        request.recepient.transfer(request.amount);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}

/*
Current gas price: 13689
Estimated gas: 1302431
Deployer balance:  14.378359813245930123
Deployment price:  0.000000017828977959
Campaign Factory contract address is 0xF47F04CC465AB087301E6aC45E5E9544d0F50298
*/
