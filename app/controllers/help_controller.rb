class HelpController < ApplicationController
  skip_before_filter :authenticate_auth!, only: [:index]
  def index
  end
end
