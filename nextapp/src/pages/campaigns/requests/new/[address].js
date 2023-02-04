import react, { Component } from "react";
import Layout from "../../../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Campaign from "../../../../scripts/campaign";
import { web3 } from "../../../../scripts/web3";
import Router from "next/router";
import Link from "next/link";

class RequestNew extends Component {
  state = {
    loading: false,
    errorMessage: "",
    description: "",
    value: "",
    recepient: "",
  };

  static async getInitialProps(props) {
    const address = props.query.address;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, "ether"),
          this.state.recepient
        )
        .send({ from: accounts[0] });

      //this.setState({errorMessage:'Request is created sucessfully.', description:'', value:'', recepient: ''});
      Router.push(`/campaigns/requests/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };
  render() {
    return (
      <Layout>
        <Link href={`/campaigns/requests/${this.props.address}`}>Back</Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Amount in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recepient</label>
            <Input
              value={this.state.recepient}
              onChange={(event) =>
                this.setState({ recepient: event.target.value })
              }
            />
            <Message
              error
              header="Oops!"
              content={this.state.errorMessage}
              visible={this.state.errorMessage != ""}
            />
            <br />
            <br />
            <Button primary loading={this.state.loading}>
              Create
            </Button>
          </Form.Field>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
