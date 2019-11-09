const fs = require("fs");

const Image = require("../models/image");
const Word = require("../models/word");

module.exports = {
  createImage: async (req, res) => {
    let { wordIds, definitionIds, setFavourite } = req.body;

    wordIds = JSON.parse(wordIds);
    definitionIds = JSON.parse(definitionIds);
    setFavourite = JSON.parse(setFavourite);

    const { file, user } = req;

    const words = [];

    //make sure word exists:
    for (let i = 0; i < wordIds.length; i++) {
      const word = await Word.findById(wordIds[i]);
      words.push(word);
    }

    //get image from path
    const image = fs.readFileSync(file.path);

    //delete image from local server
    fs.unlinkSync(file.path);

    //create the image
    const newImage = new Image({
      wordIds,
      creatorId: user._id,
      definitionIds,
      image
    });

    await newImage.save();

    //add image to user

    user.addCreatedImage({ imageId: newImage._id });

    //set image as favourite for user if they want it

    for (let i = 0; i < wordIds.length; i++) {
      if (setFavourite[i]) {
        user.setFavouriteImage(wordIds[i], definitionIds[i], newImage._id);
      }
    }
    await user.save();

    res.json({ sucess: true });
  },

  getImage: async (req, res) => {
    const { imageId } = req.query;

    console.log("imageId", imageId);

    const image = await Image.findById(imageId);

    res.json({ image: image.image });
  },

  getImages: async (req, res) => {
    const { imageIds } = req.query;

    const images = [];

    for (let i = 0; i < imageIds.length; i++) {
      if (imageIds[i]) {
        const image = await Image.findById(imageIds[i]);
        if (image) images[i] = image.image;
      }
    }

    res.json({ images });
  }
};
