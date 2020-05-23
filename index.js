/**
 * Use dotenv.
 */
const dotenv = require('dotenv');
/**
 * Import Todo Model.
 */
const TodoTask = require('./models/TodoTask');
/**
 * Mongoose.
 */
const mongoose = require('mongoose');
/**
 * Require express app.
 */
const express = require('express');
/**
 * Call express.
 */
const app = express();
/**
 * The list of initial tasks.
 * @Type {Array}
 */
var task = ["buy socks", "practise with nodejs"];
/**
 * The list of completed task with initial placeholders for removed task.
 * @Type {Array}
 */
var complete = ["finish jquery"];

dotenv.config({ path: require('find-config')('.env') });

/**
 * Use the bodyparser middleware.
 */
app.use(express.urlencoded({ extended: true }));
/**
 * Get static files.
 */
app.use(express.static("public"));
/**
 * Setup EJS view engine.
 */
app.set('view engine', 'ejs');
/**
 * Post route for adding new task.
 * It redirects to (/) when finished.
 */
app.post('/addtask', async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/");
  }
  catch (err) {
    res.redirect("/");
  }
});
/**
 * Render the index template and display added task, task(index.ejs) = task(array)
 */
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("index.ejs", { todoTasks: tasks, idTask: ''});
  });
});


app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;

    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;

    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running"));
});