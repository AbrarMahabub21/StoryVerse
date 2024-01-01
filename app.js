const path = require("path");
const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const engine = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const multer = require("multer");
const profileRoutes = require("./routes/profile");
//load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);
//connecting to DB
connectDB();

//initialize app
const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
}).single("profileImage");

//handlebars
const hbs = exphbs.create({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
  defaultLayout: "main",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

//setting views dir
app.set("views", path.join(__dirname, "views"));

//sessions

const store = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set Global Var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
//static folder
app.use(express.static(path.join(__dirname, "public")));

//linking routing files
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/profile", require("./routes/profile"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);
