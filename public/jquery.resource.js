;(function(_){
  Function.prototype.bind = function(that) {
    var f = this,
      args = _.makeArray(arguments);
      args.shift();
    return function() {
      return f.apply(that, args.concat(_.makeArray(arguments)));
    };
  };
   
  var Resource = _.clone({
      singular: ''
      ,plural: ''
      ,id_map: {}
      ,new_record: true
      
      ,instance_route: function() {
        return this.route(this.id);
      }

      ,xhr_error: function(xhr, stat, err) { 
        console.log(xhr, stat, err);
        _('body').html(xhr.responseText);
      }

      ,on_get: function() {}
      ,after_get: function() {}
      ,load: function(data, status) {
        data = _.makeArray(data);
        var i, len = data.length, resource;
        for(i=0; i<len; i++) {
          resource = this.id_map[data[i].id] = this.clone(data[i]);
          resource.new_record = false;
          this.on_get(resource);
        }
      }
      ,get: function(opts) {
        _.ajax({
          url: this.route(opts)
          ,dataType: 'json'
          ,type: 'get'
          ,complete: this.after_get.bind(this)
          ,success: this.load.bind(this)
          /* SILLY */
          ,timeout: this.xhr_error
          ,error: this.xhr_error
        });
      }
      
      ,on_post: function() {}
      ,after_post: function() {}
      ,instantiate: function(data, id) {
        data.id = id;
        var resource = this.id_map[id] = this.clone(data);
        resource.new_record = false;
        this.on_post(resource);
      }
      
      ,post: function(data) {
        _.ajax({
          url: this.route()
          ,dataType: 'json'
          ,contentType: 'text/x-json'
          ,type: 'POST'
          ,data: {
            author: JSON.stringify(data)
          }
          ,complete: this.after_post.bind(this)
          ,success: this.instantiate.bind(this, data)
          /* SILLY */
          ,timeout: this.xhr_error
          ,error: this.xhr_error
        })
      }
      
      ,on_put: function() {}
      ,after_put: function() {}
      ,update: function(data) {
        _.extend(this, data);
        this.on_put(this);
      }
      
      ,put: function(data) {
        this.new_records_throw("Can not PUT to an uncomitted record(no id)");
        _.ajax({
          url: this.instance_route()
          ,dataType: 'json'
          ,contentType: 'text/x-json'
          ,type: 'POST'
          ,data: {
            _method:'PUT'
            ,author: JSON.stringify(data)
          }
          ,complete: this.after_put.bind(this)
          ,success: this.update.bind(this, data)
          /* SILLY */ 
          ,timeout: this.xhr_error
          ,error: this.xhr_error
        });
      }
      
      ,on_delete: function() {}
      ,after_delete: function() {}
      ,expunge: function(data) {
        delete this.id_map[this.id];
        delete this.id;
        this.new_record = true;
        this.on_delete(this);
      }
      
      ,'delete': function() {
        this.new_records_throw("Can not DELETE to an uncomitted record(no id)");
        _.ajax({
          url: this.instance_route()
          ,dataType: 'json'
          ,contentType: 'text/x-json'
          ,type: 'POST'
          ,data: {_method:'DELETE'}
          ,complete: this.after_delete.bind(this)
          ,success: this.expunge.bind(this)
          /* SILLY */
          ,timeout: this.xhr_error
          ,error: this.xhr_error
        });
      }
      
      ,new_records_throw: function(msg) {
        if(this.new_record) throw new Error(msg);
      }
    });
    
  _.resource = function(name) {
    if(_[name]) {/* Do Nothing*/}
    else {
      _.route(name);
      _[name] = Resource.clone({
        singular: name
        ,plural: Inflector.pluralize(name)
        ,route: _[name+'_path']
      });
    } 
    return _[name];
  }
})(jQuery);
