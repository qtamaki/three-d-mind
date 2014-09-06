class NotesController < ApplicationController
  skip_before_filter :authenticate_auth!, only: [:pub]
  before_action :set_note, only: [:show, :edit, :update, :destroy]

  def pub
    @note = Note.where(:id => params[:id], :published => 1, :deleted => 0).first
    @read_only = true
    render :show
  end

  # GET /notes
  def index
    @notes = Note.all.where(deleted: 0, user_id: current_user.id).page(params[:page]).per(current_user.per_page)
  end

  # GET /notes/1
  def show
  end

  # GET /notes/new
  def new
    @note = Note.new
  end

  # GET /notes/1/edit
  def edit
  end

  # POST /notes
  def create
    @note = Note.new(note_params)
    @note.user_id = current_user.id
    @note.note_contents = "{\"rootKeyword\":\"#{@note.note_title}\",\"keywords\":{\"#{@note.note_title}\":[]}}"

    if @note.save
      #redirect_to @note, notice: 'Note was successfully created.'
      redirect_to @note
    else
      render :new
    end
  end

  # PATCH/PUT /notes/1
  def update
    @note.attributes = note_params
    respond_to do |format|
      if @note.save
        format.html {redirect_to @note, notice: 'Note was successfully updated.'}
        format.json {render :text => @note.lock_version.to_s, :layout => false}
      else
        format.html {render :edit }
        format.json {render :text => 'NG', :layout => false, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /notes/1
  def destroy
    @note.deleted = 9
    @note.deleted_at = Time.now
    @note.updated_user = current_user.login
    @note.save!
    redirect_to notes_url, notice: 'Note was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_note
      @note = Note.where(:id => params[:id], :user_id => current_user.id, :deleted => 0).first
    end

    # Only allow a trusted parameter "white list" through.
    def note_params
      params.require(:note).permit(:note_title, :note_contents, :published, :lock_version)
    end
end
