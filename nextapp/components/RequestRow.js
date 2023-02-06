import React, { Component } from "react";
import {
  Table,
  Button,
  Segment,
  Dimmer,
  Image,
  Loader,
} from "semantic-ui-react";
import { web3 } from "../scripts/web3";
import Campaign from "../scripts/campaign";
import PortalComponent from "./Portal";
import Router from "next/router";

class RequestRow extends Component {
  state = { open: false, header: "", message: "" };
  handleClose = () => this.setState({ open: false });

  showMessageDialog = (header, message) => {
    this.setState({ open: true, header: header, message: message });
  };

  onApprove = async () => {
    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });
      this.showMessageDialog("Success", "Request is successfully approved!");
    } catch (err) {
      this.showMessageDialog("Error", err.message);
    }

    Router.push(`/campaigns/requests/${this.props.address}`);
  };

  onFinalize = async () => {
    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] });
      this.showMessageDialog("Success", "Request is successfully finalized!");
    } catch (err) {
      this.showMessageDialog("Error", err.message);
    }

    Router.push(`/campaigns/requests/${this.props.address}`);
  };

  render() {
    const { open, header, message } = this.state;
    const { Row, Cell } = Table;
    const { request, id, approversCount } = this.props;
    const readyToFinalize = request.approvalsCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.amount, "ether")}</Cell>
        <Cell>{request.recepient}</Cell>
        <Cell>
          {request.approvalsCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <div>
              <Button color="green" basic onClick={this.onApprove}>
                Approve
              </Button>
              {this.state.open ? (
                <PortalComponent
                  open={open}
                  header={header}
                  message={message}
                  handleClose={this.handleClose}
                />
              ) : null}
            </div>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}
export default RequestRow;
