$(function() {
  $('#save').on('click', function () {
    var $form = $('#postform');
    $.ajax({
        type: 'POST'
      , url: '/spaces/' + Locals.shortname + '/save'
      , data: {
            user: $('#user').val()
          , content: $('#post').val()
          , link: $('#link').val()
        }
    }).done(function(msg){
      window.location = '/spaces/' + Locals.shortname;
    }).fail(function(err, status){
      alert(err.responseText);
    })
  })
})