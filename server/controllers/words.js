const Word = require("../models/word");
const WordCategory = require("../models/wordCategory");

const fs = require("fs");

module.exports = {
  //is this necessary with a checker middleware?
  createWord: async (req, res) => {
    const wordInfo = ({
      english,
      french,
      ipa,
      english2,
      english3,
      information,
      synonyms,
      example,
      imageIds
    } = req.body);

    //plug info into a new word
    const newWord = new Word(wordInfo);

    await newWord.save();

    res.status(200).json(newWord);
  },
  updateWord: async (req, res) => {
    //DOESNT CHECK IF INDICES AND IMAGESFILES ARE SAME SIZE

    const wordInfo = ({
      english,
      french,
      ipa,
      english2,
      english3,
      information,
      synonyms,
      example
    } = req.body);
    const { wordId, imageIds, imageIndices } = req.body;

    //find the word and update
    const word = await Word.findByIdAndUpdate(wordId, { wordInfo });

    word.setImageIds({ imageIds, imageIndices });

    await word.save();

    res.status(200).json(word);
  },
  setCategory: async (req, res) => {
    //TO DO: ASYNC WITH THE GETTING OF CATEGORIES AND WORDS | PUT THIS IN ITS OWN FUNCTION HERE
    const { categoryName, wordId } = req.body;

    //find the category and word | make them both get sent in future
    const category = await WordCategory.findOne({ name: categoryName });
    const word = await Word.findById(wordId);

    //send errors back to client if they exist errors
    const errors = {};
    if (!word) errors.word = `No word found with ID ${wordId}.`;
    if (!category)
      errors.category = `No category found with name ${categoryName}.`;
    if (Object.keys(errors).length > 0)
      throw new Error(
        `${errors.word && errors.word} ${errors.category && errors.category}`
      ); //need to improve error lol

    //add word to the category and the category to the word
    await category.addWord({ wordId });
    await word.setCategory({ categoryName });

    await category.save();
    await word.save();

    res.status(200).json({ category, word });
  },
  getWords: async (req, res, next) => {
    //if we have a limit, shouldn't we have a sorter?
    const { query } = req.query;
    let { number } = req.query;

    //might not be necessary in the future ?
    number = parseInt(number);

    //set a max number?

    const words = await Word.find(
      (query && {
        $or: [
          { english: { $regex: query, $options: "i" } },
          { english2: { $regex: query, $options: "i" } },
          { english3: { $regex: query, $options: "i" } },
          { french: { $regex: query, $options: "i" } }
        ]
      }) ||
        {}
    ).limit(number); //set max here

    res.json({ words });
  },
  getWordsFromUser: async (req, res, next) => {
    //if we have a limit, shouldn't we have a sorter?
    const { query } = req.query;
    let { number } = req.query;
    const { user } = req;

    //might not be necessary in the future ?
    number = parseInt(number);

    //set a max number?

    const words = await Word.find(
      (query && {
        $or: [
          { english: { $regex: query, $options: "i" } },
          { english2: { $regex: query, $options: "i" } },
          { english3: { $regex: query, $options: "i" } },
          { french: { $regex: query, $options: "i" } }
        ]
      }) ||
        {}
    ).limit(number); //set max here

    const userWords = user.words;

    //for every word that in part of the user's list of words, add some more info for the user here:
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].toObject();
      for (j = 0; j < userWords.length; j++) {
        //double equals here is intentional
        if (words[i]._id == userWords[j].id) {
          words[i].userHasWord = true;

          break;
        }
      }
    }

    res.json({ words });
  },
  setImages: async (req, res) => {
    const { wordId, images } = req.body;

    //check if image is real first

    //find the word
    const word = await Word.findById(wordId);

    console.log("word", word);

    word.images = images;
    word.save();

    res.json({ success: true });
  }
};
