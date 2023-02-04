import react, { Component } from "react";
import { Modal } from "semantic-ui-react";

class ModalComponent extends Component {
  static getInitialProps() {
    const openDialog = props.openDialog;

    return { openDialog };
  }

  render() {
    return (
      <Modal
        open={this.props.openDialog}
        header="Reminder!"
        content="Call Benjamin regarding the reports."
        actions={["Snooze", { key: "done", content: "Done", positive: true }]}
      />
    );
  }
}

export default ModalComponent;
