# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 0) do

  create_table "names", force: true do |t|
    t.integer  "owner_id",         limit: 8
    t.string   "name_locale",      limit: 40,              null: false
    t.string   "name_section",     limit: 40,              null: false
    t.string   "name_key",         limit: 40,              null: false
    t.string   "long_name",        limit: 100,             null: false
    t.string   "short_name",       limit: 100
    t.string   "other_name",       limit: 100
    t.string   "name_description"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "lock_version",     limit: 8,   default: 0
    t.string   "created_user",     limit: 80
    t.string   "updated_user",     limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                      default: 0
  end

  add_index "names", ["id"], name: "id", unique: true, using: :btree
  add_index "names", ["owner_id", "name_locale", "name_section", "name_key"], name: "idx_names_1", unique: true, using: :btree

  create_table "notes", force: true do |t|
    t.integer  "owner_id",      limit: 8
    t.integer  "user_id",       limit: 8,              null: false
    t.string   "note_title",                           null: false
    t.text     "note_contents",                        null: false
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.integer  "lock_version",  limit: 8,  default: 0
    t.string   "created_user",  limit: 80
    t.string   "updated_user",  limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                  default: 0
  end

  add_index "notes", ["id"], name: "id", unique: true, using: :btree

  create_table "owners", force: true do |t|
    t.integer  "union_user_id",        limit: 8,              null: false
    t.string   "union_user_login",     limit: 80,             null: false
    t.string   "union_email",          limit: 60,             null: false
    t.string   "init_password",        limit: 40,             null: false
    t.string   "init_password_salt",   limit: 40,             null: false
    t.string   "owner_fullname",       limit: 80,             null: false
    t.string   "owner_shortname",      limit: 80
    t.integer  "user_max_count",                  default: 0
    t.integer  "available_user_count",            default: 0
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.integer  "lock_version",         limit: 8,  default: 0
    t.string   "created_user",         limit: 80
    t.string   "updated_user",         limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                         default: 0
  end

  add_index "owners", ["id"], name: "id", unique: true, using: :btree

  create_table "sys_configs", force: true do |t|
    t.integer  "owner_id",                limit: 8
    t.string   "config_section",          limit: 40,             null: false
    t.string   "config_key",              limit: 40,             null: false
    t.string   "value1"
    t.string   "value2"
    t.string   "value3"
    t.text     "value_long"
    t.text     "config_description_text"
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.integer  "lock_version",            limit: 8,  default: 0
    t.string   "created_user",            limit: 80
    t.string   "updated_user",            limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                            default: 0
  end

  add_index "sys_configs", ["id"], name: "id", unique: true, using: :btree
  add_index "sys_configs", ["owner_id", "config_section", "config_key"], name: "idx_sys_configs_3", unique: true, using: :btree

  create_table "types", force: true do |t|
    t.integer  "owner_id",              limit: 8
    t.string   "type_section",          limit: 40,              null: false
    t.string   "type_key",              limit: 40,              null: false
    t.string   "long_name",             limit: 100,             null: false
    t.string   "short_name",            limit: 100
    t.string   "other_name",            limit: 100
    t.string   "type_description"
    t.text     "type_description_text"
    t.integer  "display_order1"
    t.integer  "display_order2"
    t.string   "logic_bind_type",       limit: 40,              null: false
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.integer  "lock_version",          limit: 8,   default: 0
    t.string   "created_user",          limit: 80
    t.string   "updated_user",          limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                           default: 0
  end

  add_index "types", ["id"], name: "id", unique: true, using: :btree
  add_index "types", ["owner_id", "type_section", "type_key"], name: "idx_types_2", unique: true, using: :btree

  create_table "users", force: true do |t|
    t.integer  "owner_id",               limit: 8
    t.string   "login",                                         null: false
    t.string   "fullname"
    t.string   "shortname"
    t.string   "nickname",                                      null: false
    t.string   "access_level_type",      limit: 40,             null: false
    t.integer  "per_page",                          default: 0
    t.string   "email",                                         null: false
    t.string   "encrypted_password",                            null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                     default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",                   default: 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "authentication_token"
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.integer  "lock_version",           limit: 8,  default: 0
    t.string   "created_user",           limit: 80
    t.string   "updated_user",           limit: 80
    t.datetime "deleted_at"
    t.integer  "deleted",                           default: 0
  end

  add_index "users", ["id"], name: "id", unique: true, using: :btree
  add_index "users", ["owner_id", "confirmation_token"], name: "idx_users_7", using: :btree
  add_index "users", ["owner_id", "email"], name: "idx_users_5", unique: true, using: :btree
  add_index "users", ["owner_id", "login"], name: "idx_users_4", unique: true, using: :btree
  add_index "users", ["owner_id", "reset_password_token"], name: "idx_users_6", using: :btree
  add_index "users", ["owner_id", "unlock_token"], name: "idx_users_8", using: :btree

end
