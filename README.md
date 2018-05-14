# Bazaar website

Code for the [Bazaar](https://shareonbazaar.eu) website.

To run:

* Make sure you have [MongoDB](https://docs.mongodb.com/manual/installation/) installed locally
* Run `mongod` in the terminal to start the database server
* Install packages: `npm install`
* Get the `.env` file from @rmacqueen so you have the right API and Access keys
* Run `npm run-script build:migrate` to populate the database with some skills
* Run `npm start` - by default it will run in the 'development' environment
* Open browser to http://localhost:8080 (Note: There will also be a server running at http://localhost:3000, however this is only the backend server and does not feature hot reloading of modules. So make sure you are using the 8080 port)


If problems with deployment, check the hooks in elasticbeanstalk. Might need to remove problematic ones, e.g:
`sudo rm -f /opt/elasticbeanstalk/hooks/appdeploy/enact/41_remove_eb_nginx_confg.sh`