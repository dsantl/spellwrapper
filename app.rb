require 'sinatra/base'
require 'sinatra/reloader'
require 'slim'
require 'pry'

class SpellWrapper < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  get '/' do
    slim :index
  end

  post '/check' do
    File.write('temp.txt', params['text'])
    @output = check
    slim :index
  end

  private
    def check
      `delatex temp.txt | scripts/splitter.py | scripts/requester.py | scripts/joiner.py | scripts/checker.py temp.txt`
    end

  run if app_file == $0
end

