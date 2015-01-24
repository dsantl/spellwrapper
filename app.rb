require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/json'
require 'slim'
require 'pry'
require 'base64'

class SpellWrapper < Sinatra::Base
  helpers Sinatra::JSON

  configure :development do
    register Sinatra::Reloader
  end

  get '/' do
    slim :index
  end

  post '/check' do
    tmp_path = settings.root + '/tmp'
    Dir.mkdir(tmp_path) unless Dir.exist?(tmp_path)
    file_path = Tempfile.new(['temp', '.txt'], tmp_path).path
    if params[:file]
      data = params[:file][:data]
      data_index = data.index('base64') + 7
      filedata = data.slice(data_index, data.length)
      decoded_file = Base64.decode64(filedata)
      File.write(file_path, decoded_file)
    else
      File.write(file_path, params['text'])
    end
    @output = check(file_path)
    json result: @output
  end

  private
    def check(file)
      ENV['LC_CTYPE']='en_US.UTF-8'
      # `detex #{file} | scripts/splitter.py | scripts/requester.py | scripts/joiner.py | scripts/checker.py #{file}`
      'Danas je ERROR{ljep}{lijep} dan ajme ERROR{mljeko}{mlijeko,mljelo,mljeo}

       ho cu'
    end

  run if app_file == $0
end

