jQuery(function(_){
  Function.prototype.withArgs = function() {
    var f = this, args = _.makeArray(arguments);
    return function() {
      return f.apply(null, args);
    };
  };
  
  var loc = window.location,
    url_prefix = loc.protocol+'//'+loc.hostname+':'+loc.port;
      
  _.route('book');
  
  match("/books", _.books_path);
  match(url_prefix+"/books", _.books_url);
  
  match("/books?good=true", _.books_path.withArgs({good:true}));
  match(url_prefix+"/books?good=true", _.books_url.withArgs({good:true}));
  
  match("/books/1", _.book_path.withArgs(1));
  match(url_prefix+"/books/1", _.book_url.withArgs(1));
  
  match("/books/barnaby_jones",_.book_path.withArgs('barnaby_jones'));
  match(url_prefix+"/books/barnaby_jones",_.book_url.withArgs('barnaby_jones'));
  
  match("/books/the_theif?page=33", _.book_path.withArgs('the_theif', {page:33}));
  match(url_prefix+"/books/the_theif?page=33", _.book_url.withArgs('the_theif', {page:33}));
  
  _.resource('author');
  exists(_, 'author_path');
  exists(_, 'author_url');
  exists(_, 'author');
  
  
  var fetched = 0
    ,limit = 100;
  
  _.author.on_get = function(author) {fetched++;};
  
  _.author.after_get = function() {
    match(limit, fetched);
    _.author.on_get = function() {}
    _.author.after_get = function() {
      exists(_.author.id_map, 700);
      assert(!_.author.id_map[700].new_record)
    }
    
    executes(function(){
      _.author.get(700);
    });
  };
  
  executes(function() {
    _.author.get({limit:limit});
  });
  
  var created_id;
  
  _.author.on_post = function(author) {
    match("fonderfoot@wubblemo.com", function(){return author.email});
    assert(!author.new_record);
    created_id = author.id;
    
    _.author.on_put = function(author) {
      match("Englebart", function(){return author.first_name;});
      var author_id = author.id;
      _.author.on_delete = function(author) {
        assert(author.new_record);
        assert(!author.id);
        match(undefined, _.author.id_map[author_id]);
      };
      
      executes(function(){
        author.delete();
      });
    };
    
    executes(function(){
      author.put({
        first_name: "Englebart"
      });
    });
  }
  
  executes(function(){
    _.author.post({
      birthday: "Sun Oct 19 00:00:00 -0500 2008"
      ,city: "East WhiteHaven"
      ,company: "Sklaner Fontley"
      ,email: "fonderfoot@wubblemo.com"
      ,first_name: "Abi"
      ,last_name: "Soralny"
      ,phone_number: "897-838-2930"
      ,state: "California"
      ,street_address: "4388 4th Ave"
      ,zip: "99903-9382"
    });
  });
  
  raises(function(){_.author.put();});
  raises(function(){_.author.delete();});
  
});
