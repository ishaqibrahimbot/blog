//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const getDate = function () {
  let date = new Date();
  return date.toLocaleDateString();
}

mongoose.connect("mongodb+srv://admin-ishaq:g8wnvw57dBiX2z6@ishaqclusterone.n3mde.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = new mongoose.Schema ({
  title: String,
  date: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);


const homeStartingContent = "This blog will be a collection of tutorials, experiences, and stories at some point in the future. However, at the moment, this is mostly filled with gibberish.";
const aboutContent = "I am Ishaq, a back-end developer slowly building expertise in technologies like Node.js and Flask. Even though I studied mechanical engineering at the undergraduate level, I quickly switched over to software engineering a year after graduation because I had always been in love with the lego-like endless possibilities provided by the world of software. Do check out my GitHub and LinkedIn profiles (linked below) to learn more about me.";
const contactContent = "You can contact me via email at ishaqibrahimbss@gmail.com.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Root Route
app.get("/", (req, res) => {

  Blog.find({}, (err, blogList) => {
    if (!err) {
      res.render("home", {homeContent: homeStartingContent, posts: blogList});
    }
  });
});

//Contact Route
app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
});

//About Route
app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
});

//Compose Route GET and POST
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {

  const blogPost = new Blog ({
    title: req.body.postTitle,
    date: getDate(),
    content: req.body.postBody
  });

  blogPost.save();
  res.redirect('/');
});

//Using Express Route Parameters
app.get("/posts/:postID/", (req, res) => {
  const postID = req.params.postID;

  Blog.findById(postID, (err, post) => {
    if (!err) {
      res.render("post", {postTitle: post.title, postBody: post.content});
    }
  });
});



app.listen(process.env.PORT);
