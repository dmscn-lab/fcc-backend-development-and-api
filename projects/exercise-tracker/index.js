const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URI;
mongoose.connect(MONGO_URL);

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    date: String,
    duration: Number,
    description: String
  }],
  count: Number
})

const User = mongoose.model('User', userSchema);

app.route('/api/users')
  .post((req, res) => {
    const username = req.body.username;
    const user = new User({ username, count: 0 });

    user.save((err, data) => {
      if (err) res.json({ error: err });
      res.json(data);
    })
  })
  .get((req, res) => {
    User.find((err, data) => {
      if (data) res.json(data)
    })
  });

app.post('/api/users/:_id/exercises', (req, res) => {
  const description = req.body.description;
  const duration = +req.body.duration;

  const date = req.body.date
  ? "Mon Jan 01 1990" 
  : new Date().toDateString();

  const id = req.params._id;

  const exercise = {
    description,
    duration,
    date,
  };

  User.findByIdAndUpdate(id, 
    { $push: { log: exercise }, $inc: { count: 1 }}, 
    { new: true }, (err, user) => {
      if (user) {
        res.json({
          username: user.username,
          description: description,
          duration: duration,
          date: date,
          _id: user._id,
        });
      }
    });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;

  User.findById(id, (err, user) => {
    if (user) {
      if (from || to || limit) {
        const logs = user.log;
        const filteredLogs = logs.filter(log => {
          const formattedLogDate = new Date(log.date).toDateString();
          return true;
        })

        const slicedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;
        user.log = slicedLogs;
      }

      res.json(user);
    }
  })
})

const listener = app.listen(8080, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})