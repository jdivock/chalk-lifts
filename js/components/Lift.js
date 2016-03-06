import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Card, CardHeader, CardText } from 'material-ui';

const Lift = ({ lift }) => {
  let weight;
  if (lift.weight) {
    weight = `${lift.weight} x `;
  } else {
    weight = '';
  }

  return (
    <Card style={{ marginLeft: 10, marginRight: 10 }}>
      <CardHeader
        style={{ height: 30 }}
        title={lift.name}
      />
      <CardText>
        {weight} {lift.sets} x {lift.reps}
      </CardText>
    </Card>
  );
};

Lift.propTypes = {
  lift: PropTypes.object,
};

export default Relay.createContainer(Lift, {
  fragments: {
    lift: () => Relay.QL`
      fragment on Lift {
        name,
        weight,
        sets,
        reps
      }
    `,
  },
});
