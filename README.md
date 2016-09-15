# Installation

- Install node.js and npm
- Install gulp globally (use sudo if needed): `npm install gulp -g`
- run `npm install` to install local packages and client dependencies
- NOTE: you will need to repeat the step above if there are some changes to package.json

# Setting up the server (we need it for web application to fetch data, you do this only once)
- you need JDK 7 or 8 and Maven
- from the top-level of infinispan ($ISPN_HOME) run: `./build.sh clean package -DskipTests`
- cd $ISPN_HOME/server/integration/build/target/infinispan-server-*
- run `./bin/add-user.sh -u admin '!qazxsw2'` to create an admin user

#  Running web application
- run server by going to $ISPN_HOME/server/integration/build/target/infinispan-server-* and running `./bin/domain.sh`
- Run locally in development mode by utilising the gulp:serve task detailed below

# Gulp Tasks

### Gulp tasks
-------
Serve application in browser
```
gulp serve            # Serves application, watch *.js, reload
gulp serve --watch-ts # Serves application, watch *.ts, recompile, reload (useful without TypeScript IDE compilation)
gulp serve:dist       # Serves application from bundled dist file
```

Validate sources with specified rules defined in :
* `tslint.json` for TypeScript
* `.eslintrc` for JavaScript
```
gulp check              # check all
gulp check:eslint       # checks gulp tasks and gulpfile (only not generated js files in this repo)
gulp check:tslint       # checks TypeScript files from src/ and test/ directory
gulp check:tslint:src   # checks TypeScript files from src/ directory
gulp check:tslint:test  # checks TypeScript files from src/ directory
```

Angular Bundling
```
gulp ng:directives      # bundles directives from templateUrl to template
gulp ng:annotate        # adds ng annotate to typescript output
```

Run TypeScript compiler
```
gulp compile      # compile all
gulp compile:src  # compile *.ts files from source directory
```

Build dist folder
```
gulp build      # build all
gulp build:dist # creates self executable dist directory
```

Cleanup
```
gulp clean      # clean both src and dist folders
gulp clean:src  # removes *.map, *.js and *.css files from source directory
gulp clean:dist # removes the created dist folder
gulp clean:all  # calls clean:src and clean:dist as well as removing the node_modules and typings folders.
```