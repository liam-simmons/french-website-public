const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
require("../passport");
//const router = express.Router();

const { validateBody, schemas } = require("../helpers/routeHelpers");
const UsersController = require("../controllers/users");

router
  .route("/signup")
  .post(validateBody(schemas.signupSchema), UsersController.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.signinSchema),
    passport.authenticate("local", { session: false }),
    UsersController.signIn
  );

router
  .route("/check-authorized")
  .get(
    validateBody(schemas.checkAuthorizedSchema),
    passport.authenticate("jwt", { session: false }),
    UsersController.checkAuthorized
  );

router
  .route("/signout")
  .post(
    validateBody(schemas.signoutSchema),
    passport.authenticate("jwt", { session: false }),
    UsersController.signout
  );

router
  .route("/add-word")
  .post(
    validateBody(schemas.addWordSchema),
    passport.authenticate("jwt", { session: false }),
    UsersController.addWord
  );

router
  .route("/set-favourite-image")
  .post(
    validateBody(schemas.setFavouriteImageSchema),
    passport.authenticate("jwt", { session: false }),
    UsersController.setFavouriteImage
  );

router
  .route("/due-words")
  .get(
    passport.authenticate("jwt", { session: false }),
    UsersController.dueWords
  );

router
  .route("/word-result")
  .post(
    passport.authenticate("jwt", { session: false }),
    UsersController.wordResult
  );

router
  .route("/words")
  .get(
    passport.authenticate("jwt", { session: false }),
    UsersController.getWords
  );

router
  .route("/test-user")
  .post(validateBody(schemas.testUserSchema), UsersController.testUserCreate);

module.exports = router;
