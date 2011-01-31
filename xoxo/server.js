var connect = require('connect'),
    sharedViews = require('shared-views'),
    Haml = Haml = require("haml"),
    PushIt = require("push-it").PushIt,
    newId = require("uuid-pure").newId,
    _ = require("underscore")._;

var redis = require("redis"),
    client = redis.createClient();

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

//write out the templates to public/templates.js, assigned to the $templates global var
sharedViews.writeTemplateStrings(
  (__dirname + "/public/templates.js"), 
  "$templates",
  compiledTemplates.strings
);

//convienence to render template by name with a layout
var render = function(name, locals){
  return $templates.render('layout', { 
    content: $templates.render(name, locals)
  });
};

function getNewBoard(){
  return {
    nw: null,
    n: null,
    ne: null,
    cw:null,
    c: null,
    ce: null,
    sw: null,
    s: null,
    se: null,
    currentTurn: "X",
    winner: null,
    id: null
  };
}

function httpRoutes(app){
  app.get('/', function(req, res){
    var id = newId();
    
    res.writeHead(200, { 'Content-Type': 'text/html', 
      'Cache-Control': 'no-cache, no-store' });
    res.end(render('home', {randomId: id} ));
  });
  
  app.get('/games/:id', function(req, res){
    var id = req.params.id;
    radiator.get(id, function(err, obj){
      if(err || !(obj)){
        var board = getNewBoard();
        board.id = id;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(render('game', { board: board, player: "X" } ));
        radiator.save(board);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html'});
        res.end(render('game', { board: obj, player: "O" } ));
      }
    });
  });
};


var server = connect.createServer(
  connect.staticProvider(__dirname + '/public'),
  connect.router(httpRoutes)
);





Radiator = function(){
};

Radiator.prototype = {
  'save': function(obj, callback){
    console.log("save called")
    var len = arguments.length;
    var str;
    
    if(typeof obj == "string"){
      str = obj;
    }else{
      str = JSON.stringify(obj);
      console.log("SAVING: "+str);
    }
    
    client.set(obj.id, str, function(){
      console.log("SET IT: "+str);
      if(len > 1) callback(obj, null);
    });
   },
   
   'get': function(id, callback){
     client.get(id, function(err, obj){
       try{
         console.log("GETTING: "+obj.toString());
         obj = JSON.parse(obj);
         callback(err, obj);     
       }catch(e){
         callback(e, null);
       }
     });
   }
};

radiator = new Radiator();


pi = new PushIt(server, {});

pi.onPublicationRequest = function(channel, agent, message){
  var parts = channel.name.match(/^transitive\.([^\.]{22})(\.[^\.]+)?$/);
  if(parts){
    var id = parts[1];
    
    radiator.get(id, function(err, obj){
      
      //merge changes in!
      
      for(k in message.data){
        obj[k] = message.data[k];
      }
      
      radiator.save(obj, function(obj, err){
        if(!err){
          channel.publish(message);
          agent.publicationSuccess(message);
        }
      });      
    });
  } else {
    channel.publish(message);
    agent.publicationSuccess(message);
  }
};

server.listen(3030);