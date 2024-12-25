class CreateBlogs < ActiveRecord::Migration[7.2]
  def change
    create_table :blogs do |t|
      t.string :content
      {{t.references :user, null: false, foreign_key: true}}

      t.timestamps
    end
  end
end
