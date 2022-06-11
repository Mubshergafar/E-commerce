class Resquestmiddleware {
  registerMiddleware(req, res, next) {
    const body = req.body;

    if (!body.username)
      return res.status(404).json({ message: "username is required" });

    if (!body.email)
      return res.status(404).json({ message: "email is required" });

    if (!body.password)
      return res.status(404).json({ message: "password is required" });

    next();
  }

  loginMiddleware(req, res, next) {
    const body = req.body;

    if (!body.username)
      return res.status(404).json({ message: "username is required" });

    if (!body.password)
      return res.status(404).json({ message: "password is required" });

    next();
  }
}

module.exports = new Resquestmiddleware();
