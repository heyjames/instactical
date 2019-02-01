const path = require("path");
const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true); // Removes this message in terminal: (node:14572) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
const bodyParser = require("body-parser");
const Post = require("./database/models/Post");
const Announcement = require("./database/models/Announcement");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");
const Gamedig = require("gamedig");

const app = new express();

// mongoose
//   .connect(
//     "mongodb://localhost:27017/node-blog",
//     { useNewUrlParser: true }
//   )
//   .then(() => "You are now connected to Mongo!")
//   .catch(err => console.error("Something went wrong", err));
let uri =
  "mongodb://james:apple2iphonexs@ds219055.mlab.com:19055/heroku_bj7x9xf2";

mongoose
  .connect(
    uri,
    { useNewUrlParser: true }
  )
  .then(() => "You are now connected to Mongo!")
  .catch(err => console.error("Something went wrong", err));

const mongoStore = connectMongo(expressSession);
app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: false
  })
);

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set("views", __dirname + "/views");

app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(connectFlash());

const rateLimit = require("express-rate-limit");

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again in 15 minutes."
});

//  apply to all requests
app.use(limiter);

// const storePost = require("./middleware/storePost");
// app.use("/posts/store", storePost);

// const auth = require("./middleware/auth");
// const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

const homePageController = require("./controllers/homepage");
const aboutPageController = require("./controllers/aboutPage");
const guidelinesPageController = require("./controllers/guidelinesPage");
const blogPageController = require("./controllers/blogPage");
const getPostController = require("./controllers/getPost");
// const createPostController = require("./controllers/createPost");
// const storePostController = require("./controllers/storePost");
const getAnnouncementController = require("./controllers/getAnnouncement");
// const createAnnouncementController = require("./controllers/createAnnouncement");
// const storeAnnouncementController = require("./controllers/storeAnnouncement");

// const createUserController = require("./controllers/createUser");
// const storeUserController = require("./controllers/storeUser");
// const loginController = require("./controllers/login");
// const loginUserController = require("./controllers/loginUser");
// const logoutController = require("./controllers/logout");

app.get("/", homePageController);
app.get("/about", aboutPageController);
app.get("/guidelines", guidelinesPageController);
app.get("/blog", blogPageController);
app.get("/announcements", getAnnouncementController);
app.get("/post/:slug", getPostController);
// app.get("/posts/new", auth, createPostController);
// app.get("/posts/new", createPostController);
// app.post("/posts/store", storePostController);
// app.get("/announcements/new", createAnnouncementController);
// app.post("/announcements/store", storeAnnouncementController);

// app.get("/auth/register", createUserController);
// app.post("/users/register", storeUserController);
// app.get("/auth/login", loginController);
// app.post("/users/login", loginUserController);
// app.get("/auth/logout", redirectIfAuthenticated, logoutController);

app.get("/api/serverinfo1", async (req, res) => {
  await Gamedig.query({
    type: "insurgencysandstorm",
    host: "45.32.130.114",
    port: 27015
  })
    .then(state => {
      // console.log(JSON.stringify(state));
      return state;
    })
    .then(result => {
      res.setHeader("Content-Type", "application/json");
      res.send(result);
    })
    .catch(error => {
      console.log("Error: " + error.message);
      return res.sendStatus(500);
      // let errorObj = { error: error.message };
      // return errorObj;
    });
});

app.get("/api/serverinfo2", async (req, res) => {
  await Gamedig.query({
    type: "insurgencysandstorm",
    host: "207.148.2.100",
    port: 27015
  })
    .then(state => {
      return state;
    })
    .then(result => {
      res.setHeader("Content-Type", "application/json");
      res.send(result);
    })
    .catch(error => {
      console.log("Error: " + error.message);
      return res.sendStatus(500);
    });
});

app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("404", { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
