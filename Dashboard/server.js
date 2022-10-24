const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/components");
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());
app.use(express.static(path.join(__dirname, "./public")));

/**
 * loading routes
 */
app.get("/", (req, res) => res.render("Home"));
app.get("/commands", (req, res) => res.render("Commands"));
app.get("/about", (req, res) => res.render("About"));
app.get("/stats", (req, res) => res.render("Stats"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
