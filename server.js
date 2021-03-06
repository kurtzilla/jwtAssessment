require('dotenv').config();
var express = require('express');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var app = express();

app.use(bearerToken());
app.use(express.static('public'));

app.get('/login',function (req,res,next) {
  // Return a token
  var user = {
    name: 'rob',
    id: '0U812',
    isAdmin: true
  }
  res.json({token:jwt.sign(user, process.env.SECRET)});
});

app.use(function (req,res,next) {
  // Implement app level middleware to protect the /protected route
  // Verify the token before allowing access to /protected

  jwt.verify(req.token, process.env.SECRET, function(err, decoded) {
    if (!err) {
      next();
    }
    else {
      res.status(400).send('Bad request - no token');
    }
  });
});

app.get('/protected',function (req,res,next) {
  res.send("Identity Confirmed!");
});


app.listen(3000);
