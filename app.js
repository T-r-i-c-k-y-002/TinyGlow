const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config()

// Importing Schema Model
const ShortUrl = require('./models/shortUrls');

//MiddleWare
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });



// Setting up EJS
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.delete('/shortUrls/:id', async (req, res) => {
  try {
    await ShortUrl.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.sendStatus(500);
  }
});

// Running the server
app.listen(3000, () => {
    console.log("SERVER UP AND RUNNING...");
})