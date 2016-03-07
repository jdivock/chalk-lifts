drop database apeshitfuckjacked;

create database apeshitfuckjacked;
\c apeshitfuckjacked


DROP TABLE Account CASCADE;
DROP TABLE Workout CASCADE;
DROP TABLE Lift;

CREATE TABLE Account (
	id serial primary key,
	name VARCHAR(255),
	email VARCHAR(100),
	password VARCHAR(40),
  profile_pic_url VARCHAR(100)
);

CREATE TABLE Workout
(
	id serial primary key,
	date timestamp default current_timestamp,
	name VARCHAR(100),
	comments VARCHAR(500),
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES Account(id)
);

CREATE TABLE Lift
(
	id serial PRIMARY KEY,
	workout_id INTEGER,
	name VARCHAR(100),
	reps INTEGER,
	sets INTEGER,
	weight INTEGER,
	comments VARCHAR(500),
	FOREIGN KEY(workout_id) REFERENCES Workout(id)
);

INSERT INTO Account(name, email, password, profile_pic_url)
VALUES
('jdivock', 'jdivock@jdivock.com', 'asdf', 'http://www.gravatar.com/avatar/7185c88617c1a8f06add08209fbb9173.jpg'),
('tpip', 'tpip@jdivock.com', 'asdf', null);

INSERT INTO Workout(date, name, user_id)
VALUES
('2015-01-08 04:05:06', 'Squat day', 1),
('2015-01-18 04:05:06', 'Deadlift day', 1),
('2015-01-28 04:05:06', 'Bench day', 1),
('2015-02-08 04:05:06', 'Front Squat day', 1),
('2015-03-18 04:05:06', 'Upper Acc. day', 1),
('2015-03-08 04:05:06', 'Bench day', 2),
('2015-04-08 04:05:06', 'Front Squat day', 2),
('2015-06-08 04:05:06', 'Upper Acc. day', 2);

INSERT INTO Lift(workout_id, name, reps, sets, weight)
VALUES
(1, 'Squat', 5, 3, 315),
(1, 'Paused HB Squat', 8, 3, 225),
(1, 'Good Mornings', 8, 3, 135),
(1, 'Situps', 10, 3, 0),
(2, 'Deadlift', 5, 3, 315),
(2, 'Deficit Deadlift', 8, 3, 225),
(2, 'Deficit Straight Leg Deadlift', 8, 3, 135),
(2, 'GHR', 10, 3, 0),
(3, 'Front Squat', 5, 3, 315),
(3, 'Heavy Front Squat', 8, 3, 225),
(3, 'BB Rows', 8, 3, 135),
(3, 'Shrugs', 10, 3, 0),
(4, 'Squat', 5, 3, 315),
(4, 'Paused HB Squat', 8, 3, 225),
(4, 'Good Mornings', 8, 3, 135),
(4, 'Situps', 10, 3, 0),
(5, 'Deadlift', 5, 3, 315),
(5, 'Deficit Deadlift', 8, 3, 225),
(5, 'Deficit Straight Leg Deadlift', 8, 3, 135),
(5, 'GHR', 10, 3, 0);
