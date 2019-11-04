const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: String,
  postId: Number,
  body: String
});

const threadSchema = new Schema({
  title: String,
  posts: [postSchema]
});

const forumSchema = new Schema({
  name: String,
  threads: [threadSchema]
});

forumSchema.methods.createThread = function({ userId, title, body }) {
  //maybe it's better to put it in at 0 instead of on the end here
  try {
    this.threads.push({ title, posts: [{ userId, postId: 0, body }] });
    this.save();
  } catch (error) {
    throw new Error(error);
  }
};

threadSchema.methods.createPost = function({ userId, body }) {
  //somehow you need to push the particular thread to the top of the forum here
  try {
    this.posts.push({ userId, postId: this.posts.length, body });
  } catch (error) {
    throw new Error(error);
  }
};

forumSchema.methods.findThread = function(threadId) {
  try {
    for (let i = 0; i < this.threads.length; i++) {
      if (this.threads[i]._id == threadId) {
        return this.threads[i];
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

forumSchema.methods.getThreads = function({ from, amount }) {
  try {
    if (this.threads.length > from) {
      const to = from + amount;

      const threads = this.threads.slice(from, to);
      //there has to be a better way than this:
      for (let i = 0; i < threads.length; i++) {
        threads[i] = {
          title: threads[i].title,
          lastPost: threads[i].posts[threads[i].posts.length - 1]
        };
      }
      return threads;
    }
    //if no posts, return false which will return an error in the controller
    else return false;
  } catch (error) {
    throw new Error(error);
  }
};

threadSchema.methods.getPosts = function({ from, amount }) {
  try {
    if (this.posts.length > from) {
      const to = from + amount;
      return this.posts.slice(from, to);
    }
    //if no posts, return false which will return an error in the controller
    else return false;
  } catch (error) {
    throw new Error(error);
  }
};

const Forum = mongoose.model("forum", forumSchema);

module.exports = Forum;
