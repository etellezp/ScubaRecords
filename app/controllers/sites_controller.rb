class SitesController < ApplicationController
  before_action :find_site_by_current_user, only: [:edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]

  def index
    @sites = Site.all
    if params[:user_id] && current_user
      @sites = current_user.sites.order("created_at DESC").uniq
    elsif params[:site_name]
      @sites = Site.search(params[:site_name])
    else
      @sites = Site.all.order("created_at DESC")
    end
  end

  def show
    @site = Site.find(params[:id])
  end

  def new
    @site = Site.new
    @site.records.build
  end

  def create
    @site = Site.new(site_params)
    @site.records.each { |record| record.user = current_user }
    if @site.save
      flash[:notice] = "Site was successfully created"
      redirect_to user_site_path(current_user, @site)
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @site.update(site_params)
      flash[:notice] = "Site was successfully updated"
      redirect_to user_site_path(current_user, @site)
    else
      render 'edit'
    end
  end

  def destroy
    @site.destroy
    flash[:notice] = "Site was successfully deleted"
    redirect_to user_sites_path(current_user)
  end

  private

    def site_params
      params.require(:site).permit(:name, :location, records_attributes: [:id, :date, :dive_time, :max_depth, :water_temperature, :activity, :notes])
    end

    def find_site_by_current_user
      @site = current_user.sites.find(params[:id])
    end

end
