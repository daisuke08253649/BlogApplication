class BlogsController < ApplicationController
  before_action :authenticate_user!

  def index
    @blogs = Blog.includes(:user).order(created_at: :desc)
    render json: @blogs, include: :user
  end

  def create
    blog = Blog.new(blog_params)
    blog.user = current_user
    if blog.save
      render json: @blog, status: :created
    else
      render json: @blog.errors, status: :unprocessable_entity
    end
  end

  private

  def blog_params
    params.require(:blog).permit(:content)
  end
end
