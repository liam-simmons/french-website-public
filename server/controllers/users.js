const JWT = require("jsonwebtoken");

const User = require("../models/user");
const Word = require("../models/word");

signToken = user => {
  return (token = JWT.sign(
    {
      iss: "learn-french-website",
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    process.env.JWT_SECRET //use a random string here <--
  ));
};

module.exports = {
  signUp: async (req, res, nexSt) => {
    const { email, username, password } = req.value.body;
    const errors = {};

    //Check if there are users with the same email / password
    const foundUser = await User.find({
      $or: [{ username }, { email }]
    });

    for (let i = 0; i < foundUser.length; i++) {
      if (foundUser[i].username === username)
        errors.username = "Username already taken";
      if (foundUser[i].email === email) errors.email = "Email already taken";
    }
    //if there are errors, return now
    if (Object.keys(errors).length > 0) return res.status(409).json(errors);
    //Create a new user
    const newUser = new User({
      email: email.toLowerCase(),
      username,
      username_lower: username.toLowerCase()
    });
    await newUser.setPasswordHash(password);
    await newUser.save();

    //make a token
    const token = signToken(newUser);

    //Respond with user and token
    res.status(200).json({ user: { username, email, token } });
  },

  testUserCreate: async (req, res) => {
    //const { email, username, password } = req.value.body;
    const randomNumber = Math.round(Math.random() * 1000000).toString();
    const email = `test${randomNumber}@test.com`;
    const username = `test${randomNumber}`;
    const password = "test1234";

    const errors = {};

    //Check if there are users with the same email / password
    const foundUser = await User.find({
      $or: [{ username }, { email }]
    });

    for (let i = 0; i < foundUser.length; i++) {
      if (foundUser[i].username === username)
        errors.username = "Username already taken";
      if (foundUser[i].email === email) errors.email = "Email already taken";
    }
    //if there are errors, return now
    if (Object.keys(errors).length > 0) return res.status(409).json(errors);
    //can change to try again

    //Create a new user
    const newUser = new User({
      email,
      username,
      username_lower: username.toLowerCase()
    });
    await newUser.setPasswordHash(password);
    await newUser.addWord("5d7e5d31b0715d2030918e77");
    await newUser.addWord("5d7e5faadaab752cd0e4dc5f");
    await newUser.addWord("5d7e6073daab752cd0e4dc60");
    await newUser.addWord("5d7e60aedaab752cd0e4dc61");
    await newUser.addWord("5d7e60cfdaab752cd0e4dc62");
    await newUser.addWord("5d7e60e9daab752cd0e4dc63");
    await newUser.addWord("5d7e613fdaab752cd0e4dc64");
    await newUser.addWord("5d7e61a6daab752cd0e4dc65");
    await newUser.addWord("5d7e61d0daab752cd0e4dc66");
    await newUser.addWord("5d7e6224daab752cd0e4dc67");
    await newUser.addWord("5d7e625cdaab752cd0e4dc68");
    await newUser.save();

    //make a token
    const token = signToken(newUser);

    //Respond with user and token
    res.status(200).json({ user: { username, email, token } });
  },
  signIn: async (req, res, next) => {
    const { user } = req;
    user.token = signToken(req.user);
    const { username, email, token } = user;

    res.status(200).json({ user: { username, email, token } });
    //this sucks
  },
  checkAuthorized: async (req, res, next) => {
    const token = signToken(req.user);
    const { username, email } = req.user;
    res.status(200).json({ user: { username, email, token } });
  },
  signout: async (req, res, next) => {
    //need to finihs this
    const { user } = req;
    res.json({ sucess: true });
  },
  addWord: async (req, res, next) => {
    const { wordId } = req.body;
    const { user } = req;

    //check if word exists in database
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ error: "Word does not exist in database" });
    }

    //add word and respond with success
    user.addWord(wordId);
    user.save();
    res.status(200).json({ success: true, wordId });
  },
  setFavouriteImage: async (req, res, next) => {
    const { user } = req;
    const { wordId, definitionId, imageId } = req.body;

    //check if image is real first

    await user.setFavouriteImage(wordId, definitionId, imageId);
    await user.save();
    //.catch(err => res.status(401).json({ err }));

    res.json({ sucess: true });
  },
  dueWords: async (req, res, next) => {
    const { user } = req;
    const { type } = req.query;
    const userDueWords = await user.getDueWords(type);

    //get the word info using the id saved in user.words
    const promises = userDueWords.map(async dueWord => {
      const word = await Word.findById(dueWord.id);
      if (word) {
        //make level separate since there are different levels for each phase
        let level;
        if (type === "FRENCH_TO_ENGLISH") level = dueWord.levelToEnglish;
        else if (type === "ENGLISH_TO_FRENCH") level = dueWord.levelToFrench;
        else if (type === "TYPING") level = dueWord.levelTyping;

        return {
          level,
          favouriteImages: dueWord.favouriteImages,
          ...word.toObject()
        };
      }
    });

    const words = await Promise.all(promises);

    //THIS STUFF GETS UDNEFINED IF THE WORD DOESN'T EXIST!!

    res.json({ words });
  },

  wordResult: async (req, res, next) => {
    const { user } = req;
    const { levelChange, wordId, type } = req.body;
    console.log("levelChange", levelChange);
    console.log("wordId", wordId);
    console.log("type", type);
    user.setNextReview({ levelChange, wordId, type });

    res.json({ done: true });
  },
  //omg this gonna SUUUUUUUUUUUUCK

  getWords: async (req, res, next) => {
    //3 options for search:
    //1: search all words then compare with what words the user has
    //2: send all the words to client and have it search locally?
    //3: get all the words that the user has then search them then send to client

    const { user } = req;
    let { query, number } = req.query;

    //make an error if query doesn't exist
    if (!query) {
      query = "";
    }

    res.json({ words: user.words });

    /*    const words = user.words;

    //change the number to the max we wanna send in case th ey ask for all or sth and ddos us

    const words = await Word.find({
      $or: [
        { english: { $regex: query, $options: "i" } },
        { french: { $regex: query, $options: "i" } }
      ]
    }); //set max here

    res.json({ words });*/
  }
};

//assign remaining word results here for if they close early and there are locally stored negative levelbois in the ready.
