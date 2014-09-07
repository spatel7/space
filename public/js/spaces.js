$(document).ready(function() {
  getSpaces();
})

var getSpaces = function () {
  getLocation(function(err, position) {
    if (err) {
      alert('Geolocation failed: ' + err);
    } else {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log("Lat: " + lat + " and lon: " + lon);
      $.get('/api/spaces/'+lat+'/'+lon, function (data) {
        var content = $('#allspaces');
        var htmlString = "";
        if (!data.length) {
          console.log(data);
          htmlString = "<p>There are no spaces here. Make one!</p>";
        } else {
          for (var i = 0; i < data.length; i++) {
            htmlString += "<a class='space' href='/spaces/"+data[i]['shortname'] + "'>";
            htmlString += "<div id='spaceBar'><span><strong>#" + data[i]['shortname'] + "</strong> - " + data[i]['posts'].length + " posts</span>";
            htmlString += "<br><span>" + data[i]['name'] + "</span></div></a>"
          }
        }
        content.html(htmlString);
        $('#accuracy').html("(" + position.coords.accuracy + "%)");
      });
    }
  })
}

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