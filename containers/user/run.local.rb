#!/usr/bin/env ruby

require 'rubygems'
require 'capybara'
require 'capybara/apparition'
require_relative './user.rb'

$stdout.sync = true

Capybara.run_server = false
Capybara.register_driver :apparition do |app|
  opts = {
    js_errors: false,
    headless: false,
    browser_options: [
      :no_sandbox,
      { disable_features: 'VizDisplayCompositor' },
      :disable_gpu,
    ]
  }
  Capybara::Apparition::Driver.new(app, opts)
end
Capybara.current_driver = :apparition
Capybara.app_host = "https://" + ENV["CLIENT_URL"]


t = User::RegularUser.new
t.run