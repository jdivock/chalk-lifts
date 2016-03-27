import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Debug from 'debug';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

import { AddLiftMutation } from '../../mutations';

const styles = {
  textField: {
    display: 'block',
  },
};

const debug = Debug('chalk-lifts:components/AddLiftDialog');

debug('Building AddLiftDialog');

class AddLiftDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    workout: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
    };
  }

  handleSave = () => {
    const {
      name,
      sets,
      reps,
      weight,
    } = this.state;

    const {
      workout,
      handleClose,
    } = this.props;

    Relay.Store.commitUpdate(
      new AddLiftMutation({
        name,
        sets,
        reps,
        weight,
        workout,
      })
    );
    handleClose();
  }

  handleLiftChange = ({ target }) => {
    this.setState({
      name: target.value,
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

    const {
      name,
      reps,
      sets,
      weight,
    } = this.state;

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
          value={name}
          style={styles.textField}
        />
        <TextField
          hintText="Weight"
          onChange={this.handleWeightChange}
          style={styles.textField}
          value={weight}
        />
        <TextField
          hintText="Sets"
          onChange={this.handleSetsChange}
          style={styles.textField}
          value={sets}
        />
        <TextField
          hintText="Reps"
          onChange={this.handleRepsChange}
          style={styles.textField}
          value={reps}
        />
      </Dialog>
    );
  }
}

export default Relay.createContainer(AddLiftDialog, {
  fragments: {
    workout: () => Relay.QL`
      fragment on Workout {
        ${AddLiftMutation.getFragment('workout')},
      }
    `,
  },
});
