import react, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../scripts/factory";
import { web3 } from "../../scripts/web3";
import Router from "next/router";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    isLoading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: "", isLoading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
      Router.push("../");
    } catch (err) {
      console.log("errorMessage", err.message);
      this.setState({ errorMessage: err.message });
    }
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => {
                this.setState({ minimumContribution: event.target.value });
              }}
            ></Input>
          </Form.Field>
          <Message
            error
            header="Oops!"
            content={this.state.errorMessage}
            visible={this.state.errorMessage == "" ? false : true}
          />
          <Button primary loading={this.state.isLoading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
