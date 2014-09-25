class ApplicationController < ActionController::Base
  before_filter :authenticate_auth!
  before_action :configure_permitted_parameters, if: :devise_controller?
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_locale  

  def set_locale
    I18n.locale = request.env['HTTP_ACCEPT_LANGUAGE'].split(",").first  
  end

  protected

  def current_user
    current_auth
  end

  def logged_in?
    auth_signed_in?
  end


  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :nickname
    devise_parameter_sanitizer.for(:account_update) << :nickname
  end
end
