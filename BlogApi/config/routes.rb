Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations: 'auth/registrations'
  }
  scope :api do
    resources :blogs, only: [:index, :create]
  end
end
