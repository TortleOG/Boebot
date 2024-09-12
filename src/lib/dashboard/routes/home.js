const url = require("url");
const { Router } = require("express");

const router = Router();

module.exports = (dashboard, { app, passport }) => {
  router.get("/", (req, res) => res.render(`${dashboard.dataDir}index.ejs`, {
    client: dashboard.client,
    user: req.isAuthenticated() ? dashboard.users.get(req.user) : null,
    auth: req.isAuthenticated(),
  }));

  router.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  }, passport.authenticate("discord"));

  router.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), (req, res) => {
    if (req.session.backURL) {
      res.redirect(req.session.backURL);
      req.session.backURL = null;
    } else {
      res.redirect("/");
    }
  });

  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  return router;
};
