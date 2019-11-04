const router = require("express-promise-router")();
const multer = require("multer");
const passport = require("passport");
require("../passport");

const {
  validateBody,
  validateQuery,
  schemas,
  checkFileType,
  checkAuthorizationLevel
} = require("../helpers/routeHelpers");
const WordControllers = require("../controllers/words");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

router
  .route("/create-word")
  .post(
    upload.array("image"),
    validateBody(schemas.createWordSchema),
    passport.authenticate("jwt", { session: false }),
    checkAuthorizationLevel(1),
    WordControllers.createWord
  );

router
  .route("/update-word")
  .post(
    upload.array("image"),
    validateBody(schemas.updateWordSchema),
    passport.authenticate("jwt", { session: false }),
    checkAuthorizationLevel(1),
    WordControllers.updateWord
  );

router
  .route("/set-category")
  .post(
    validateBody(schemas.setCategorySchema),
    passport.authenticate("jwt", { session: false }),
    checkAuthorizationLevel(1),
    WordControllers.setCategory
  );

router
  .route("/")
  .get(validateQuery(schemas.getWordsSchema), WordControllers.getWords);

router
  .route("/from-user")
  .get(
    validateQuery(schemas.getWordsSchema),
    passport.authenticate("jwt", { session: false }),
    WordControllers.getWordsFromUser
  );

module.exports = router;

/*router
  .route("/set-image")
  .post(upload.single("image"), WordControllers.setImage);*/
