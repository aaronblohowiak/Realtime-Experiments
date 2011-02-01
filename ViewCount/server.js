var sharedViews = require('shared-views'),
    connect = require("connect"),
    Haml = Haml = require("haml"),
    PushIt = require("push-it").PushIt,
    newId = require("uuid-pure").uuid,
    _ = require("underscore")._;

//grab a list of file names that end in .haml in the views/ folder
var filenames = require('glob').globSync("./views/*.haml");

var options = {
  templateFileNames : filenames,
  sourceToFunction: function(source) { return Haml(source, false); },
  filenameToTemplateName : function(filename){
    //let's call the views by their base filename, without the folder or ext
    return filename.replace(/^\.\/views\//, '').replace(/\.haml$/, '');
  }
};

//do all of the compilation and preparation of templates
var compiledTemplates = sharedViews.filenamesToTemplates(options),
    $templates = compiledTemplates.functions;

//write out the templates to public/templates.js,
//  assigned to the $templates global var
sharedViews.writeTemplateStrings(
  (__dirname + "/public/templates.js"), 
  "$templates",
  compiledTemplates.strings
);

$templates.renderWithReplaceOnUpdate = function(name, obj){

  this.data || ( this.data = {});
  var data = this.data;

  data.subscribe || (data.subscribe = []);
  data.objectsReferenced || (data.objectsReferenced = []);
  
  data.subscribe.push(obj.id);
  data.objectsReferenced.push(obj);

  var bindingId = newId();
  
  data.bindings || (data.bindings = []);

  data.bindings.push({
    elmId: bindingId,
    templateName: name,
    objId: obj.id,
    bindingType: "replaceOnUpdate"
  });

  var output = '<div id="'+bindingId+'" class=".replaceOnUpdate">';
  output = output + this.render(name, obj);
  output = output + '</div>';

  return output;
}

var render = function(name, locals){
  var renderContext = Object.create($templates);
  var content = renderContext.render(name, locals);
  var etc = JSON.stringify(renderContext.data);
 
  etc = "$pageData = " + etc;
  
  return renderContext.render('layout', { 
    content: content,
    etc: etc
  });
};

var viewCount = {
  count: 0,
  lastVisit: (new Date).toString(),
  id: "viewCount"
};

viewCount.visit = function(){
  this.count = this.count + 1;
  this.lastVisit = (new Date).toString();
  pi.publish(pi.channel("viewCount"), {
    channel: "viewCount",
    data: this
  });
}

function httpRoutes(app){
  app.get('/', function(req, res){
    viewCount.visit();
    res.writeHead(200, { 'Content-Type': 'text/html', 
      'Cache-Control': 'no-cache, no-store' });  
    res.end(render('home', { viewCount: viewCount } ));
  })
}

var server = connect.createServer(
  connect.staticProvider(__dirname + '/public'),
  connect.router(httpRoutes)
);

server.listen("3030");


var pi = new PushIt(server, {});


