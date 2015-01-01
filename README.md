# Installation

- Install node.js and npm
- Install gulp globally (use sudo if needed): `npm install gulp -g`
- run `build.sh` to instal local packages and client dependencies
- NOTE: you will need to repeat the step above if there are some changes to package.json or bower.json
- NOTE: you might want to consult Troubleshooting section of this README

# Windows specific installation

- You can download respective node.js installer here: http://nodejs.org/download/
- After installation set up user specific environment properties *NODE_PATH* and *PATH* pointing to the installation location
  - needed for running gulp from command prompt -- typically: C:\Users\You\AppData\Roaming\npm

# Setting up the server (we need it for web application to fetch data, you do this only once)
- you need JDK 7 or 8 and Maven
- from the top-level of infinispan ($ISPN_HOME) run: `./build.sh clean package -DskipTests`
- cd $ISPN_HOME/server/integration/build/target/infinispan-server-*
- run `./bin/add-user.sh -u admin '!qazxsw2'` to create an admin user

#  Running web application
- run server by going to $ISPN_HOME/server/integration/build/target/infinispan-server-* and running `./bin/domain.sh`
- Run locally in development mode by running `gulp serve` - tab in browser will automatically open.
- Run locally in production mode by running `gulp serve:dist`
- Build app for production by running `gulp build` - result will be stored to /dist/
- Run unit tests by running `gulp test`
- Run e2e tests by running `gulp protractor`
- Run e2e tests on production code by running `gulp protractor:dist`
- Run `gulp clean` to remove generated files like /dist/ and /.tmp/
- Run `gulp clear-cache` to clean gulp cache

#  Troubleshooting
- If you meet: "Cannot find where you keep your Bower packages."
  - Install bower globally (use sudo if needed): `npm install bower -g`
  - run `bower install` from application root directory, it will install dependencies into ./src/main/bower_components

- If you meet: "Error: watch ENOSPC"; try to increase number of watches:
  - `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

- If you meet: "Error: ENOENT, stat /path/to/index.html" try following clears:
  - `gulp clean` `gulp clear-cache`
  
#  Experimental 
- It is possible to communicate with Infinispan server REST endpoint using Infinispan Management Console interface
  - i.e. putting entries (key-value pairs) into particular Infinispan cache
- Because Infinispan Management Console is running on the one domail and Infinispan server on the another, 
  we have to deal with the 'same origin policy' http://en.wikipedia.org/wiki/Same-origin_policy. We will use proxy server.
  
- Requirements: 
  - Install corsproxy (npm install -g corsproxy)
  - Start it 'corsproxy' ('CORS Proxy started on 127.0.0.1:9292 if everything went ok)
  - From domain.xml Infinispan server configuration file (/server/domain/configuration) remove 
  auth-method="BASIC" security-domain="other" configuration from rest-connectior section
  - Start Infinispan server again 
     
- In Management Console navigate to (default) cache details by clicking at particular cache in cluster view
- Try to put some entries into the cache
- Entries are automatically loaded when 'cache entry key' input field text is changing
- When you erase content of 'cache entry key' input field there is basically issued a GET request to 
        http://localhost:9292/localhost:8080/rest/default which returns the whole key set stored in a cache 
  
  

