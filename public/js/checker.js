$(function() {
  loaded_file = {};
  loadFile();
  $textarea = $('form textarea');
  $checked_text = $('#checked-text');
  $insert_btn = $('#insert-btn');
  $check_btn = $('#check-btn');
  MISSPELLED_WORD_REGEX = /ERROR\{(.+?)\}\{(.*?)\}/;
  STRIP_HTML_REGEX_1 = /<\/span>.+?<\/div>/g;
  STRIP_HTML_REGEX_2 = /<div class="error"><span class="word( replaced)?">/g;

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

    var data;
    if (Object.keys(loaded_file).length) {
      data = {
        file: {
          filename: loaded_file.filename,
          data: loaded_file.data
        }
      }
    } else {
      data = { text: $textarea.val() };
    }
    submitForm(data);
  });

  $('body').on('click', '#checked-text .error .word', function(e){
    e.stopPropagation();
    // console.log('word');
    $(this).closest('.error').siblings().find('.suggestions').hide();
    $(this).siblings('.suggestions').toggle();
  });

  $('body').on('click', function(e){
    e.stopPropagation();
    // console.log('ostalo');
    var target_class = e.target.className;
    if (target_class != 'suggestion' && target_class != 'replace-all') {
      $('#checked-text .error .suggestions').hide();
    }
  });

  $('body').on('click', '#checked-text .error .suggestion', function(e){
    e.stopPropagation();
    // console.log('suggestion');
    var replace_all =  $(this).closest('.error').find('.replace-all input').prop('checked');
    if (replace_all) {
      replaceAllWords($(this));
    } else {
      replaceCurrentWord($(this));
    }
    $('#checked-text .error .suggestions').hide();
  });
});

function replaceAllWords(suggestion) {
  // console.log('all');
  var selected_suggestion = suggestion.text();
  var $replaced_word = suggestion.closest('.error').find('.word');
  var replaced_word_html = $replaced_word[0];
  var old_word_html = replaced_word_html.outerHTML;

  $replaced_word.text(selected_suggestion);
  $replaced_word.addClass('replaced');
  var new_world_html = replaced_word_html.outerHTML;

  var new_checked_html = $checked_text.html().replace(old_word_html, new_world_html);
  $checked_text.html(new_checked_html);
  var new_text = $checked_text.html().replace(STRIP_HTML_REGEX_1, '').replace(STRIP_HTML_REGEX_2, '');
  $textarea.val(new_text);
}

function replaceCurrentWord(suggestion) {
  // console.log('current');
  var selected_suggestion = suggestion.text();
  var $replaced_word = suggestion.closest('.error').find('.word');
  $replaced_word.text(selected_suggestion);
  $replaced_word.addClass('replaced');
  var new_text = $checked_text.html().replace(STRIP_HTML_REGEX_1, '').replace(STRIP_HTML_REGEX_2, '');
  $textarea.val(new_text);
}

function loadFile() {
  // var file_object = {};
  $('input[type="file"]').on('change', function(){
    var file = $(this)[0].files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      loaded_file.filename = file.name;
      loaded_file.data = event.target.result;
    };
    reader.readAsDataURL(file);
  });
  // return file_object;
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
      $form.find('input[type="file"]').val("");
      loaded_file = {};

      if (Object.keys(form_data)[0] != "text") {
        new_text = $checked_text.html().replace(STRIP_HTML_REGEX_1, '').replace(STRIP_HTML_REGEX_2, '');
        $textarea.val(new_text);
      }
    }
  });
}

function formatResult(data){
  var match = data.match(MISSPELLED_WORD_REGEX);
  while (match) {
    replaced_string = match[0];
    var replacing_string = '<div class="error">';
    replacing_string += '<span class="word">' + match[1] + '</span>';
    var suggestions = match[2].split(',');
    replacing_string += '<span class="suggestions">';
    if (suggestions.length) {
      $.each(suggestions, function(i, suggestion){
        replacing_string += '<span class="suggestion">' + suggestion + '</span>';
      });
    }
    var replace_all_check = '<label class="replace-all"><input class="replace-all" type="checkbox" checked>Zamijeni sve</label>';
    replacing_string += '<span class="suggestion original">' + match[1] + '</span>' + replace_all_check +'</span></span></div>';
    var replaced_regex = RegExp(replaced_string, 'g');
    data = data.replace(replaced_regex, replacing_string);
    match = data.match(MISSPELLED_WORD_REGEX);
  }
  return data;
}
