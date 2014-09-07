$(function() {
  $('#save').on('click', function () {
    // get location first. If not available, then say not possible to create.
    getLocation(function(err, position) {
      if (err) {
        alert('Geolocation failed: ' + err);
      } else {
        var shortname = $('#shortname').val();
        var name = $('#name').val();
        $.ajax({
            type: 'POST'
          , url: '/save'
          , data: {
              shortname: shortname
            , name: name
            , lat: position.coords.latitude
            , lon: position.coords.longitude
          }
        }).done(function(msg){
          window.location = '/spaces/' + shortname
        }).fail(function(err, status) {
          alert(err.responseText);
        })
      }
    });
  })
})

var getLocation = function(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      return callback(null, position)
    }, function () {
      return callback('You need to allow geolocation to make a space! We promise we will not do anything crazy.');
    }, {
        'enableHighAccuracy':true,'timeout':10000,'maximumAge':0
    })
  } else {
    return callback('Your browser does not support geolocation. Sorry.');
  }
}