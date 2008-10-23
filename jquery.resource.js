;(function(_){
  _.resource = function(name) {
    var pluralized = Inflector.pluralize(name)
      ,loc = window.location
      ,url_base = loc.protocol+'//'+loc.hostname;
    
    function query_string(options) {
      if(options == undefined) return "";
      var q = "?", slot;
      for(slot in options) q+= "&" + slot + '=' + options[slot];
      return q;
    }
    
    function path_with_options(fn) {
      return function() {
        var args = _.makeArray(arguments), options;
        if(args.length > 1) options = args.pop();
        return fn.call(this, args) + query_string(options);
      };
    };
    
    _[pluralized+'_path'] = function() {
      return '/'+pluralized;
    };
    
    _[pluralized+'_url'] = function() {
      return url_base+'/'+pluralized;
    };
    
    _[name+'_path'] = path_with_options(function(id) {
      return _[pluralized+'_path']() + '/' + id;
    });
    
    
  }
})(jQuery);
