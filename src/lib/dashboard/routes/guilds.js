const { Router } = require("express");

const router = Router();

module.exports = (dashboard, middleware) => {
  router.use(middleware);

  router.get("/:id", (req, res) => {
    const guild = dashboard.client.guilds.get(req.params.id);
    return res.render(`${dashboard.dataDir}guilds.ejs`, {
      client: dashboard.client,
      user: req.isAuthenticated() ? dashboard.users.get(req.user) : null,
      auth: req.isAuthenticated(),
      guild,
    });
  });

  return router;
};
