import React, { PropTypes } from 'react';
import Debug from 'debug';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

const styles = {
  textField: {
    display: 'block',
  },
};

const debug = Debug('chalk-lifts:components/AddLiftDialog');

debug('Building AddLiftDialog');

export default class AddLiftDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      lift: null,
      sets: null,
      reps: null,
      weight: null,
    };
  }

  handleSave = () => {

  }

  handleLiftChange = ({ target }) => {
    this.setState({
      lift: target.value,
    });
  }

  handleSetsChange = ({ target }) => {
    this.setState({
      sets: target.value,
    });
  }

  handleRepsChange = ({ target }) => {
    this.setState({
      reps: target.value,
    });
  }

  handleWeightChange = ({ target }) => {
    this.setState({
      weight: target.value,
    });
  }

  render() {
    const {
      open,
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={this.handleSave}
      />,
    ];

    return (
      <Dialog
        title="Add Lift"
        actions={actions}
        modal
        open={open}
      >
        <TextField
          hintText="Lift"
          onChange={this.handleLiftChange}
          style={styles.textField}
        />
        <TextField
          hintText="Weight"
          onChange={this.handleWeightChange}
          style={styles.textField}
        />
        <TextField
          hintText="Sets"
          onChange={this.handleSetsChange}
          style={styles.textField}
        />
        <TextField
          hintText="Reps"
          onChange={this.handleRepsChange}
          style={styles.textField}
        />
      </Dialog>
    );
  }
}

AddLiftDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

AddLiftDialog.displayName = 'AddLiftDialog';

export default AddLiftDialog;
