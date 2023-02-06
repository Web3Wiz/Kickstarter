import react, { Component } from "react";
import Campaign from "../scripts/campaign";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { web3 } from "../scripts/web3";
import Router from "next/router";

class ContributeForm extends Component {
  state = {
    contributionAmount: "",
    errorMessage: "",
    isLoading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    console.log(
      "Form Submitted...",
      this.props.address,
      this.state.contributionAmount
    );

    this.setState({ errorMessage: "", isLoading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contributionAmount, "ether"),
      });

      Router.push(`/campaigns/${this.props.address}`);
    } catch (err) {
      console.log(err.message);
      this.setState({ errorMessage: err.message });
    }
    this.setState({ isLoading: false, contributionAmount: "" });
  };

  render() {
    return (
      <div>
        <h3>Contribute to this campaign!</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.contributionAmount}
              onChange={(event) =>
                this.setState({ contributionAmount: event.target.value })
              }
            />
            <br /> <br />
            <Button primary loading={this.state.isLoading}>
              Contribute!
            </Button>
            <Message
              error
              header="Oops!"
              content={this.state.errorMessage}
              visible={this.state.errorMessage != ""}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}

export default ContributeForm;
