const WordCategory = require("../models/wordCategory");
const Word = require("../models/word");
const User = require("../models/user");

module.exports = {
  //TODO: somehow reply with what failed - is it worth it?

  createCategory: async function(req, res) {
    const { name } = req.body;
    const wordIds = req.body.wordIds || [];

    words = await Word.find({
      _id: { $in: wordIds }
    });

    //set cateogry to each word
    for (let i = 0; i < words.length; i++) {
      words[i].setCategory({ categoryName: name }).then(() => words[i].save());
    }

    //deals with doubles and nonexisting words:
    const existingWordIds = words.map(word => word._id);

    //set each word to category
    const newCategory = new WordCategory({
      name,
      words: existingWordIds
    });
    newCategory.save();

    res.status(200).json({ newCategory });
  },

  getCategories: async function(req, res) {
    const categories = await WordCategory.find().limit(10);

    const categoryNames = [];
    for (let i = 0; i < categories.length; i++)
      categoryNames[i] = categories[i].name;

    res.json({ categoryNames });
  },
  getCategory: async function(req, res) {
    const { name } = req.query;
    const { user } = req;

    const category = await WordCategory.findOne({ name });

    if (!category)
      res.status(404).json({ error: "No category found with that name" });

    //get the words from wordIds in the category
    const words = await Word.find({
      _id: { $in: category.words }
    })
      .lean()
      .exec(); //this is so we can add more stuff later

    //check if each word is already in the list
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < user.words.length; j++) {
        if (words[i]._id == user.words[j].id) {
          words[i].added = true;
          break;
        }
      }
    }

    res.status(200).json({ name: category.name, words });
  }
};
