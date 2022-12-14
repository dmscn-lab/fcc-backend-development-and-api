// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/", (req, res) => {
  const date = new Date();
    
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
})

app.get("/api/:date", (req, res) => {
  const regexUnix = /^[0-9]+$/g;
  const regexValidDate = /^[0-9]{2}.[a-z]+.[0-9]{4}.+|^[0-9\-]+$/i;
  
  if (regexUnix.test(req.params.date)) {
    res.json({
      unix: +req.params.date,
      utc: new Date(+req.params.date).toUTCString(),
    });
  }
  else if (regexValidDate.test(req.params.date)) {
    res.json({
      unix: new Date(req.params.date).getTime(),
      utc: new Date(req.params.date).toUTCString(),
    });
  }
  else {
    res.json({
      error: "Invalid Date"
    });
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
