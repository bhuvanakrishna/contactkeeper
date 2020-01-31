const express = require("express");
const app = express();
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

//connecting to db
db();

//init middleware (earlier we needed body parser, but now its included in node)
//https://expressjs.com/en/guide/using-middleware.html
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    msg: "welcome to contact keeper api..."
  });
});

//defining routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
