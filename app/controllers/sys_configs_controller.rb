class SysConfigsController < ApplicationController
  before_action :set_sys_config, only: [:show, :edit, :update, :destroy]

  # GET /sys_configs
  def index
    @sys_configs = SysConfig.all
  end

  # GET /sys_configs/1
  def show
  end

  # GET /sys_configs/new
  def new
    @sys_config = SysConfig.new
  end

  # GET /sys_configs/1/edit
  def edit
  end

  # POST /sys_configs
  def create
    @sys_config = SysConfig.new(sys_config_params)

    if @sys_config.save
      redirect_to @sys_config, notice: 'Sys config was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /sys_configs/1
  def update
    if @sys_config.update(sys_config_params)
      redirect_to @sys_config, notice: 'Sys config was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /sys_configs/1
  def destroy
    @sys_config.destroy
    redirect_to sys_configs_url, notice: 'Sys config was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sys_config
      @sys_config = SysConfig.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def sys_config_params
      params.require(:sys_config).permit(:config_section, :config_key, :value1, :value2, :value3, :value_long, :config_description_text)
    end
end
