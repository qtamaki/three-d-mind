json.array!(@notes) do |note|
  json.extract! note, :id, :user_id, :note_title, :note_contents
  json.url note_url(note, format: :json)
end
