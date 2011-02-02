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


function RenderContext(templates){
  var context = Object.create(templates);
  context.data = {
    subscribe: [],
    objectsReferenced: [],
    bindings: []
  };
  return context;
}

var ViewBinding = function(templateName, objId, type){
  return {
    elmId: newId(),
    templateName: templateName,
    objId: objId,
    bindingType: type
  }
}

$templates.renderWithPrependOnUpdate = function(name, obj){
  var data = this.data;
  
  data.subscribe.push(obj.id);
  data.objectsReferenced.push(obj);
  
  var binding = ViewBinding( name, obj.id, "prependOnUpdate" ); 
  data.bindings.push(binding);

  var output = '<div id="'+binding.elmId+'" class="prependOnUpdate">';
  for(var i = obj.length - 1; i >= 0; i--){
    output = output + this.render(name, obj[i]);
  }

  output = output + '</div>';

  return output;
}

$templates.renderWithReplaceOnUpdate = function(name, obj){
  var data = this.data;
  
  data.subscribe.push(obj.id);
  data.objectsReferenced.push(obj);

  var bindingId = newId();

  data.bindings.push({
    elmId: bindingId,
    templateName: name,
    objId: obj.id,
    bindingType: "replaceOnUpdate"
  });

  var output = '<div id="'+bindingId+'" class="replaceOnUpdate">';
  output = output + this.render(name, obj);
  output = output + '</div>';

  return output;
}

var render = function(name, locals){
  var renderContext = new RenderContext($templates);
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
};

var viewList = [];

viewList.id = "viewList";
viewList.add = function(view){
  //let's not get crazy here ;)
  // a ring buffer would be more appropriate,
  //  but this is just an xperiment!
  if(this.length > 10) this.shift();

  this.push(view);
  
  pi.publish(pi.channel("viewList"), {
    channel: "viewList",
    data: view
  });
};

var PageView = function (req){ 
  return {
    remoteAddr: (req.socket && req.socket.remoteAddress),
    time: (new Date).toUTCString(),
    method: req.method,
    referrer: (req.headers['referer'] || req.headers['referrer'] || ''),
    ua: (req.headers['user-agent'] || '')
  }
}

var httpRoutes = function (app){
  app.get('/', function(req, res){
    viewCount.visit();
    viewList.add(new PageView(req));
    res.writeHead(200, { 'Content-Type': 'text/html', 
      'Cache-Control': 'no-cache, no-store' });  
    res.end(render('home', { 
      viewCount: viewCount ,
      viewList: viewList
    }));
  })
}

var server = connect.createServer(
  connect.staticProvider(__dirname + '/public'),
  connect.router(httpRoutes)
);

server.listen("3030");


var pi = new PushIt(server, {});


