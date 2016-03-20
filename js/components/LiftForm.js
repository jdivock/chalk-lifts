import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';

export default class LiftForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
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

  render() {
    return (
      <div>
        <TextField
          hintText="Lift"
        />
      </div>
    );
  }
}
