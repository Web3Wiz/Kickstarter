import react, { Component } from "react";
import { Button, Portal, Segment, Header } from "semantic-ui-react";

class PortalComponent extends Component {
  state = { open: false };

  static getInitialProps() {
    const { open, header, message, handleClose } = props;

    return { open, header, message, handleClose };
  }

  render() {
    const { open, header, message, handleClose } = this.props;
    return (
      <Portal onClose={handleClose} open={open}>
        <Segment
          style={{
            left: "40%",
            position: "fixed",
            top: "50%",
            zIndex: 1000,
          }}
        >
          <Header>{header}</Header>
          <p>{message}</p>

          <Button content="Close" negative onClick={handleClose} />
        </Segment>
      </Portal>
    );
  }
}

export default PortalComponent;
