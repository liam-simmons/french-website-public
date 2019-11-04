const router = require("express-promise-router")();
const passport = require("passport");

const ForumsController = require("../controllers/forums");
require("../passport");

router
  .route("/new")
  .post(
    passport.authenticate("jwt", { session: false }),
    ForumsController.postThread
  );

router
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    ForumsController.postMessage
  );

router.route("/threads").get(ForumsController.getThreads);

router.route("/posts").get(ForumsController.getPosts);

module.exports = router;
