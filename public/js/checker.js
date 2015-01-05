$(function() {
  var file = loadFile();
  $textarea = $('form textarea');
  $checked_text = $('#checked-text');
  $insert_btn = $('#insert-btn');
  $check_btn = $('#check-btn');
  REGEX = /ERROR\{(.+?)\}\{(.*?)\}/;

  $('body').on('click', '#clear-btn', function(e){
    $textarea.val('').show();
    $checked_text.hide();
    $insert_btn.hide();
    $check_btn.show();
  });

  $insert_btn.on('click', function(e){
    $textarea.show();
    $checked_text.hide().text('');
    $insert_btn.hide();
    $check_btn.show();
  });

  $('body').on('submit', 'form', function(e){
    e.preventDefault();
    if ($(this).attr('disabled') == 'disabled') {
      return false;
    }

    $form = $(this);
    $form.attr('disabled', true).addClass('disabled');
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
      // $textarea.val(data.result).show();
      $form.attr('disabled', false).removeClass('disabled');
      formatted_result = formatResult(data.result);
      $checked_text.html(formatted_result).show();
      $insert_btn.show();
      $check_btn.hide();
    }
  });
}

function formatResult(data){
  match = data.match(REGEX);
  while (match) {
    replaced_string = match[0];
    replacing_string = '<span class="error">' + match[1];
    suggestions = match[2].split(',');
    if (suggestions.length) {
      replacing_string += '<span class="suggestions">';
      $.each(suggestions, function(i, suggestion){
        replacing_string += '<span class="suggestion">' + suggestion + '</span>';
      });
      replacing_string += '</span>';
    }
    replacing_string += '</span>';
    replaced_regex = RegExp(replaced_string, 'g');
    data = data.replace(replaced_regex, replacing_string);
    match = data.match(REGEX);
  }
  return data;
}
