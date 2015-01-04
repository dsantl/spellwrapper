$(function() {
  var file = loadFile();;

  $('form').on('submit', function(e){
    e.preventDefault();

    $(this).attr('disabled', true);
    $textarea = $(this).find('textarea');
    $textarea.hide();
    $loading = $('.loading');
    $loading.show();

    if (Object.keys(file).length) {
      data = {
        text: $textarea.val(),
        file: {
          filename: file.filename,
          data: file.data
        }
      }
    } else {
      data = { text: $textarea.val() };
    }
    submitForm(data);
  });
});

function loadFile() {
  file_object = {};
  $('input[type="file"]').on('change', function(){
    file = $(this)[0].files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      file_object.filename = file.name;
      file_object.data = event.target.result;
    };
    reader.readAsDataURL(file);
  });
  return file_object;
}

function submitForm(form_data){
  $.ajax({
    type: 'POST',
    url: '/check',
    data: form_data,
    success: function(data) {
      $loading.hide();
      $textarea.val(data.result).show();
    }
  });
}
