require 'rubygems'
require 'sinatra/lib/sinatra'
require 'sequel'
require 'json'

DB = Sequel.sqlite 'authors.squlite3'
AuthorSet = DB[:authors]
class Author < Sequel::Model; end

def query  
  params.inject({}) do |obj, pair|
    obj[pair.first.intern] = pair.last unless pair.first.nil?
    obj
  end
end

def current_author
  AuthorSet.where(:id => params[:id])
end

def author_params
  JSON.parse params[:author]
end

get '/authors/' do
  AuthorSet.all(query).to_json
end

get '/authors/:id' do
  current_author.all.to_json
end

post '/authors/' do
  author = Author.create author_params
  author.id.to_s
end

put '/authors/:id' do
  current_author.update author_params
  'true'
end

delete '/authors/:id' do
  current_author.delete
  'true'
end
