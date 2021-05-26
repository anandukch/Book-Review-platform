var db = require("../config/connection");
var collection = require("../config/collection.js");
const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");
const { response } = require("express");

module.exports = {
  doSignUp: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.time = new Date();
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          resolve(data.ops[0]);
        });
    });
  },
  dologin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      console.log(user);
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },

  
  
  
  getbook: (proId) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.BOOK_COLLECTION)
        .findOne({ _id: ObjectID(proId) })
        .then((pro) => resolve(pro));
    });
  },
  updatecomment: (bookId, userId, data) => {
    let rateDetails = {
      user: ObjectID(userId),
      rate: 0,
      comment: data,
    };
    return new Promise(async (resolve, reject) => {
      let book = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .findOne({ _id: ObjectID(bookId) });
      let userExist = book.rating.findIndex((rates) => rates.user == userId);
      if (userExist != -1) {
        db.get()
          .collection(collection.BOOK_COLLECTION)
          .updateOne(
            {
              _id: ObjectID(bookId),
              rating: { $elemMatch: { user: ObjectID(userId) } },
            },
            {
              $set: {
                "rating.$.comment": data,
              },
            }
          )
          .then(() => {
            resolve();
          });
      } else {
        db.get()
          .collection(collection.BOOK_COLLECTION)
          .updateOne(
            { _id: ObjectID(bookId) },
            {
              $push: { rating: rateDetails },
            }
          )
          .then(() => {
            resolve();
          });
      }
    });
  },
  getcomments: (proid, userid) => {
    return new Promise((resolve, reject) => {
      let c = db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .find({ _id: ObjectID(proid) })
        .toArray();
      resolve(c);
    });
  },
  
  changeRate: (data) => {
    data.count = parseInt(data.count);
    data.quantity = parseInt(data.quantity);
    let rateDetails = {
      user: ObjectID(data.user),
      rate: 1,
      comment: "",
    };
    return new Promise(async (resolve, reject) => {
      let book = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .findOne({ _id: ObjectID(data.book) });

      console.log("here");
      book.rating.forEach((element) => {
        if (element.user == data.user) {
          console.log(element.rate);
        }
      });
      let userExist = book.rating.findIndex((rates) => rates.user == data.user);

      if (userExist != -1) {
        book.rating.forEach((rating) => {
          if (rating.user == data.user) {
            if (rating.rate == 1) {
              db.get()
                .collection(collection.BOOK_COLLECTION)
                .updateOne(
                  {
                    _id: ObjectID(data.book),
                    rating: { $elemMatch: { user: ObjectID(data.user) } },
                  },
                  {
                    $set: { "rating.$.rate": 0 },
                  }
                )
                .then(() => {
                  resolve({ status: false });
                });
            }else if(rating.rate == 0){
              db.get()
                .collection(collection.BOOK_COLLECTION)
                .updateOne(
                  {
                    _id: ObjectID(data.book),
                    rating: { $elemMatch: { user: ObjectID(data.user) } },
                  },
                  {
                    $set: { "rating.$.rate": 1 },
                  }
                )
                .then(() => {
                  resolve({ status: true });
                });
            }
          }
        });
      } else {
        db.get()
          .collection(collection.BOOK_COLLECTION)
          .updateOne(
            { _id: ObjectID(data.book) },
            {
              $push: { rating: rateDetails },
            }
          )
          .then(() => {
            resolve({ status: true });
          });
      }
    });
  },
  getUserDetails:(userid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(userid)}).then((user)=>{
            resolve(user)
        })

    })

},
updateUser:(userid,userdetails)=>{
  return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION)
      .updateOne({_id:ObjectID(userid)},{
          $set:{
              userName:userdetails.userName,
              email:userdetails.email,
              mb:userdetails.mb,
              
          }

      }).then((response)=>{
          resolve()
      })

  })

}
};


