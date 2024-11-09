Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  scope :api do
    resources :blogs, only: [:index, :create]
  end
end
