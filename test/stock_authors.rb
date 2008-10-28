require 'rubygems'
require 'sequel'
require 'faker'
require 'random_data'

DB = Sequel.sqlite 'authors.squlite3'

DB.create_table :authors do
  primary_key :id
  string :first_name
  string :last_name
  string :street_address
  string :city
  string :state
  string :zip
  string :email
  string :company
  string :phone_number
  date :birthday
end

Author = DB[:authors]

1001.times do |n|
 puts "#{n} authors" if (n % 100) == 0
 Author << {
  :first_name => Faker::Name.first_name,
  :last_name  => Faker::Name.last_name,
  :street_address => Faker::Address.street_address,
  :city => Faker::Address.city,
  :state => Faker::Address.us_state,
  :zip => Faker::Address.zip_code,
  :email => Faker::Internet.email,
  :company => Faker::Company.name,
  :phone_number => Faker::PhoneNumber.phone_number,
  :birthday => Random.date.to_s
 }
end
