$templates={
  "board": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<div class=\"north\">" + 
"<div class=\"" + html_escape("nw " + nw) + "\">" + 
"" +
(nw || "") + 
"</div>" + 
"<div class=\"" + html_escape("n " + n) + "\">" + 
"" +
(n || "") + 
"</div>" + 
"<div class=\"" + html_escape("ne " + ne) + "\">" + 
"" +
(ne || "") + 
"</div></div><div class=\"center\">" + 
"<div class=\"" + html_escape("cw " + cw) + "\">" + 
"" +
(cw || "") + 
"</div>" + 
"<div class=\"" + html_escape("c " + c) + "\">" + 
"" +
(c || "") + 
"</div>" + 
"<div class=\"" + html_escape("ce " + ce) + "\">" + 
"" +
(ce || "") + 
"</div></div><div class=\"south\">" + 
"<div class=\"" + html_escape("sw " + sw) + "\">" + 
"" +
(sw || "") + 
"</div>" + 
"<div class=\"" + html_escape("s " + s) + "\">" + 
"" +
(s || "") + 
"</div>" + 
"<div class=\"" + html_escape("se " + se) + "\">" + 
"" +
(se || "") + 
"</div></div><div class=\"clear\"></div>" +
(function () { if (winner) { return (
"" +
winner +
" Won!!!"
);} else { return ""; } }).call(this));
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "game": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<h1>Welcome to Your Game!</h1><h2>You are " + 
"<span class=\"" + html_escape(player) + "\">" + 
player + 
"</span></h2><p>Id: " +
board.id + 
"</p><p></p><div id=\"board\">" +
 this.render("board", board)  + 
"</div>");
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "home": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<h1>Welcome to XOXO</h1><p>You can play Tic-Tac-Toe with a friend.</p><a href=\"/games/" +
randomId +
"\" class=\"start\">Start a new game.</a>");
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "layout": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html><head><script src=\"/javascript/jquery.min.js\"></script><script src=\"/templates.js\"></script><script src=\"/javascript/app.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/app.css\" /><title>XOXO example</title></head><body><div class=\"outer-wrapper\"><div class=\"inner-wrapper\"><div class=\"content\">" + 
content + 
"</div></div></div></body></html>");
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "render": function (name, locals){
      return this[name](locals);
    }
, render: function(name, locals){ return this[name](locals); }
}