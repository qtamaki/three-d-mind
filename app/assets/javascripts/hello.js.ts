/// <reference path="jquery.d.ts" />
$(function(){
var user = "<h1>hello, TypeScript!!</h1>";

document.body.innerHTML = user;
});

interface Pos {
  x: Number;
  y: Number;
}

interface Node {
  pos: Pos;
  text: String;
  node_color: String;
  nodes: Node[];
}

interface Note {
  top_node: Node;
}

interface User {
  nick_name: String;
  user_id: String;
  notes: Note[];
}


