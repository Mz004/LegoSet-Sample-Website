require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: { type: Date, default: Date.now },
    userAgent: String
  }]
});

let User;
//let User = mongoose.model("User", userSchema);

module.exports.initialize = async () => {
  return new Promise(function (resolve, reject) {
    const db = mongoose.createConnection('mongodb+srv://devankitshukla3003:L7dFfcqK97Osn6XF@cluster0.fw6bppo.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db.on('error', (err) => {
      reject(err);
    });
    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = async (userData) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(userData.password, 10)
      .then(hash => {
        userData.password = hash;
        const newUser = new User(userData);
        newUser.save()
          .then(() => resolve('User registered successfully'))
          .catch(err => reject(err));
      })
      .catch(err => {
        console.log(err);
        reject('There was an error encrypting the password');
      });
  });
};

module.exports.checkUser = async (userData) => {
  return new Promise((resolve, reject) => {
    // Find the user by username in the database
    User.findOne({ userName: userData.userName })
      .then(user => {
        if (!user) {
          // If user is not found, reject the promise
          reject('User not found');
        } else {
          // Compare the hashed password with the provided password
          bcrypt.compare(userData.password, user.password)
            .then(result => {
              if (result) {
                // If passwords match, resolve the promise
                resolve('Password correct');
              } else {
                // If passwords don't match, reject the promise
                reject('Incorrect password for user: ' + userData.userName);
              }
            })
            .catch(err => {
              console.log(err);
              // If there was an error comparing passwords, reject the promise
              reject('Error comparing passwords');
            });
        }
      })
      .catch(err => {
        console.log(err);
        // If there was an error retrieving user data, reject the promise
        reject('Error retrieving user data');
      });
  });
};

