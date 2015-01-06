$(function() {
  var file = loadFile();
  $textarea = $('form textarea');
  $checked_text = $('#checked-text');
  $insert_btn = $('#insert-btn');
  $check_btn = $('#check-btn');
  MISSPELLED_WORD_REGEX = /ERROR\{(.+?)\}\{(.*?)\}/;
  STRIP_HTML_REGEX_1 = /<\/span>.+?<\/div>/g;
  STRIP_HTML_REGEX_2 = RegExp('<div class="error"><span class="word">', 'g');

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

  $('body').on('click', '#checked-text .error .word', function(e){
    e.stopPropagation();
    $(this).closest('.error').siblings().find('.suggestions').hide();
    $(this).siblings('.suggestions').toggle();
  });

  $('body').on('click', ':not(#checked-text .error .word)', function(e){
    e.stopPropagation();
    $('#checked-text .error .suggestions').hide();
  });

  $('body').on('click', '#checked-text .error .suggestion', function(e){
    e.stopPropagation();
    selected_suggestion = $(this).text();
    $(this).closest('.error').find('.word').text(selected_suggestion);

    new_text = $checked_text.html().replace(STRIP_HTML_REGEX_1, '').replace(STRIP_HTML_REGEX_2, '');
    $textarea.val(new_text);
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
  match = data.match(MISSPELLED_WORD_REGEX);
  while (match) {
    replaced_string = match[0];
    replacing_string = '<div class="error">';
    replacing_string += '<span class="word">' + match[1] + '</span>';
    suggestions = match[2].split(',');
    replacing_string += '<span class="suggestions">';
    if (suggestions.length) {
      $.each(suggestions, function(i, suggestion){
        replacing_string += '<span class="suggestion">' + suggestion + '</span>';
      });
    }
    replacing_string += '<span class="suggestion original">' + match[1] + '</span></span></span></div>';
    replaced_regex = RegExp(replaced_string, 'g');
    data = data.replace(replaced_regex, replacing_string);
    match = data.match(MISSPELLED_WORD_REGEX);
  }
  return data;
}
