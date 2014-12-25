# Installation

- Install node.js and npm
- Install gulp globally (use sudo if needed): `npm install gulp -g`
- run `build.sh` to instal local packages and client dependencies
- NOTE: you will need to repeat the step above if there are some changes to package.json or bower.json
- NOTE: you might want to consult Troubleshooting section of this README

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

