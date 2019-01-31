const Post = require("../database/models/Post");
const moment = require("moment");

module.exports = async (req, res, next) => {
  const allPosts = await Post.find({}).sort({ createdAt: "desc" });

  if (req.query.page === undefined || req.query.page === null) {
    req.query.page = 1;
  }

  const options = {
    page: req.query.page,
    limit: 4,
    sort: { createdAt: "desc" }
  };

  const paginate = await Post.paginate({}, options);
  const posts = paginate.docs;

  res.render("blog", { allPosts, posts, paginate, moment });
};
