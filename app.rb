require 'sinatra'
require 'open-uri'
require 'csv'
require 'net/http'
require 'json'
require_relative 'directions.rb'

class Shame < Sinatra::Base

  set :run, true
  set :server, 'webrick'

  get '/' do
    erb :map
  end

  get '/directions' do
    directions_to(params[:address]).to_json
  end

  seconds_in_three_minutes = 4 * 60
  three_minutes = "#{seconds_in_three_minutes}s"

  keep_alive = Rufus::Scheduler.new
  keep_alive.every three_minutes, :first_in => 0.1 do
    p Net::HTTP.get(URI.parse(URI.encode("https://walk-of-shame.herokuapp.com/")))
    p Time.now.inspect
  end

  run! if app_file == $0
end