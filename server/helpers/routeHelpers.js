const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const path = require("path");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value.body = result.value;
      next();
    };
  },
  validateQuery: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.query, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value.body = result.value;
      next();
    };
  },

  checkAuthorizationLevel: levelRequired => {
    return (req, res, next) => {
      const { user } = req;
      if (user.authLevel >= levelRequired) next();
      else return res.json({ Error: "Auth level too low" });
    };
  },

  schemas: {
    //images
    createImageSchema: Joi.object().keys({
      wordIds: Joi.array()
        .items(Joi.objectId())
        .required(),
      definitionIds: Joi.array()
        .items(Joi.number())
        .required(),
      setFavourite: Joi.array()
        .items(Joi.boolean())
        .required()
    }),
    getImageSchema: Joi.object().keys({
      imageId: Joi.objectId().required()
    }),
    getImagesSchema: Joi.object().keys({
      imageIds: Joi.array()
        .items(Joi.objectId())
        .max(3)
        .required()
    }),
    //users
    signupSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      username: Joi.string().required()
    }),
    testUserSchema: Joi.object().keys({}),
    signinSchema: Joi.object().keys({
      password: Joi.string().required(),
      username: Joi.string().required()
    }),
    checkAuthorizedSchema: Joi.object().keys({}),
    signoutSchema: Joi.object().keys({}),
    addWordSchema: Joi.object().keys({
      wordId: Joi.objectId().required()
    }),
    setFavouriteImageSchema: Joi.object().keys({
      wordId: Joi.objectId().required(),
      definitionId: Joi.number().required(),
      imageId: Joi.objectId().required()
    }),
    wordResultSchema: Joi.object().keys({
      levelChange: Joi.number().required(),
      wordId: Joi.objectId().required(),
      type: Joi.string().required()
    }),
    //words
    createWordSchema: Joi.object().keys({
      english: Joi.string().required(),
      english2: Joi.string(),
      english3: Joi.string(),
      french: Joi.string().required(),
      ipa: Joi.string().required(),
      information: Joi.string(),
      synonyms: Joi.string(),
      example: Joi.string(),
      imageIds: Joi.array()
        .items(Joi.number())
        .max(3)
    }),
    updateWordSchema: Joi.object().keys({
      wordId: Joi.objectId().required(),
      english: Joi.string(),
      english2: Joi.string(),
      english3: Joi.string(),
      french: Joi.string(),
      ipa: Joi.string(),
      information: Joi.string(),
      synonyms: Joi.string(),
      example: Joi.string(),
      imageIds: Joi.array()
        .items(Joi.objectId())
        .max(3),
      imageIndices: Joi.array()
        .items(Joi.number())
        .max(3)
    }),
    getWordsSchema: Joi.object().keys({
      query: Joi.string(),
      number: Joi.number()
    }),
    setCategorySchema: Joi.object().keys({
      categoryName: Joi.string().required(),
      wordId: Joi.objectId().required()
    }),
    setImagesSchema: Joi.object().keys({
      wordId: Joi.objectId().required(),
      images: Joi.array()
        .items(Joi.objectId())
        .max(3)
        .required()
    }),
    //wordcategories
    createCategorySchema: Joi.object().keys({
      name: Joi.string().required(),
      wordIds: Joi.array().items(Joi.objectId())
    }),
    getCategorySchema: Joi.object().keys({
      name: Joi.string().required()
    })
  },
  checkFileType: (file, cb) => {
    //file types which are allowed:
    const filetypes = /png/;
    //check the mime type is correct
    const mimetype = filetypes.test(file.mimetype);
    //check the extension name is correct
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      //go ahead!
      return cb(null, true);
    } else {
      //send this error:
      cb("Error: Only PNG files are allowed");
    }
  }
};
