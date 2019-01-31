const Announcement = require("../database/models/Announcement");
const moment = require("moment");

module.exports = async (req, res) => {
  const allAnnouncements = await Announcement.find({}).sort({
    createdAt: "desc"
  });

  if (req.query.page === undefined || req.query.page === null) {
    req.query.page = 1;
  }

  try {
    const options = {
      page: req.query.page,
      limit: 7,
      offset: 3,
      sort: { createdAt: "desc" }
    };

    const paginate = await Announcement.paginate({ pinned: 0 }, options);
    const announcements = paginate.docs;

    res.render("announcements", {
      allAnnouncements,
      announcements,
      paginate,
      moment
    });
  } catch (err) {
    next(err);
  }
};
