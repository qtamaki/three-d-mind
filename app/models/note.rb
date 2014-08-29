class Note < ActiveRecord::Base
  validates_presence_of :note_title
  validates_uniqueness_of :note_title, :scope => :user_id

  def published?
    self.published == 1
  end
end
