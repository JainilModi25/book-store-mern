import express from 'express';
import { PORT, mongodbURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

const app = express();
app.use(express.json())

app.get('/books', async (req, res) => {
  try{
    const books = await Book.find({})
    return res.status(200).json(books)
  }
  catch(err){
    console.log(err.message);
    res.status(500).send({ message: err.message });  //internal server error
  }
})

//get book by id
app.get("/books/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });  //internal server error
  }
});

app.post('/books', async (req, res) => {
    try {
        if (
          !req.body.title ||
          !req.body.author ||
          !req.body.publishYear
        ) {
          return res.status(400).send({
            message: "Send all required fields: title, author, publishYear",
          });
        }
        const newBook = {
          title: req.body.title,
          author: req.body.author,
          publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);

        return res.status(201).send(book);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })
        
    }
});

app.listen(PORT, () => {
    console.log(`sERVER is listening on port ${ PORT }`)
})

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to database!');
        
    })
    .catch((err) => {
        console.log(err);
        
    })


