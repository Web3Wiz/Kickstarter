import react, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../scripts/campaign";
import RequestRow from "../../../components/RequestRow";
import Link from "next/link";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map(async (element, index) => {
          return await campaign.methods.requests(index).call();
        })
    );
    return { address, requests, requestCount, approversCount };
  }

  renderRequestRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          address={this.props.address}
          request={request}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, HeaderCell, Row, Body } = Table;
    return (
      <Layout>
        <h3>Requests List</h3>
        <Link href={`/campaigns/requests/new/${this.props.address}`}>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recepient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRequestRows()}</Body>
        </Table>
        <label>Found {this.props.requestCount} reqests.</label>
      </Layout>
    );
  }
}

export default RequestIndex;
