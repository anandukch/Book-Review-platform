var db = require("../config/connection");
var collection = require("../config/collection.js");
const { ObjectID } = require("bson");

module.exports = {
  addBooks: (book, userid, imageSaver) => {
    book.userId = ObjectID(userid);
    let books = {
      ...book,
      rating: [],
    };
    db.get()
      .collection(collection.BOOK_COLLECTION)
      .insertOne(books)
      .then((data) => {
        console.log(data);
        imageSaver(data.ops[0]._id);
      });
  },
  getAllBooks: () => {
    return new Promise(async (resolve, reject) => {
      let books = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .find()
        .toArray();
      resolve(books);
    });
  },
  getUserBooks: (userid) => {
    return new Promise(async (resolve, reject) => {
      let books = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .find(userid)
        .toArray();
      resolve(books);
    });
  },
  getRate: (bookId) => {
    return new Promise(async (resolve, reject) => {
      let c = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .findOne({ _id: ObjectID(bookId) })
        .toArray();
      console.log("book " + c.rating);
      resolve(c);
    });
  },
};
