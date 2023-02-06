import react, { Component } from "react";
import { web3 } from "../scripts/web3";
import factory from "../scripts/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`./campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href="./campaigns/new">
          <Button
            content="Create Campaign"
            icon="plus circle"
            floated="right"
            primary
          />
        </Link>
        <div>{this.renderCampaigns()}</div>
      </Layout>
    );
  }
}

export default CampaignIndex;
