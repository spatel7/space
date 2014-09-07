var express = require('express')
  , ff = require('ff')
  , http = require('http')
  , app = express()
  , path = require('path')
  , dir = path.dirname(require.main.filename)
  , MongoStore = require('connect-mongo')(express)
  , env = process.env.NODE_ENV || 'development'

global.mongoose = require('mongoose').connect("mongodb://localhost/space")

mongoose.connection.on('error', function (err) { console.log(err) })
require('./schemas/post')
require('./schemas/space')

appserver = http.createServer(app)

app.set('trust proxy', true)
app.set('view engine', 'jade')
app.set('views', dir + '/views')

app.use(express.cookieParser())
app.use(express.json())
app.use(express.urlencoded())

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({
    secret: 'thr33s0m3'
  , store: new MongoStore({
        url: "mongodb://localhost/space"
      , 'auto_reconnect': true
    })
  , cookie: {
        maxAge: 604800000
  }
}))

app.get('/ping', function (req, res) {
  res.send('pong');
})

require.main.require('./controllers')(app)

appserver.listen(8080, function () {
  console.log('space server now accepting requests from port 8080')
})

process.on('SIGTERM', function () {
  appserver.close();
})