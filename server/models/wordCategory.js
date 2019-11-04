const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
const wordCategoriesSchema = new Schema({
  name: { type: String, required: true, unique: true },
  //image,
  words: { type: [String], required: true }
});

//methods
wordCategoriesSchema.methods.addWord = async function({ wordId }) {
  try {
    //make sure the word isn't a repeat
    for (let i = 0; i < this.words.length; i++)
      if (this.words[i] === wordId) {
        throw new Error();
      } //make an error here

    //add wordId to word list and save
    this.words.push(wordId);
    this.markModified("words");
  } catch (error) {
    throw new Error(error);
  }
};

//model
const WordCategory = mongoose.model(
  "word-category",
  wordCategoriesSchema,
  "word-categories"
);

//export
module.exports = WordCategory;
