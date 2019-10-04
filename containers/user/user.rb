require 'capybara/dsl'
require 'faker'
require_relative './star_trek.rb'

module User
  class RegularUser
    include Capybara::DSL

    def initialize
      super
      @emojisEnabled = false
      @lines = StarTrek::Lines.new
    end

    def emojis?
      if @emojisEnabled and rand() < 0.1 then
        ret = ' '
        0.step(rand(1..5)) do |num|
          ret += rand(0x1F601..0x1F64F).chr('UTF-8')
        end
        ret
      else
        ''
      end
    end

    def run
      visit('/')

      username = StarTrek::rand_rank + " " + Faker::TvShows::StarTrek.character
      tries = 0
      loop do
        if tries < 10
          begin
            page.find('[name="set-user"]').send_keys(username)
            page.find('[name="submit-user"]').click()
            break
          rescue Capybara::ElementNotFound
            puts "Couldn't find user element. Sleeping"
            sleep 1
            tries += 1
            next
          end
        else
          puts "Tried #{tries} times to find user element, refreshing"
          run
        end
      end

      0.step(rand(1..10)) do |num|
        line = @lines.rand_line + emojis?
        page.find('[name="set-message"]').send_keys(line)
        page.find('[name="submit-message"]').click()
        puts num.to_s + ": " + line
        sleep(rand(2..10))
      end

      run
    end
  end
end