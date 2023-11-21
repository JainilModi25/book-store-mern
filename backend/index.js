import express from 'express';
import { PORT, mongodbURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

const app = express();
app.use(express.json())


//GET request route for fetching all books
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


//GET req route for fetching a book by id
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


//POST request route for creating a new book
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


//PUT req route for updating book by id
app.put('/books/:id', async (req, res) => {
  try{
    if (!req.body.title ||
        !req.body.author ||
        !req.body.publishYear){
          return res.status(400).send({
            message: 'Send all the required fields: title, author, publishYear'
          });
        }

        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body);

        if(!result){
          return res.status(404).json({message: "Book not found. Check its id again!"});
        }

        return res.status(200).json({message: "Book updated sucessfully"});
  }
  catch(err){
    console.log(err.message);
    res.status(500).send({message:err.message})
  }
})


//DELETE request route for deleting a book by id
app.delete('/books/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const result = await Book.findByIdAndDelete(id)

    if(!result){
      return res.status(404).json({ message: "Book not found." })
    }
    
return res.status(200).json({ message: "Book deleted successfully!" })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });   //internal server error
  }
})


app.listen(PORT, () => {
  console.log(`sERVER is listening on port ${PORT}`);
});

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to database!');
        
    })
    .catch((err) => {
        console.log(err);
        
    })
