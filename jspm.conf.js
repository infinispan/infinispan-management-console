System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  typescriptOptions: {
    "tsconfig": "src/main/webapp/tsconfig.json"
  },
  paths: {
    "github:*": "vendor/jspm_packages/github/*",
    "npm:*": "vendor/jspm_packages/npm/*",
    "app/*": "src/main/webapp/*"
  },

  packages: {
    "app": {
      "main": "index",
      "format": "amd",
      "defaultExtension": "js"
    }
  },

  map: {
    "angular": "github:angular/bower-angular@1.5.8",
    "angular-local-storage": "npm:angular-local-storage@0.2.7",
    "angular-translate": "github:angular-translate/bower-angular-translate@2.11.1",
    "angular-ui-bootstrap": "npm:angular-ui-bootstrap@0.14.0",
    "angular-ui-router": "github:angular-ui/angular-ui-router-bower@0.3.1",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "bootstrap": "github:twbs/bootstrap@3.3.7",
    "core-js": "npm:core-js@1.2.7",
    "http-proxy": "npm:http-proxy@1.14.0",
    "jquery": "npm:jquery@3.1.0",
    "jquery-match-height": "npm:jquery-match-height@0.7.0",
    "patternfly": "npm:patternfly@3.8.1",
    "typescript": "npm:typescript@1.8.10",
    "github:angular-translate/bower-angular-translate@2.11.1": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular-ui/angular-ui-router-bower@0.3.1": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.8"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:twbs/bootstrap@3.3.7": {
      "jquery": "npm:jquery@2.1.4"
    },
    "npm:angular-ui-bootstrap@0.14.0": {
      "angular": "npm:angular@1.5.8"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-datepicker@1.6.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "jquery": "npm:jquery@3.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-select@1.10.0": {
      "jquery": "npm:jquery@3.1.0"
    },
    "npm:bootstrap-switch@3.3.2": {
      "jquery": "npm:jquery@3.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap@3.3.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:c3@0.4.11": {
      "d3": "npm:d3@3.5.17",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:datatables.net-colreorder@1.3.2": {
      "datatables.net": "npm:datatables.net@1.10.12",
      "jquery": "npm:jquery@3.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:datatables.net@1.10.12": {
      "jquery": "npm:jquery@3.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:datatables@1.10.12": {
      "css": "github:systemjs/plugin-css@0.1.26",
      "jquery": "npm:jquery@3.1.0"
    },
    "npm:drmonty-datatables-colvis@1.1.2": {
      "jquery": "npm:jquery@3.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:eonasdan-bootstrap-datetimepicker@4.15.35": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "jquery": "npm:jquery@2.1.4",
      "moment": "npm:moment@2.8.4",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:font-awesome@4.6.3": {
      "css": "github:systemjs/plugin-css@0.1.26"
    },
    "npm:google-code-prettify@1.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:http-proxy@1.14.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "eventemitter3": "npm:eventemitter3@1.2.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "requires-port": "npm:requires-port@1.0.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:jquery-match-height@0.7.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery@3.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly-bootstrap-combobox@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly-bootstrap-treeview@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly@3.8.1": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "bootstrap-datepicker": "npm:bootstrap-datepicker@1.6.4",
      "bootstrap-select": "npm:bootstrap-select@1.10.0",
      "bootstrap-switch": "npm:bootstrap-switch@3.3.2",
      "bootstrap-touchspin": "npm:bootstrap-touchspin@3.1.1",
      "c3": "npm:c3@0.4.11",
      "datatables": "npm:datatables@1.10.12",
      "datatables.net-colreorder": "npm:datatables.net-colreorder@1.3.2",
      "drmonty-datatables-colvis": "npm:drmonty-datatables-colvis@1.1.2",
      "eonasdan-bootstrap-datetimepicker": "npm:eonasdan-bootstrap-datetimepicker@4.15.35",
      "font-awesome": "npm:font-awesome@4.6.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "google-code-prettify": "npm:google-code-prettify@1.0.5",
      "jquery": "npm:jquery@2.1.4",
      "jquery-match-height": "npm:jquery-match-height@0.7.0",
      "moment": "npm:moment@2.14.1",
      "patternfly-bootstrap-combobox": "npm:patternfly-bootstrap-combobox@1.0.0",
      "patternfly-bootstrap-treeview": "npm:patternfly-bootstrap-treeview@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:process@0.11.8": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:typescript@1.8.10": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
