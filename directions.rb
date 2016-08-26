def directions_to start, finish

  start = JSON.parse(start)
  finish = JSON.parse(finish)
  mapzen_key = 'valhalla-jpxNgJ'
  sleep 0.1

  return '' if start == ['','']

  request = "http://valhalla.mapzen.com/route?json={%22locations%22:[{%22lat%22:#{start[0]},%22lon%22:#{start[1]}},{%22lat%22:#{finish[0]},%22lon%22:#{finish[1]}}],%22costing%22:%22pedestrian%22}&api_key=#{mapzen_key}"
  response = Net::HTTP.get(URI.parse(request))

  begin
    Polylines::Decoder.decode_polyline(JSON.parse(response)['trip']['legs'][0]['shape']).map do |coordinates|
      [coordinates[0] / 10.0, coordinates[1] / 10.0]
    end.to_json
  rescue
    binding.pry
    ''
  end
end