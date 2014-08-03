module ApplicationHelper
  def get_background_color
    if ENV['RAILS_ENV'] == 'development'
      style = 'background-image: -moz-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(paleturquoise), to(paleturquoise));'
      style += 'background-image: -webkit-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: -o-linear-gradient(top, paleturquoise, paleturquoise);'
      style += 'background-image: linear-gradient(to bottom, paleturquoise, paleturquoise);'
    else
      ''
    end
  end

  def popup?
  end

  def logged_in?
    auth_signed_in?
  end

  def current_user
    current_auth
  end

end
