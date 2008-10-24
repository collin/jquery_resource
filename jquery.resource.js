;(function(_){
  var resources = {}
    ,Resource = _.clone({
      singular: ''
      ,plural: ''
      
      ,before_load: function() {}
      ,after_load: function() {}
      ,on_load: function() {}
      ,error_loading: function() {}
      ,timeout_loading: function() {}
      
      ,load: function(opts) {
        _.ajax({
          url: _[this.plural+'_path'](opts)
          ,beforeSend: this.before_load
          ,complete: this.after_load
          ,error: this.error_loading
          ,success: this.on_load
          ,timeout: this.timeout_loading
          ,type: 'GET'
          ,contentType: 'text/x-json'
        });
      }
      
      ,before_fetch: function() {}
      ,after_fetch: function() {}
      ,on_fetch: function() {}
      ,error_fetching: function() {}
      ,timeout_fetching: function() {}
      
      ,fetch: function(id, opts) {
        _.ajax({
          url: _[this.singular+'_path'](id, opts)
          ,beforeSend: this.before_fetch
          ,complete: this.after_fetch
          ,error: this.error_fetching
          ,success: this.on_fetch
          ,timeout: this.timeout_fetching
          ,type: 'GET'
          ,contentType: 'text/x-json'
        });
      }
    });
    
  _.resource = function(name) {
    if(resources[name]) {/* Do Nothing*/}
    else {
      _.route(name);
      resources[name] = Resource.clone({
        singular: name
        ,plural: Inflector.pluralize(name)
        ,route: name
      });
    } 
    return resources[name];
  }
})(jQuery);
