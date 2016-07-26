def directions_to address

  csv_url = 'https://data.ny.gov/api/views/axi5-gnss/rows.csv?accessType=DOWNLOAD'
  mapzen_key = 'valhalla-ScXGhpE'
  finish = geocode address

  bar_locations = CSV.new(open(csv_url), :headers => :first_row).map do |row|
    [row['Latitude'], row['Longitude']]
  end

  paths = bar_locations.map do |bar_location|
    start = [bar_location.first, bar_location.last]
    sleep 0.1
    request = "http://valhalla.mapzen.com/route?json={%22locations%22:[{%22lat%22:#{start[0]},%22lon%22:#{start[1]}},{%22lat%22:#{finish[0]},%22lon%22:#{finish[1]}}],%22costing%22:%22pedestrian%22}&api_key=#{mapzen_key}"
    response = Net::HTTP.get(URI.parse(request))
    begin
      print '.'
      JSON.parse(response)['trip']['legs'][0]['shape']
    rescue
      next
    end
  end.compact
end

def geocode address
  search_key = 'search-xSMLVr7'
  base = "https://search.mapzen.com/v1/search?api_key=#{search_key}&text=#{address}"
  response = Net::HTTP.get(URI.parse(base))
  coords = JSON.parse(response)['features'].first['geometry']['coordinates'].reverse
end