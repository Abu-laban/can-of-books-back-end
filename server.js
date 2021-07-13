'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const User = require('./modules/User')

const app = express();
app.use(cors());

// Middleware: checkpoint to parse the body of the request
app.use(express.json())

const PORT = process.env.PORT || 3002;

mongoose.connect(`${process.env.MONGODB}/bestBooks`, { useNewUrlParser: true, useUnifiedTopology: true });


function seedUserCollection() {
  const tariq = new User({
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



app.get('/books', getBooksHandler);

function getBooksHandler(request, response) {

  const email = request.query.email;

  User.find({ email: email }, (error, items) => {
    if (error) {
      response.status(500).send('NOT FOUND')
    } else {
      response.status(200).send(items[0].books)
    }
  })
};



app.post('/books', postBooksHandler);

function postBooksHandler(request, response) {

  console.log(request.body);
  let { email, bookName, bookDescription, bookStatus, bookImg } = request.body;

  User.find({ email: email }, (error, items) => {
    if (error) {
      response.status(500).send('NOT FOUND')
    }
    else {

      items[0].books.push({
        name: bookName,
        description: bookDescription,
        status: bookStatus,
        img: bookImg,
      })

      items[0].save();

      response.status(200).send(items[0].books)
    }
  })

}


app.delete('/books/:id', deleteBooksHandler)


function deleteBooksHandler(request, response) {

  let id = request.params.id;
  let email = request.query.email;

  User.find({ email: email }, (error, items) => {
    if (error) {
      response.status(500).send('NOT FOUND')
    }
    else {

      let newBookArray = items[0].books.filter(val => {

        return val._id.toString() !== id

      })
      items[0].books = newBookArray
      console.log('after deleting', items[0].books)

      items[0].save();
      response.status(200).send(items[0].books)
    }

  })
}
app.get('/', homePageHandler);

function homePageHandler(request, response) {
  response.status(200).send('Hello This Is Home Route')
};

app.get('/test', testPageHandler);

function testPageHandler(request, response) {
  response.status(200).send('all good');
};

app.listen(PORT, () => console.log(`listening on ${PORT}`));
