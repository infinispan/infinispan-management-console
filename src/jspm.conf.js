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
    "tsconfig": "tsconfig.json"
  },
  paths: {
    "app/*": "src/*",
    "github:*": "vendor/jspm_packages/github/*",
    "npm:*": "vendor/jspm_packages/npm/*"
  },
  buildCSS: true,
  separateCSS: false,

  packages: {
    "app": {
      "main": "index",
      "format": "amd",
      "defaultExtension": "js",
      "meta": {
        "*.css": {
          "loader": "css"
        }
      }
    }
  },

  map: {
    "angular": "npm:angular@1.5.11",
    "angular-animate": "npm:angular-animate@1.5.11",
    "angular-drag-and-drop-lists": "npm:angular-drag-and-drop-lists@2.0.0",
    "angular-local-storage": "npm:angular-local-storage@0.5.0",
    "angular-patternfly": "npm:angular-patternfly@4.0.0-rc.1",
    "angular-sanitize": "npm:angular-sanitize@1.5.11",
    "angular-translate": "npm:angular-translate@2.11.1",
    "angular-translate-loader-static-files": "npm:angular-translate-loader-static-files@2.11.1",
    "angular-ui-bootstrap": "npm:angular-ui-bootstrap@2.2.0",
    "angular-ui-router": "npm:angular-ui-router@0.3.1",
    "angularjs-dropdown-multiselect": "npm:angularjs-dropdown-multiselect@2.0.0-beta.10",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "bootstrap": "npm:bootstrap@3.3.7",
    "bootstrap-css": "npm:bootstrap-css@3.0.0",
    "c3": "npm:c3@0.4.11",
    "codemirror": "npm:codemirror@5.35.0",
    "core-js": "npm:core-js@1.2.7",
    "css": "npm:systemjs-plugin-css@0.1.37",
    "d3": "npm:d3@3.5.17",
    "deepmerge": "npm:deepmerge@1.3.2",
    "jquery": "npm:jquery@3.3.1",
    "patternfly": "npm:patternfly@4.0.0-rc.1",
    "ts": "npm:plugin-typescript@7.1.0",
    "typescript": "npm:typescript@2.7.2",
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.12.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-net@0.1.2": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "timers": "github:jspm/nodelibs-timers@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-timers@0.1.0": {
      "timers-browserify": "npm:timers-browserify@1.4.2"
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
    "npm:angular-datatables@0.5.6": {
      "angular": "npm:angular@1.5.11",
      "datatables.net": "npm:datatables.net@1.10.16",
      "datatables.net-dt": "npm:datatables.net-dt@1.10.16",
      "grunt-parallel": "npm:grunt-parallel@0.4.1",
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:angular-patternfly@4.0.0-rc.1": {
      "angular": "npm:angular@1.5.11",
      "angular-animate": "npm:angular-animate@1.5.11",
      "angular-datatables": "npm:angular-datatables@0.5.6",
      "angular-drag-and-drop-lists": "npm:angular-drag-and-drop-lists@2.0.0",
      "angular-sanitize": "npm:angular-sanitize@1.5.11",
      "angular-svg-base-fix": "npm:angular-svg-base-fix@2.0.0",
      "angular-ui-bootstrap": "npm:angular-ui-bootstrap@2.2.0",
      "bootstrap-select": "npm:bootstrap-select@1.10.0",
      "c3": "npm:c3@0.4.11",
      "d3": "npm:d3@3.5.17",
      "datatables.net": "npm:datatables.net@1.10.11",
      "datatables.net-select": "npm:datatables.net-select@1.2.0",
      "jquery": "npm:jquery@2.1.4",
      "lodash": "npm:lodash@4.17.4",
      "moment": "npm:moment@2.14.1",
      "patternfly": "npm:patternfly@4.0.0-rc.1"
    },
    "npm:angular-sanitize@1.5.11": {
      "angular": "npm:angular@1.5.11"
    },
    "npm:angular-svg-base-fix@2.0.0": {
      "angular": "npm:angular@1.5.11"
    },
    "npm:angular-translate-loader-static-files@2.11.1": {
      "angular-translate": "npm:angular-translate@2.11.1"
    },
    "npm:angular-translate@2.11.1": {
      "angular": "npm:angular@1.5.11",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:angular-ui-router@0.3.1": {
      "angular": "npm:angular@1.5.11",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:angularjs-dropdown-multiselect@2.0.0-beta.10": {
      "angular": "npm:angular@1.5.11",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:argparse@0.1.16": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore": "npm:underscore@1.7.0",
      "underscore.string": "npm:underscore.string@2.4.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:asn1.js@4.10.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:async@0.1.22": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-css@3.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-datepicker@1.6.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-select@1.10.0": {
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:bootstrap-switch@3.3.4": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:bootstrap@3.3.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browserify-aes@1.2.0": {
      "buffer": "npm:buffer@5.1.0",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:browserify-cipher@1.0.1": {
      "browserify-aes": "npm:browserify-aes@1.2.0",
      "browserify-des": "npm:browserify-des@1.0.1",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3"
    },
    "npm:browserify-des@1.0.1": {
      "buffer": "npm:buffer@5.1.0",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:browserify-rsa@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "npm:buffer@5.1.0",
      "constants": "npm:constants-browserify@0.0.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.6"
    },
    "npm:browserify-sign@4.0.4": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "npm:buffer@5.1.0",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0",
      "inherits": "npm:inherits@2.0.3",
      "parse-asn1": "npm:parse-asn1@5.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:buffer-from@1.1.0": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "npm:buffer@5.1.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:buffer@5.1.0": {
      "base64-js": "npm:base64-js@1.3.0",
      "ieee754": "npm:ieee754@1.1.11"
    },
    "npm:c3@0.4.11": {
      "css": "npm:systemjs-plugin-css@0.1.37",
      "d3": "npm:d3@3.5.17"
    },
    "npm:cipher-base@1.0.4": {
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:codemirror@5.35.0": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:coffee-script@1.3.3": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readline": "github:jspm/nodelibs-readline@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:colors@0.6.2": {
      "assert": "npm:assert@1.4.1"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:create-ecdh@4.0.3": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0"
    },
    "npm:create-hash@1.2.0": {
      "buffer": "npm:buffer@5.1.0",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.3",
      "md5.js": "npm:md5.js@1.3.4",
      "ripemd160": "npm:ripemd160@2.0.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:create-hmac@1.1.7": {
      "buffer": "npm:buffer@5.1.0",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.3",
      "ripemd160": "npm:ripemd160@2.0.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:crypto-browserify@3.12.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.1",
      "browserify-sign": "npm:browserify-sign@4.0.4",
      "create-ecdh": "npm:create-ecdh@4.0.3",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "diffie-hellman": "npm:diffie-hellman@5.0.3",
      "inherits": "npm:inherits@2.0.3",
      "pbkdf2": "npm:pbkdf2@3.0.16",
      "public-encrypt": "npm:public-encrypt@4.0.2",
      "randombytes": "npm:randombytes@2.0.6",
      "randomfill": "npm:randomfill@1.0.4"
    },
    "npm:datatables.net-bs@1.10.16": {
      "datatables.net": "npm:datatables.net@1.10.16",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:datatables.net-colreorder-bs@1.3.3": {
      "datatables.net-bs": "npm:datatables.net-bs@1.10.16",
      "datatables.net-colreorder": "npm:datatables.net-colreorder@1.3.3",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:datatables.net-colreorder@1.3.3": {
      "datatables.net": "npm:datatables.net@1.10.16",
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:datatables.net-dt@1.10.16": {
      "datatables.net": "npm:datatables.net@1.10.16",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:datatables.net-select@1.2.0": {
      "datatables.net": "npm:datatables.net@1.10.16",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:datatables.net@1.10.11": {
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:datatables.net@1.10.16": {
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:datatables@1.10.13": {
      "css": "npm:systemjs-plugin-css@0.1.37",
      "jquery": "npm:jquery@3.3.1"
    },
    "npm:des.js@1.0.0": {
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
    },
    "npm:diffie-hellman@5.0.3": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.1",
      "randombytes": "npm:randombytes@2.0.6",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:drmonty-datatables-colvis@1.1.2": {
      "jquery": "npm:jquery@3.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:elliptic@6.4.0": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0",
      "hash.js": "npm:hash.js@1.1.3",
      "hmac-drbg": "npm:hmac-drbg@1.0.1",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:eonasdan-bootstrap-datetimepicker@4.15.35": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "jquery": "npm:jquery@2.1.4",
      "moment": "npm:moment@2.8.4",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:esprima@1.0.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:evp_bytestokey@1.0.3": {
      "buffer": "npm:buffer@5.1.0",
      "md5.js": "npm:md5.js@1.3.4",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:exit@0.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:findup-sync@0.1.3": {
      "glob": "npm:glob@3.2.11",
      "lodash": "npm:lodash@2.4.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:font-awesome@4.6.3": {
      "css": "npm:systemjs-plugin-css@0.1.37"
    },
    "npm:glob@3.1.21": {
      "assert": "npm:assert@1.4.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "graceful-fs": "npm:graceful-fs@1.2.3",
      "inherits": "npm:inherits@1.0.2",
      "minimatch": "npm:minimatch@0.2.14",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:glob@3.2.11": {
      "assert": "npm:assert@1.4.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.3",
      "minimatch": "npm:minimatch@0.3.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:google-code-prettify@1.0.5": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:graceful-fs@1.2.3": {
      "constants": "npm:constants-browserify@0.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:grunt-legacy-log-utils@0.1.1": {
      "colors": "npm:colors@0.6.2",
      "lodash": "npm:lodash@2.4.2",
      "underscore.string": "npm:underscore.string@2.3.3"
    },
    "npm:grunt-legacy-log@0.1.3": {
      "colors": "npm:colors@0.6.2",
      "grunt-legacy-log-utils": "npm:grunt-legacy-log-utils@0.1.1",
      "hooker": "npm:hooker@0.2.3",
      "lodash": "npm:lodash@2.4.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore.string": "npm:underscore.string@2.3.3",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:grunt-legacy-util@0.2.0": {
      "async": "npm:async@0.1.22",
      "buffer": "npm:buffer@5.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "exit": "npm:exit@0.1.2",
      "getobject": "npm:getobject@0.1.0",
      "hooker": "npm:hooker@0.2.3",
      "lodash": "npm:lodash@0.9.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore.string": "npm:underscore.string@2.2.1",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "which": "npm:which@1.0.9"
    },
    "npm:grunt-parallel@0.4.1": {
      "grunt": "npm:grunt@0.4.5",
      "lpad": "npm:lpad@0.1.0",
      "q": "npm:q@0.8.12"
    },
    "npm:grunt@0.4.5": {
      "async": "npm:async@0.1.22",
      "buffer": "npm:buffer@5.1.0",
      "coffee-script": "npm:coffee-script@1.3.3",
      "colors": "npm:colors@0.6.2",
      "dateformat": "npm:dateformat@1.0.2-1.2.3",
      "eventemitter2": "npm:eventemitter2@0.4.14",
      "exit": "npm:exit@0.1.2",
      "findup-sync": "npm:findup-sync@0.1.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "getobject": "npm:getobject@0.1.0",
      "glob": "npm:glob@3.1.21",
      "grunt-legacy-log": "npm:grunt-legacy-log@0.1.3",
      "grunt-legacy-util": "npm:grunt-legacy-util@0.2.0",
      "hooker": "npm:hooker@0.2.3",
      "iconv-lite": "npm:iconv-lite@0.2.11",
      "js-yaml": "npm:js-yaml@2.0.5",
      "lodash": "npm:lodash@0.9.2",
      "minimatch": "npm:minimatch@0.2.14",
      "nopt": "npm:nopt@1.0.10",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "rimraf": "npm:rimraf@2.2.8",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "underscore.string": "npm:underscore.string@2.2.1",
      "which": "npm:which@1.0.9"
    },
    "npm:hash-base@3.0.4": {
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:hash.js@1.1.3": {
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
    },
    "npm:hmac-drbg@1.0.1": {
      "hash.js": "npm:hash.js@1.1.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:hooker@0.2.3": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:iconv-lite@0.2.11": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.3": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery-match-height@0.7.2": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:js-yaml@2.0.5": {
      "argparse": "npm:argparse@0.1.16",
      "buffer": "npm:buffer@5.1.0",
      "esprima": "npm:esprima@1.0.4",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@0.9.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash@2.4.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lpad@0.1.0": {
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:md5.js@1.3.4": {
      "buffer": "npm:buffer@5.1.0",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:miller-rabin@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0"
    },
    "npm:minimatch@0.2.14": {
      "lru-cache": "npm:lru-cache@2.7.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sigmund": "npm:sigmund@1.0.1"
    },
    "npm:minimatch@0.3.0": {
      "lru-cache": "npm:lru-cache@2.7.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sigmund": "npm:sigmund@1.0.1"
    },
    "npm:nopt@1.0.10": {
      "abbrev": "npm:abbrev@1.1.1",
      "assert": "npm:assert@1.4.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:parse-asn1@5.1.1": {
      "asn1.js": "npm:asn1.js@4.10.1",
      "browserify-aes": "npm:browserify-aes@1.2.0",
      "buffer": "npm:buffer@5.1.0",
      "create-hash": "npm:create-hash@1.2.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "pbkdf2": "npm:pbkdf2@3.0.16",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly-bootstrap-combobox@1.1.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly-bootstrap-treeview@2.1.5": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "jquery": "npm:jquery@3.3.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:patternfly@4.0.0-rc.1": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "bootstrap-datepicker": "npm:bootstrap-datepicker@1.6.4",
      "bootstrap-select": "npm:bootstrap-select@1.10.0",
      "bootstrap-switch": "npm:bootstrap-switch@3.3.4",
      "bootstrap-touchspin": "npm:bootstrap-touchspin@3.1.1",
      "c3": "npm:c3@0.4.11",
      "d3": "npm:d3@3.5.17",
      "datatables": "npm:datatables@1.10.13",
      "datatables.net-colreorder": "npm:datatables.net-colreorder@1.3.3",
      "datatables.net-colreorder-bs": "npm:datatables.net-colreorder-bs@1.3.3",
      "datatables.net-select": "npm:datatables.net-select@1.2.0",
      "drmonty-datatables-colvis": "npm:drmonty-datatables-colvis@1.1.2",
      "eonasdan-bootstrap-datetimepicker": "npm:eonasdan-bootstrap-datetimepicker@4.15.35",
      "font-awesome": "npm:font-awesome@4.6.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "google-code-prettify": "npm:google-code-prettify@1.0.5",
      "jquery": "npm:jquery@2.1.4",
      "jquery-match-height": "npm:jquery-match-height@0.7.2",
      "moment": "npm:moment@2.14.1",
      "patternfly-bootstrap-combobox": "npm:patternfly-bootstrap-combobox@1.1.7",
      "patternfly-bootstrap-treeview": "npm:patternfly-bootstrap-treeview@2.1.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:pbkdf2@3.0.16": {
      "buffer": "npm:buffer@5.1.0",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "ripemd160": "npm:ripemd160@2.0.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:process@0.11.10": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:public-encrypt@4.0.2": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "npm:buffer@5.1.0",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.1.1",
      "randombytes": "npm:randombytes@2.0.6"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:q@0.8.12": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:randombytes@2.0.6": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:randomfill@1.0.4": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "randombytes": "npm:randombytes@2.0.6",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "npm:buffer@5.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:rimraf@2.2.8": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ripemd160@2.0.2": {
      "buffer": "npm:buffer@5.1.0",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:safe-buffer@5.1.2": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:sha.js@2.4.11": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:sigmund@1.0.1": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map-support@0.5.6": {
      "buffer": "npm:buffer@5.1.0",
      "buffer-from": "npm:buffer-from@1.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.6.1"
    },
    "npm:source-map@0.6.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:timers-browserify@1.4.2": {
      "process": "npm:process@0.11.10"
    },
    "npm:typescript@2.7.2": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "source-map-support": "npm:source-map-support@0.5.6"
    },
    "npm:url@0.10.3": {
      "assert": "npm:assert@1.4.1",
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
    },
    "npm:which@1.0.9": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
