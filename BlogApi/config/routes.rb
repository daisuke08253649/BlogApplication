Rails.application.routes.draw do
  scope :api do
    resources :blogs, only: [:index, :create]
  end
end
