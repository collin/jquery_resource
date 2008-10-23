jQuery(function(_){
  var loc = window.location;  
  _.resource('book')
  
  match("/books", _.books_path);
  match(loc.protocol+'//'+loc.hostname+"/books", _.books_url);
  
  match("/books/1", function() {
    return _.book_path(1);
  });
  
  match("/books/barnaby_jones", function() {
    return _.book_path('barnaby_jones');
  });
  
  match("/books/the_theif?&page=33", function() {
    return _.book_path('the_theif', {page:33});
  });
});
