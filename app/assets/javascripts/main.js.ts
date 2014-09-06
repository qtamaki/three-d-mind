/// <reference path="ts/d3.d.ts" />
/// <reference path="ts/jquery.d.ts" />
/// <reference path="ts/jqueryui.d.ts" />
/// <reference path="ts/context.js.ts" />
/// <reference path="ts/keyword.js.ts" />
/// <reference path="ts/view_controller.js.ts" />

/* data image.
var x = {
  "rootKeyword": "ああああ",
  "keywords": {
    "ああああ": [
      {"keyword":"いいいい","px":0.5,"py":0.1},
      {"keyword":"うううう","px":0.4,"py":0.1},
      {"keyword":"ええええ","px":0.3,"py":0.1}
      ],
    "けけけけ": [
      {"keyword":"ええええ","px":0.8,"py":0.4}
    ],
    "くくく": []
  }
}
*/
function initInputBox(view: ViewController) {
  $('#inputbox')
    .on('keydown', function(e) {
      if (e.keyCode === 13) {
        if (this.value != "") {
          if (view.validWord(this.value)) {
            view.addKeyword(this.value);
            this.value = '';
          } else {
            alert("Keyword was existed yet.");
          }
        }
        return false;
      } else {
        return true;
      }
    })
    .focus();
}

function initButton(view: ViewController, note_url: string) {
  $('#save_button').on('click', function(e) {
    $.ajax({
      type: 'PUT',
      url: note_url,
      data: {
        note: {
          note_contents: JSON.stringify(view.context.manager),
          lock_version: view.context.lockVersion
        }
      },
      success: (data) => {
        view.context.lockVersion = eval(data);
        view.changed = false;
        alert('Ok, complited.');
      }
    });
  });
  $('#publish_button').on('click', function(e) {
    var un = '';
    if(view.context.published == 1) {
      un = 'un';
    }
    if(window.confirm('Are you want to '+un+'publishing this page?')){
      $.ajax({
        type: 'PUT',
        url: note_url,
        data: {
          note: {
            published: (view.context.published + 1) % 2,
            lock_version: view.context.lockVersion
          }
        },
        success: (data) => {
          view.context.lockVersion = eval(data);
          view.context.published = (view.context.published + 1) % 2;
          if(view.context.published == 0) {
            $(this).attr('value', "Publish");
            $('#published_url').attr("style","display:none");
          }else{
            $(this).attr('value', "Unpublish");
            $('#published_url').attr("style","");
          }

          alert(un+'published.');
        }
      });
    }
  });
}

function init(note_data: any, note_url: string, lock_version: number, published: number, read_only: number) {
  var manager = new KeywordManager;

  manager.loadData(note_data);

  var context = new Context(
      document.documentElement.clientHeight,
      document.documentElement.clientWidth,
      1,
      manager, lock_version, published, read_only);

  d3.select('#note-container')
    .append('svg')
    .attr({xmlns: "http://www.w3.org/2000/svg",
      width: context.stageWidth,
      height: context.stageHeight - 70})

  var view = new ViewController(d3.select('svg'), context);
  view.draw(manager.rootKeyword);
  initInputBox(view);
  initButton(view, note_url);

  window.onbeforeunload = function(event){
    if(view.changed && view.context.read_only == 0) {
      event.returnValue = 'Any changes are unsaved. move out this page?';
    }
  }
}

$(function() {
  var n = $('#note-container');
  if(n.is('#note-container')) {
    var note_url = n.attr('note_url');
    var lock_version = +n.attr('lock_version');
    var published = +n.attr('published');
    var read_only = +n.attr('read_only');
    $.get(note_url, (data) => {
      var note_data = JSON.parse(data.note_contents);
      init(note_data, note_url, lock_version, published, read_only);
    });
  }
});


