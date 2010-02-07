set :application, "fonteye"
set :repository,  "git@github.com:hipe/fonteye.git"

default_run_options[:pty] = true
set :scm, "git"
set :scm_username, "hipe"
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`
# set :scm_passphrase, "p@ssw0rd" #This is your custom users password

set :user, "deployer"
set :deploy_to, "/var/sites/fonteye"
role :web, "deployer@173.203.203.77"              # Your HTTP server, Apache/etc
role :app, "deployer@173.203.203.77"              # This may be the same as your `Web` server
# role :db,  "hipe.is-a-geek.org", :primary => true # This is where Rails migrations will run
# role :db,  "hipe.is-a-geek.org"             # slave db server
# set :use_sudo, false

set :branch, "master"
set :deploy_via, :remote_cache
set :git_enable_submodules, 1

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end