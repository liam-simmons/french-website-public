const express = require("express");
const router = require("express-promise-router")();
const multer = require("multer");
const passport = require("passport");
require("../passport");

const ImagesController = require("../controllers/images");
const {
  validateBody,
  validateQuery,
  schemas,
  checkFileType
} = require("../helpers/routeHelpers");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

router
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("image"),
    validateBody(schemas.createImageSchema),
    ImagesController.createImage
  );

router
  .route("/")
  .get(validateQuery(schemas.getImageSchema), ImagesController.getImage);

router
  .route("/get-images")
  .get(validateQuery(schemas.getImagesSchema), ImagesController.getImages);

module.exports = router;
