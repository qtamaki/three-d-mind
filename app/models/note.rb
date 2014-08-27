class Note < ActiveRecord::Base
  validates_presence_of :note_title
  validates_uniqueness_of :note_title
end
