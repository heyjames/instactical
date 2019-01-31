const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  content: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  featured: {
    type: Number,
    default: "0"
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

PostSchema.plugin(mongoosePaginate);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
