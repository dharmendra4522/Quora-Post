const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("_method"));

// Setting up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(), // generate automatic unit id
        username:"AKGEC",
        content: "I Love Coding!",
    },
    {
        id: uuidv4() ,
        username:"Dharmendra",
        content: "Hard work is important to acheive success",
    },
    {
        id: uuidv4(), 
        username: "rahulkumar",
        content: "I got selected for my 1st internship",
    },
];

// Route to display all posts
app.get("/posts", (req, res)=>{
    res.render("index.ejs", { posts});
});

// Route to display the form for creating a new post
app.get("/posts/new", (req, res) =>{
    res.render("new.ejs");
});

// Route to handle new post submission
app.post("/posts", (req, res)=>{
    let { username, content} = req.body;
    let id = uuidv4() ;
    posts.push({id, username, content });
    res.redirect("/posts"); 
});

// Route to handle specific post operations (e.g., delete, update, etc.)
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found!");
    }
    console.log(post);
    res.render("show.ejs", {post});
});

app.patch("/posts/:id", (req, res) =>{
    const { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) =>{
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs",{ post });
});

app.delete("/posts/:id", (req, res) =>{
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
})

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`); 
});