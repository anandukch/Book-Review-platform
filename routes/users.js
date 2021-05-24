var express = require("express");
var router = express.Router();
const userHelpers = require("../helpers/userHelpers");
var bookHelpers = require("../helpers/bookHelper");
const { response } = require("express");
const session = require("express-session");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  console.log(user);

  bookHelpers.getAllBooks().then((books) => {
    res.render("user/view-products", { books, user });
  });
});

// GET login page
router.get("/login", (req, res) => {
  res.render("user/login");
});

// POST login
router.post("/login", (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.logginErr = "Invalid email or password";
      res.redirect("/login");
    }
  });
});
// GET signup
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
// POST signup
router.post("/signup", async (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true;
    req.session.user = response;
    res.redirect("/");
  });
});

router.get("/view-product/:id", verifyLogin, async (req, res) => {
  let book = await userHelpers.getbook(req.params.id);

  let c = await userHelpers.getcomments(req.params.id, req.session.user);
  console.log(c[0]);
  // let m = [];
  // let m = c[0].rating.map((e) => {
  //     if(e.comment==''||undefined){return}
  //     else{return e;}

  // });
  let m = c[0].rating.filter((e) => {
    return e.comment != "";
  });
  console.log(m);

  // m = p[0];
  let rate, status;
  let sum = 0;
  book.rating.forEach((r) => {
    sum += r.rate;
    if (r.user == req.session.user._id) {
      rate = r.rate;
      if (rate == 1) {
        status = true;
      } else {
        status = false;
      }
    }
  });

  res.render("user/view-product", {
    book,
    user: req.session.user,
    m,
    sum,
    status,
  });
});
router.post("/change-product-quantity", (req, res, next) => {
  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response);
  });
});
router.post("/comment/:id", (req, res) => {
  userHelpers
    .updatecomment(req.params.id, req.session.user._id, req.body.comment)
    .then(() => {
      res.redirect("/view-product/" + req.params.id);
    });
});
router.post("/change-rate", (req, res) => {
  userHelpers.changeRate(req.body).then((response) => {
    res.json(response);
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/add-book", verifyLogin, (req, res) => {
  let user = req.session.user;
  res.render("user/add-book", { user });
});
router.post("/add-book", (req, res) => {
  bookHelpers.addBooks(req.body, req.session.user._id, (id) => {
    let image = req.files.image;
    image.mv("./public/book-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.redirect("/add-book");
      } else {
        console.log(err);
      }
    });
  });
});
router.get("/profile",verifyLogin, async (req, res) => {
  let book =await bookHelpers.getUserBooks(req.session.user._id);
  console.log(book);
  let user = await userHelpers.getUserDetails(req.session.user._id);
  console.log(user);
  res.render("user/user-profile", { user ,book});
});
router.post("/profile", (req, res) => {
  userHelpers.updateUser(req.session.user._id, req.body).then(() => {
    res.redirect("/profile");
  });
});

module.exports = router;
