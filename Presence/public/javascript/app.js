$(function(){
    pushIt = new PushIt({
      hostname: document.domain,
  		channels: $pageData.subscribe
  	});

    pushIt.onMessageReceived = function(message){
      console.log(message);
      router.trigger(message.channel, message);
    };

    var router = {
      callbacks: {},
      on: function(chan, callback){
        this.callbacks[chan] || (this.callbacks[chan]=[]);
        this.callbacks[chan].push(callback);
      },
      trigger: function(chan, message){
        var callbacks = this.callbacks[chan];

        if(callbacks && callbacks.length){
          for(var i = 0, l= callbacks.length; i < l; i++){
            callbacks[i](message.data);
          }
        }
      }
    };
 
    var bindings = {
      replaceOnUpdate : function(elm, objId, templateName){
        router.on(objId, function(data){
          elm.html($templates.render(templateName, data));
        });
      },
      prependOnUpdate : function(elm, objId, templateName){
        router.on(objId, function(data){
          elm.prepend($templates.render(templateName, data));
        });
      },
      collectionWithAddRemove: function(elm, objId, templateName){
        var str;
        router.on(objId, function(data){
          if(data.action == "add"){
            str = $templates.render(templateName, data.item);
            str = $templates.render("item", {id: data.item.id, content: str});
            elm.prepend(str);
          }else{
            elm.children("[data-item-id="+data.item.id+"]").remove();
          }
        });
      }
    }

    var elm, templateName, binding;
    for(i=0, l = $pageData.bindings.length; i < l; i++){
      binding = $pageData.bindings[i];
      bindings[binding.bindingType]($('#'+binding.elmId), binding.objId, binding.templateName);
    }
});
