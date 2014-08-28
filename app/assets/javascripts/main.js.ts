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
            alert("追加できません。既に入力済みです");
          }
        }
        return false;
      } else {
        return true;
      }
    })
    .focus();
}

function initSaveButton(view: ViewController, note_url: string) {
  $('#save').on('click', function(e) {
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
        alert('保存しました');
      }
    });
  });
}

function init(note_data: any, note_url: string, lock_version: string) {
  var manager = new KeywordManager;

  manager.loadData(note_data);

  var context = new Context(
      document.documentElement.clientHeight,
      document.documentElement.clientWidth,
      1,
      manager, +lock_version);

  d3.select('#note-container')
    .append('svg')
    .attr({xmlns: "http://www.w3.org/2000/svg",
      width: context.stageWidth,
      height: context.stageHeight - 70})

  var view = new ViewController(d3.select('svg'), context);
  view.draw(manager.rootKeyword);
  initInputBox(view);
  initSaveButton(view, note_url);

  window.onbeforeunload = function(event){
    if(view.changed) {
      event.returnValue = 'Any changes are unsaved. move out this page?';
    }
  }
}

$(function() {
  var n = $('#note-container');
  if(n) {
    var note_url = n.attr('note_url');
    var lock_version = n.attr('lock_version');
    $.get(note_url, (data) => {
      var note_data = JSON.parse(data.note_contents);
      init(note_data, note_url, lock_version);
    });
  }
});


