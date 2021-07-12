'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

mongoose.connect('mongodb://localhost:27017/bestBooks', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  img: String
});

const userSchema = new mongoose.Schema({
  email: String,
  books: [bookSchema]
});


const myUserModel = mongoose.model('user', userSchema);

function seedUserCollection() {
  const tariq = new myUserModel({
    email: 'taariq.zyad@gmail.com',
    books: [
      {
        name: 'The Growth Mindset',
        description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
        status: 'FAVORITE FIVE',
        img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg'
      },
      {
        name: 'The Momnt of Lift',
        description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
        status: 'RECOMMENDED TO ME',
        img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'
      }
    ]
  });
  tariq.save();
};
// seedUserCollection();


// http://localhost:3001/books?email=taariq.zyad@gmail.com
app.get('/books', getBooksHandler);

function getBooksHandler(request, response) {

  const email = request.query.email;

  myUserModel.find({ email: email }, function (error, items) {
    if (error) {
      response.status(500).send('NOT FOUND')
    } else {
      response.status(200).send(items[0].books)
    }
  })
};

app.get('/', homePageHandler);

function homePageHandler(request, response) {
  response.status(200).send('Hello This Is Home Route')
};

app.get('/test', testPageHandler);

function testPageHandler(request, response) {
  response.status(200).send('all good');
};

app.listen(PORT, () => console.log(`listening on ${PORT}`));
