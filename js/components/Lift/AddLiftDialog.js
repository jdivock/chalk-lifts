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

export default class AddLiftDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    workout: PropTypes.object,
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
    const {
      lift,
      sets,
      rep,
      weight,
    } = this.state;

    Relay.Store.commitUpdate(
      new AddLiftMutation({
        workout_id: this.props.workout.id,
        lift,
        sets,
        rep,
        weight,
      })
    );
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

export default Relay.createContainer(AddLiftDialog, {
  fragments: {
    workout: () => Relay.QL`
      fragment on Workout {
        id,
      }
    `,
  },
});
