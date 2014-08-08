/// <reference path="d3.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
/// <reference path="context.js.ts" />
/// <reference path="keyword.js.ts" />
/// <reference path="main_view.js.ts" />

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

function init(note_data) {
  var manager = new KeywordManager;

  manager.loadData(note_data);

  var context = new Context(
      document.documentElement.clientHeight,
      document.documentElement.clientWidth,
      new KeywordProperty(50, 100, 20),
      manager);

  var view = new MainView(d3.select('svg'), context);
}

$(function() {
  var n = $('#note-container');
  if(n) {
    $.get(n.attr('note_url'), (data) => {
      var note_data = JSON.parse(data.note_contents);
      init(note_data);
    });
  }
});

