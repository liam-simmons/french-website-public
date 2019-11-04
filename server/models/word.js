const mongoose = require("mongoose");
const fs = require("fs");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const WordCategory = "./WordCategory";

//create a schema
const wordsSchema = new Schema({
  //up to three translations per word, not using array so searching can be easier
  english: {
    type: String,
    required: true
  },
  english2: String,
  english3: String,
  french: {
    type: String,
    required: true,
    unique: true
  },
  ipa: {
    type: String,
    required: true
  },
  //image for each translation
  images: [ObjectId],
  information: {
    type: String
  },
  synonyms: {
    type: String
  },
  example: {
    type: String
  },
  //categories are added here to save searching each category for the word every time i want to display a word's category
  categories: [String]
});

//methods
/*wordsSchema.methods.addCategories(categories){
  for (let i=0; i < categories.length; i++){
    //check if the category is already included
    for (let j=0; j<this.categories.length; j++){
      if (categories[i] === categories[j]) {/*end loop*}

    }
    this.categories.push(categories[i]);
  }
}*/

/*wordsSchema.methods.update = function({ english, french, ipa, information }) {
  try {
    if (english) this.english = english;
    if (french) this.french = french;
    if (ipa) this.ipa = ipa;
    if (information) this.information = information;
  } catch (error) {
    throw new Error(error);
  }

  this.save();
};*/

//not necessary in future?
wordsSchema.methods.setImage = async function({ imageFile, index }) {
  //FUTURE REQUIREMENTS:
  //SET TO ASYNC ?
  //MAKE SURE IT'S AN SVG
  try {
    this.images[index] = await fs.readFileSync(imageFile.path);

    //delete the locally stored file:
    await fs.unlinkSync(imageFile.path);
  } catch (error) {
    throw new Error(error);
  }
};
//not necessary in future?
wordsSchema.methods.setImages = async function({ imageFiles, imageIndices }) {
  try {
    //think about this
    for (let i = 0; i < imageFiles.length; i++) {
      await this.setImage({
        imageFile: imageFiles[i],
        index: (imageIndices && imageIndices[i]) || i
      });
    }
    //this might be able to be only used on one element of an array and not the whole thing:
    //set to modified so that mongoose updates the imgaes array when calling save
    this.markModified("images");
  } catch (error) {
    throw new Error(error);
  }
};

wordsSchema.methods.setCategory = async function({ categoryName }) {
  try {
    for (let i = 0; i < this.categories.length; i++)
      if (this.categories[i] === categoryName)
        throw new Error(`Word ${wordId} already has that category`);

    this.categories.push(categoryName);
    this.markModified("categories");
  } catch (error) {
    throw new Error(error);
  }
};

wordsSchema.methods.setImageIds = async function({ imageIds, imageIndices }) {
  try {
    if (imageIndices.length != imageIds.length)
      throw new Error(`imageIndices and imageIds aren't the same size`);
    for (let i = 0; i < imageIndices.length; i++) {
      if (imageIndices[i] > 2 || imageIndices[i] < 0)
        throw new Error(
          `index ${imageIndices[i]} is invalid. Maximum is 2 and minimum is 0`
        );
      this.images[imageIndices[i]] = imageIds[i];
    }
    this.markModified("images");
  } catch (error) {
    throw new Error(error);
  }
};

//create a model
const Word = mongoose.model("word", wordsSchema);

//export the model
module.exports = Word;
