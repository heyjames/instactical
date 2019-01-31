const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AnnouncementSchema = new mongoose.Schema({
  content: String,
  username: String,
  pinned: {
    type: Number,
    default: "0"
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

AnnouncementSchema.plugin(mongoosePaginate);

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

module.exports = Announcement;
