let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// 
function hello(req, res) {
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    res.json({"message": "HELLO JSON"})
  } else {
    res.json({"message": "Hello json"})
  }
}

// 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})

// 
app.get('/now', (req, res, next) => {
  const date = new Date().toString();
  req.string = date;
  
  next();
}, (req, res) => {
  res.send({
    time: req.string
  });
})

// 
app.get('/json', hello)

// 
app.get('/:word/echo', (req, res, next) => {
  req.word = req.params.word;

  next();
}, (req, res) => {
  res.send({
    echo: req.word,
  })
})

//
function handlerGet(req, res) {
  req.name = `${req.query.first} ${req.query.last}`;
  
  res.send({
    name: req.name,
  })
}

function handlerPost(req, res) {
  req.name = `${req.body.first} ${req.body.last}`;
  
  res.send({
    name: req.name,
  })
}

app.route('/name').get(handlerGet).post(handlerPost);

module.exports = app;