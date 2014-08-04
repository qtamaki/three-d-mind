json.array!(@types) do |type|
  json.extract! type, :id, :type_section, :type_key, :long_name, :short_name, :other_name, :type_description, :type_description_text, :display_order1, :display_order2, :logic_bind_type
  json.url type_url(type, format: :json)
end
