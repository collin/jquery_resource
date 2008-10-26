require 'rubygems'
require 'sinatra/lib/sinatra'
require 'sequel'
require 'json'

DB = Sequel.sqlite 'authors.squlite3'
Author = DB[:authors]

def query params  
  query_params = params.inject({}) do |obj, pair|
    unless pair.first.nil?
      obj[pair.first.intern] = pair.last
    end
    obj
  end
  query_params
end

get '/authors/' do
  Author.all(query(params)).to_json
end

get '/authors/:id' do
  Author.where(:id => params[:id]).all.to_json
end
