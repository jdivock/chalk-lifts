import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader, CardText } from 'material-ui';

const Workout = ({ workout }) =>
  <Card>
    <CardHeader
      title={ workout.date || 'Test Date' }
      subtitle={ workout.name }
    />
    <CardText>
      Lift info here
    </CardText>
  </Card>;

Workout.propTypes = {
  workout: PropTypes.object,
};

export default Relay.createContainer(Workout, {
  fragments: {
    workout: () => Relay.QL`
      fragment on Workout {
        name,
        date
      }
    `,
  },
});
