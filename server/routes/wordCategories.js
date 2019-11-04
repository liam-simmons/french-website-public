const router = require("express-promise-router")();
const passport = require("passport");

const { validateBody, schemas } = require("../helpers/routeHelpers");
const wordCategoryControllers = require("../controllers/wordCategories");
require("../passport");

router
  .route("/")
  .post(
    validateBody(schemas.createCategorySchema),
    wordCategoryControllers.createCategory
  );

router.route("/").get(wordCategoryControllers.getCategories);

router
  .route("/category")
  .get(
    passport.authenticate("jwt", { session: false }),
    validateBody(schemas.getCategorySchema),
    wordCategoryControllers.getCategory
  );

module.exports = router;
