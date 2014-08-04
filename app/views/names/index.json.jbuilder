json.array!(@names) do |name|
  json.extract! name, :id, :name_locale, :name_section, :name_key, :long_name, :short_name, :other_name, :name_description
  json.url name_url(name, format: :json)
end
