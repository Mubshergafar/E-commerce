const User = require("../models/User");

class UserHelper {
  async verifyUser(data) {
    const username = data;

    try {
      const user = await User.findOne({ username });

      if (!!user) throw new Error("is have this user in db");

      return user;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserHelper();
