$templates={
  "home": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<h1>Hello, world!!</h1><div>" + 
this.renderWithReplaceOnUpdate("view_count", viewCount) + 
"</div><h3>View List</h3><div>" + 
this.renderWithPrependOnUpdate("view_list_item", viewList) + 
"</div>");
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
    return ("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html><head><script src=\"/javascript/jquery.min.js\"></script><script src=\"/javascript/push-it.js\"></script><script src=\"/socket.io/socket.io.js\"></script><script src=\"/templates.js\"></script><script src=\"/javascript/app.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/app.css\" /><title>ViewCount example</title></head><body><div class=\"outer-wrapper\"><div class=\"inner-wrapper\"><div class=\"content\">" + 
content + 
"</div></div></div>\n<script type=\"text/javascript\">\n//<![CDATA[\n" +
etc +
"\n//]]>\n</script>\n</body></html>");
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "view_count": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<h1>View Count partial!!!</h1>You have had <b>" + 
count.toString() + 
"</b> views.<br />Last visit was: <b>" + 
lastVisit + 
"</b>" +
(function () { if (count > 10) { return (
"<h2>You are so popular!!!</h2>"
);} else { return ""; } }).call(this));
  } catch (e) {
    return "\n<pre class='error'>" + html_escape(e.stack) + "</pre>\n";
  }
}
}
, "view_list_item": function (locals) {
function html_escape(text) {
    return (text + "").
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;").
      replace(/\"/g, "&quot;");
  }
with(locals || {}) {
  try {
    return ("<div class=\"view_list_item\"></div> [" +
time +
"] " +
remoteAddr +
" : [" +
method +
"] -- " +
ua);
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