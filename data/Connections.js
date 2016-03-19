import Workout from './Workout';
import Lift from './Lift';

import {
  connectionDefinitions,
} from 'graphql-relay';

export const {
  connectionType: WorkoutConnection,
} = connectionDefinitions({
  name: 'Workout',
  nodeType: Workout,
});

export const {
  connectionType: LiftConnection,
} = connectionDefinitions({
  name: 'Lift',
  nodeType: Lift,
});
