class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable
  before_save :create_login

  validates_presence_of :nickname

  def create_login
    self.login = self.email
    self.access_level_type = 'normal' if access_level_type.blank?
  end

#  def self.find_for_database_authentication(conditions)
#    self.where(:login => conditions[:email]).first || self.where(:email => conditions[:email]).first
#  end

end
