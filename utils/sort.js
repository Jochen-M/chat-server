exports.sortByUsername = (user1, user2) => {
  if(user1.username > user2.username) {
    return 1;
  } else if(user1.username < user2.username) {
    return -1;
  } else {
    return 0;
  }
}
