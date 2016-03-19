{
  account(email:"jay@jay.com") {
    name,
    email,
    profile_pic_url,
    workouts {
      edges {
        node {
          ...test
        }
      }
    }
  }
}


fragment test on Workout {
  name,
  date,
  created_at,
  lifts {
    edges {
      node {
        id
        name,
        reps,
        weight,
        sets,

      }
    }
  }
}
