/// <reference path="jquery.d.ts" />
$(function(){
var user = "<h1>hello, TypeScript!!</h1>";

JSON.stringify(user);
//document.body.innerHTML = user;
});

interface Pos {
  x: number;
  y: number;
}

interface Node {
  pos: Pos;
  text: string;
  node_color: string;
  nodes: Node[];
}

interface Note {
  top_node: Node;
}

interface User {
  nick_name: string;
  user_id: string;
  notes: Note[];
}


