const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

//words schema
const wordSchema = new Schema({
  id: {
    type: String,
    unique: false
  },
  levelToEnglish: { type: Number },
  levelToFrench: { type: Number },
  levelTyping: { type: Number },
  nextReviewToEnglish: { type: Date },
  nextReviewToFrench: { type: Date },
  nextReviewTyping: { type: Date },
  favouriteImages: [String]
});

//user schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  }, //lowercase?
  username_lower: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  words: [wordSchema], //{ type: Array, required: true }
  images: [String],
  authLevel: Number
});

userSchema.methods.setPasswordHash = async function(password) {
  try {
    //Genarate a salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    this.passwordHash = passwordHash;
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.isValidPassword = async function(receivedPassword) {
  try {
    return await bcrypt.compare(receivedPassword, this.passwordHash);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.addWord = function(id) {
  try {
    //check if user already has said word
    for (let i = 0; i < this.words.length; i++) {
      if (this.words[i].id === id) {
        throw new Error("Word already in your word list");
      }
    }

    const date = Date.now();

    this.words = [
      ...this.words,
      {
        id,
        levelToEnglish: 0,
        nextReviewToEnglish: date,
        levelToFrench: 0,
        nextReviewToFrench: date,
        levelTyping: 0,
        nextReviewTyping: date
      }
    ];
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.setFavouriteImage = function(wordId, definitionId, imageId) {
  try {
    for (let i = 0; i < this.words.length; i++) {
      if (wordId === this.words[i].id) {
        this.words[i].favouriteImages[definitionId] = imageId;
        this.markModified("words");
        return true;
      }
    }
    throw new Error("Word is not in your word list");
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.addCreatedImage = function({ imageId }) {
  try {
    if (!this.images) {
      this.images = [];
    }
    //this.images.push(imageId);
    this.images[this.images.length] = imageId;
    this.markModified("images");
  } catch (error) {
    throw new Error(error);
  }
};

//addwords method here

userSchema.methods.getDueWords = async function(type) {
  try {
    const now = Date.now();

    dueWords = []; //= await this.words.find({ nextReviewToEnglish: { $lte: now } });

    //this can be done 10x better
    if (type === "FRENCH_TO_ENGLISH") {
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].nextReviewToEnglish < now) {
          dueWords.push(this.words[i]);
        }
      }
    } else if (type === "ENGLISH_TO_FRENCH") {
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].nextReviewToFrench < now) {
          dueWords.push(this.words[i]);
        }
      }
    } else if (type === "TYPING") {
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].nextReviewTyping < now) {
          dueWords.push(this.words[i]);
        }
      }
    }

    return dueWords;
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.setNextReview = async function({
  levelChange,
  wordId,
  type
}) {
  try {
    const now = new Date();
    //find corresponding word
    for (let i = 0; i < this.words.length; i++) {
      if (wordId === this.words[i].id) {
        //get corresponding level
        let level, review;
        if (type === "FRENCH_TO_ENGLISH") {
          level = "levelToEnglish";
          review = "nextReviewToEnglish";
        } else if (type === "ENGLISH_TO_FRENCH") {
          level = "levelToFrench";
          review = "nextReviewToFrench";
        } else if (type === "TYPING") {
          level = "levelTyping";
          review = "nextReviewTyping";
        }
        //respond with error here if type is wrong, not really sure how
        else break;

        //apply levelchange and set limit of level between 0 and 8
        this.words[i][level] = Math.min(
          Math.max(this.words[i][level] + levelChange, 0),
          8
        );

        //set corresponding renewal date
        this.words[i][review] = new Date().setDate(
          now.getDate() + Math.pow(2, this.words[i][level])
        );

        this.save();
        break;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

//create a model
const User = mongoose.model("user", userSchema);

//export the model
module.exports = User;
