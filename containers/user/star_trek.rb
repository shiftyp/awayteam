require 'json'

module StarTrek

  def self.ranks
    [
      'Petty Officer',
      'Ensign',
      'Lieutenant Junior Grade',
      'Lieutenant',
      'Lieutenant Commander',
      'Commander',
      'Captain',
      'Admiral',
    ]
  end
  
  def self.rand_rank
    ranks.sample
  end

  class Lines
    def initialize
      @lines = []
      json = File.read(__dir__ + '/data/star_trek.all_series_lines.json')
      obj = JSON.parse(json)
      
      obj.each_key do |series|
        obj[series].each_key do |episode|
          obj[series][episode].each_key do |character|
            @lines.concat obj[series][episode][character].map { |line|
              line.gsub(/\n/, ' ')
            }
          end
        end
      end
    end

    def rand_line
      @lines.sample
    end
  end
end