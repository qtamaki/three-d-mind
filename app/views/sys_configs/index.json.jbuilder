json.array!(@sys_configs) do |sys_config|
  json.extract! sys_config, :id, :config_section, :config_key, :value1, :value2, :value3, :value_long, :config_description_text
  json.url sys_config_url(sys_config, format: :json)
end
