;(function(_){
  Function.prototype.bind = function(that) {
    var f = this;
    return function() {
      return f.apply(that, arguments);
    };
  };
   
  var Resource = _.clone({
      singular: ''
      ,plural: ''
      ,id_map: {}
      ,on_get: function() {}
      ,after_get: function() {}
      ,load: function(data, status) {
        var i, len = data.length, resource;
        for(i=0; i<len; i++) {
          resource = this.id_map[data[i].id] = this.clone(data[i]);
          this.on_fetch(resource);
        }
      }
      ,get: function(opts) {
        _.ajax({
          url: this.route(opts)
          ,complete: this.after_get.bind(this)
          ,success: this.load.bind(this)
          ,dataType: 'json'
          /* SILLY */
          ,error: function() {console.error(arguments);}
          ,timeout: function() {console.error(arguments);}
        });
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
