import react, { Component } from "react";
import { Container } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";

class Layout extends Component {
  render() {
    return (
      <Container style={{ marginTop: "10px" }}>
        <Head>
          <link
            async
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
          />
        </Head>
        <Header />
        <div>{this.props.children}</div>
      </Container>
    );
  }
}

export default Layout;
