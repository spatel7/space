var ff = require('ff')
  , Post = mongoose.model('Post')
  , Space = mongoose.model('Space')
  , moment = require('moment')

module.exports = function (app) {
  app.get('/spaces', function (req, res) {
    var f = ff(function () {
      Space.find({}).sort({ created: -1 }).exec(f.slot());
    }, function (spaces) {
      res.render('spaces', {page: 'spaces', source: (req.headers.referer ? req.headers.referer : 'manual' ), spaces: spaces, moment: moment});
    });
  });

  app.get('/api/spaces/:lat/:lon', function (req, res) {
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lon);
    var f = ff(function() {
      Space.find({lat: {$gt: ( lat > 0 ? lat-0.00008 : lat+0.00008 ), $lt: ( lat > 0 ? lat+0.00008 : lat-0.00008 ) }, lon: {$gt: ( lon > 0 ? lon+0.00008 : lon-0.00008 ), $lt: ( lon > 0 ? lon-0.00008 : lon+0.00008 ) } }).sort({ created: -1 }).exec(f.slot());
    }, function (spaces) {
      res.send(spaces);
    })
  })

  app.get('/create', function (req, res) {
    res.render('create', {page: 'create'});
  })

  app.post('/save', function (req, res) {
    var name = req.body.name;
    var shortname = req.body.shortname;
    var f = ff(function () {
      Space.findOne({shortname: shortname}).exec(f.slot())
    }, function (space) {
      if (space) {
        res.send(400, 'That space name already exists!')
      } else {
        space = new Space({
            name: name
          , shortname: shortname
          , posts: []
          , lat: req.body.lat
          , lon: req.body.lon
        });
        space.save(f.slot())
      }
    }, function (space) {
      if (space) {
        res.send({ success: 'good' })
      }
    });
  })

  app.get('/spaces/:shortname', function (req, res) {
    var space;
    var f = ff(function() {
      Space.findOne({shortname: req.params.shortname}).exec(f.slot())
    }, function (doc) {
      space = doc;
      if (!space) {
        res.send(400, 'No such space exists!');
        return;
      } else {
        Post.find({space: space._id}).sort({ published: -1 }).exec(f.slot())
      }
    }, function (posts) {
      if (posts) {
        res.render('space', {page: 'space', space: space, posts: posts});
      }
    })
  })

  app.get('/spaces/:shortname/write', function (req, res) {
    var space;
    var f = ff(function() {
      Space.findOne({ shortname: req.params.shortname }).exec(f.slot());
    }, function (doc) {
      space = doc;
      if (!space) {
        res.send('No such space exists to write in!', 400)
      } else {
        res.render('write', {page: 'write', space: space})
      }
    })
  })

  app.post('/spaces/:shortname/save', function (req, res) {
    var user = req.body.user;
    var content = req.body.content;
    var link = req.body.link;
    var space;
    if (!content) {
      res.send('You have to provide a post.', 400);
    } else {
      var f = ff(function () {
        Space.findOne({shortname: req.params.shortname }).exec(f.slot());
      }, function (doc) {
        space = doc;
        if (!space) {
          res.send('No such space exists!', 400);
        } else {
          var post = new Post({
              user: user
            , content: content
            , space: space._id
            , link: link
          })
          space.posts.addToSet(post._id);
          post.save(f.wait())
          space.save(f.wait())
        }
      }).onComplete(function() {
        res.send({ success: 'good' })
      })
    }
  })
}