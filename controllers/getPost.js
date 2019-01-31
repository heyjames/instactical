const Post = require("../database/models/Post");
const moment = require("moment");

module.exports = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).sort({
    createdAt: "desc"
  });

  const posts = await Post.find({}).sort({ createdAt: "desc" });

  if (post) {
    // DB Error
    res.render("post", { post, posts, moment });
  } else {
    res.status(404);
    res.render("404", { url: req.params.slug });
    return;
  }
};
