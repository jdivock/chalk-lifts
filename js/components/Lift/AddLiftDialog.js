import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Debug from 'debug';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

import {
  AddLiftMutation,
  EditLiftMutation,
} from 'mutations/lift';

const styles = {
  textField: {
    display: 'block',
  },
};

const SAVE_TYPE = {
  NEW: 'new',
  EDIT: 'edit',
};

const debug = Debug('chalk-lifts:components/AddLiftDialog');
debug('Building AddLiftDialog');

class AddLiftDialog extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    workout: PropTypes.object,
    lift: PropTypes.object,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.lift) {
      this.setState({
        name: nextProps.lift.name,
        sets: nextProps.lift.sets,
        reps: nextProps.lift.reps,
        weight: nextProps.lift.weight,
        saveType: SAVE_TYPE.EDIT,
      });
    } else {
      this.setState({
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        saveType: SAVE_TYPE.NEW,
      });
    }
  }

  handleSave = () => {
    const {
      name,
      sets,
      reps,
      weight,
      saveType,
    } = this.state;

    const {
      workout,
      handleClose,
      lift,
    } = this.props;

    debug(saveType);

    if (saveType === SAVE_TYPE.NEW) {
      Relay.Store.commitUpdate(
        new AddLiftMutation({
          name,
          sets,
          reps,
          weight,
          workout,
        })
      );
    } else {
      Relay.Store.commitUpdate(
        new EditLiftMutation({
          id: lift.id,
          workout_id: lift.workout_id,
          name,
          sets,
          reps,
          weight,
        })
      );
    }

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
      },
    `,
  },
});
