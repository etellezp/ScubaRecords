class SitesController < ApplicationController
  before_action :find_site_by_current_user, only: [:edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show, :next]

  def index
    @sites = Site.all
    if params[:site_name]
      @sites = Site.search(params[:site_name]).order("created_at DESC")
    else
      @sites = Site.all.order("created_at DESC")
      respond_to do |f|
        f.html
        f.json {render json: @sites}
      end
    end
  end

  def show
    @site = Site.find(params[:id])
    respond_to do |f|
      f.html
      f.json { render json: @site }
    end
  end

  def next
    @site = Site.find(params[:id])
    @next_site = @site.next
    render json: @next_site
  end

  def new
    @site = current_user.sites.build
    @site.records.build
    render :partial => 'sites/form', :layout => false
  end

  def create
    @site = current_user.sites.build(site_params)
    @site.records.each { |record| record.user = current_user }
    if @site.save
      flash[:notice] = "Site was successfully created"
      respond_to do |f|
        f.html {redirect_to user_site_path(current_user, @site)}
        f.json {render json: @site}
      end
    else
      render 'new'
    end
  end

  def edit
    unless current_user.id == @site.user_id
      flash[:notice] = "You do not have access to edit this site"
      redirect_to user_site_path(current_user, @site)
    end
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
