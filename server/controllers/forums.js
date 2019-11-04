const Forum = require("../models/forum");

module.exports = {
  postThread: async (req, res, next) => {
    const { user } = req;
    const { forumName, title, body } = req.body;

    if (!title || !body) {
      return res.status(404).json({ error: "make better error later" }); //better number here pls
    }

    let forum = await Forum.findOne({ name: forumName });

    if (!forum) {
      //temperary
      forum = new Forum({
        name: forumName
      });
      forum.save();
      //res.status(404).json({ error: "No forum found" });
    }

    await forum.createThread({
      userId: user.id,
      title,
      body
    });

    res.json({ sucess: true });
  },

  postMessage: async (req, res, next) => {
    const { user } = req;
    const { forumName, threadId, body } = req.body;

    if (!body) {
      return res.status(404).json({ error: "make better error later" });
    }

    const forum = await Forum.findOne({ name: forumName });
    if (!forum) {
      res.status(404).json({ error: "No forum found" });
    }

    const thread = await forum.findThread(threadId);
    if (!thread) {
      res.status(404).json({ error: "No thread found" });
    }

    await thread.createPost({
      userId: user.id,
      body
    });

    forum.save();

    res.json({ success: true });
  },

  getThreads: async (req, res, next) => {
    const { forumName, from, amount } = req.body;

    const forum = await Forum.findOne({ name: forumName });
    if (!forum) {
      res.status(404).json({ error: "No forum found" });
    }

    const threads = await forum.getThreads({
      from,
      amount
    });
    if (!threads) {
      res.status(404).json({ error: "Unable to get posts" });
    }

    res.json({ threads });
  },

  getPosts: async (req, res, next) => {
    const { forumName, threadId, from, amount } = req.body;

    if (!from || !amount) {
      //reutnr
    }

    const forum = await Forum.findOne({ name: forumName });
    if (!forum) {
      res.status(404).json({ error: "No forum found" });
    }

    const thread = await forum.findThread(threadId);
    if (!thread) {
      res.status(404).json({ error: "No thread found" });
    }

    const posts = await thread.getPosts({ from, amount });
    if (!posts) {
      res.status(404).json({ error: "Unable to get posts" });
    }

    res.json({ posts });
  }
};
