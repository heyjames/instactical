const Post = require("../database/models/Post");
const Announcement = require("../database/models/Announcement");
const moment = require("moment");

module.exports = async (req, res, next) => {
  try {
    const numAnnouncements = await Announcement.countDocuments({
      pinned: { $lt: 1 }
    });

    const featuredPost = await Post.findOne({ featured: 1 });

    const pinnedAnnouncements = await Announcement.find({
      pinned: { $gt: 0 }
    }).sort({ createdAt: "desc" });

    const announcements = await Announcement.find({
      pinned: { $lt: 1 }
    })
      .limit(3)
      .sort({ createdAt: "desc" });

    const paginate = await Post.paginate(
      {},
      { limit: 2, sort: { createdAt: "desc" } }
    );

    const paginate2 = await Post.paginate(
      {},
      { offset: 2, limit: 2, sort: { createdAt: "desc" } }
    );
    const posts = paginate.docs;
    const posts2 = paginate2.docs;

    res.render("index", {
      featuredPost,
      posts,
      posts2,
      pinnedAnnouncements,
      announcements,
      moment,
      numAnnouncements
    });
  } catch (err) {
    next(err);
  }
};
