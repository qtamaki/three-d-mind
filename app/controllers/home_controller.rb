class HomeController < ApplicationController
  skip_before_filter :authenticate_auth!, only: [:index]
  def index
    if logged_in?
      redirect_to :controller => :notes
    else
      redirect_to new_auth_session_path
    end
  end
end
