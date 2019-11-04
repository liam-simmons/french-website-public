const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

const imageSchema = new Schema({
  creatorId: ObjectId,
  wordIds: [ObjectId],
  definitionIds: [Number], //there can be up to 3 definitions per word so need to have this too
  image: Buffer
});

const ImageCategory = mongoose.model("image", imageSchema);

module.exports = ImageCategory;
