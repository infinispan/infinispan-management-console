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
    "browser-sync": "npm:browser-sync@2.18.3",
    "c3": "npm:c3@0.4.11",
    "codemirror": "npm:codemirror@5.35.0",
    "core-js": "npm:core-js@1.2.7",
    "css": "npm:systemjs-plugin-css@0.1.37",
    "d3": "npm:d3@3.5.17",
    "deepmerge": "npm:deepmerge@1.3.2",
    "http-proxy": "npm:http-proxy@1.17.0",
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
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
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
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
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
    "github:jspm/nodelibs-tty@0.1.0": {
      "tty-browserify": "npm:tty-browserify@0.0.0"
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
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:accepts@1.3.1": {
      "mime-types": "npm:mime-types@2.1.18",
      "negotiator": "npm:negotiator@0.6.0"
    },
    "npm:accepts@1.3.5": {
      "mime-types": "npm:mime-types@2.1.18",
      "negotiator": "npm:negotiator@0.6.1"
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
    "npm:anymatch@1.3.2": {
      "micromatch": "npm:micromatch@2.3.11",
      "normalize-path": "npm:normalize-path@2.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:are-we-there-yet@1.1.5": {
      "delegates": "npm:delegates@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "readable-stream": "npm:readable-stream@2.3.6",
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
    "npm:arr-diff@2.0.0": {
      "arr-flatten": "npm:arr-flatten@1.1.0"
    },
    "npm:asn1.js@4.10.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:asn1@0.2.3": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "sys": "github:jspm/nodelibs-util@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert-plus@0.2.0": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert-plus@1.0.0": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
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
    "npm:async@1.5.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:asynckit@0.4.0": {
      "assert": "npm:assert@1.4.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:aws-sign2@0.6.0": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:aws4@1.7.0": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:base64id@0.1.0": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:batch@0.5.3": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bcrypt-pbkdf@1.0.1": {
      "tweetnacl": "npm:tweetnacl@0.14.5"
    },
    "npm:better-assert@1.0.2": {
      "assert": "npm:assert@1.4.1",
      "callsite": "npm:callsite@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:binary-extensions@1.11.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:bindings@1.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:boom@2.10.1": {
      "hoek": "npm:hoek@2.16.3",
      "http": "github:jspm/nodelibs-http@1.7.1"
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
    "npm:brace-expansion@1.1.11": {
      "balanced-match": "npm:balanced-match@1.0.0",
      "concat-map": "npm:concat-map@0.0.1"
    },
    "npm:braces@1.8.5": {
      "expand-range": "npm:expand-range@1.8.2",
      "preserve": "npm:preserve@0.2.0",
      "repeat-element": "npm:repeat-element@1.1.2"
    },
    "npm:browser-sync-client@2.5.1": {
      "buffer": "npm:buffer@5.1.0",
      "etag": "npm:etag@1.7.0",
      "fresh": "npm:fresh@0.3.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:browser-sync-ui@0.6.2": {
      "async-each-series": "npm:async-each-series@0.1.1",
      "buffer": "npm:buffer@5.1.0",
      "connect-history-api-fallback": "npm:connect-history-api-fallback@1.5.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "immutable": "npm:immutable@3.8.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "server-destroy": "npm:server-destroy@1.0.1",
      "stream-throttle": "npm:stream-throttle@0.1.3",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "weinre": "npm:weinre@2.0.0-pre-I0Z7U9OV",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:browser-sync@2.18.3": {
      "browser-sync-client": "npm:browser-sync-client@2.5.1",
      "browser-sync-ui": "npm:browser-sync-ui@0.6.2",
      "bs-recipes": "npm:bs-recipes@1.3.2",
      "buffer": "npm:buffer@5.1.0",
      "chokidar": "npm:chokidar@1.6.1",
      "connect": "npm:connect@3.5.0",
      "dev-ip": "npm:dev-ip@1.0.1",
      "dns": "github:jspm/nodelibs-dns@0.1.0",
      "easy-extender": "npm:easy-extender@2.3.2",
      "eazy-logger": "npm:eazy-logger@3.0.2",
      "emitter-steward": "npm:emitter-steward@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "fs-extra": "npm:fs-extra@1.0.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "http-proxy": "npm:http-proxy@1.15.2",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "immutable": "npm:immutable@3.8.1",
      "localtunnel": "npm:localtunnel@1.8.2",
      "micromatch": "npm:micromatch@2.3.11",
      "opn": "npm:opn@4.0.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "portscanner": "npm:portscanner@1.2.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "qs": "npm:qs@6.2.1",
      "resp-modifier": "npm:resp-modifier@6.0.2",
      "rx": "npm:rx@4.1.0",
      "serve-index": "npm:serve-index@1.8.0",
      "serve-static": "npm:serve-static@1.11.1",
      "server-destroy": "npm:server-destroy@1.0.1",
      "socket.io": "npm:socket.io@1.6.0",
      "socket.io-client": "npm:socket.io-client@1.6.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "ua-parser-js": "npm:ua-parser-js@0.7.12",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "yargs": "npm:yargs@6.4.0"
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
    "npm:browserify-zlib@0.1.4": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "pako": "npm:pako@0.2.9",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.3.6",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:bs-recipes@1.3.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
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
    "npm:bufferutil@1.2.1": {
      "bindings": "npm:bindings@1.2.1",
      "nan": "npm:nan@2.10.0"
    },
    "npm:builtin-modules@1.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:c3@0.4.11": {
      "css": "npm:systemjs-plugin-css@0.1.37",
      "d3": "npm:d3@3.5.17"
    },
    "npm:caseless@0.11.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:chalk@1.1.3": {
      "ansi-styles": "npm:ansi-styles@2.2.1",
      "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
      "has-ansi": "npm:has-ansi@2.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "supports-color": "npm:supports-color@2.0.0"
    },
    "npm:chokidar@1.6.1": {
      "anymatch": "npm:anymatch@1.3.2",
      "async-each": "npm:async-each@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "fsevents": "npm:fsevents@1.2.4",
      "glob-parent": "npm:glob-parent@2.0.0",
      "inherits": "npm:inherits@2.0.3",
      "is-binary-path": "npm:is-binary-path@1.0.1",
      "is-glob": "npm:is-glob@2.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-is-absolute": "npm:path-is-absolute@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readdirp": "npm:readdirp@2.1.0"
    },
    "npm:chownr@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:cipher-base@1.0.4": {
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:cliui@3.2.0": {
      "string-width": "npm:string-width@1.0.2",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "wrap-ansi": "npm:wrap-ansi@2.1.0"
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
    "npm:combined-stream@1.0.6": {
      "buffer": "npm:buffer@5.1.0",
      "delayed-stream": "npm:delayed-stream@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.15.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:connect-history-api-fallback@1.5.0": {
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:connect@1.9.2": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "formidable": "npm:formidable@1.0.16",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "mime": "npm:mime@1.3.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "qs": "npm:qs@6.3.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:connect@3.5.0": {
      "debug": "npm:debug@2.2.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "finalhandler": "npm:finalhandler@0.5.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "parseurl": "npm:parseurl@1.3.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "utils-merge": "npm:utils-merge@1.0.0"
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
    "npm:cryptiles@2.0.5": {
      "boom": "npm:boom@2.10.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
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
    "npm:dashdash@1.14.1": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
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
    "npm:debug@2.2.0": {
      "ms": "npm:ms@0.7.1"
    },
    "npm:debug@2.3.3": {
      "ms": "npm:ms@0.7.2"
    },
    "npm:debug@3.1.0": {
      "ms": "npm:ms@2.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:deep-extend@0.6.0": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:delayed-stream@1.0.0": {
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:depd@1.1.2": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:des.js@1.0.0": {
      "buffer": "npm:buffer@5.1.0",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
    },
    "npm:destroy@1.0.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:detect-libc@1.0.3": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:easy-extender@2.3.2": {
      "lodash": "npm:lodash@3.10.1"
    },
    "npm:eazy-logger@3.0.2": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tfunk": "npm:tfunk@3.1.0"
    },
    "npm:ecc-jsbn@0.1.1": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "jsbn": "npm:jsbn@0.1.1"
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
    "npm:engine.io-client@1.8.0": {
      "buffer": "npm:buffer@5.1.0",
      "component-emitter": "npm:component-emitter@1.2.1",
      "component-inherit": "npm:component-inherit@0.0.3",
      "debug": "npm:debug@2.3.3",
      "engine.io-parser": "npm:engine.io-parser@1.3.1",
      "has-cors": "npm:has-cors@1.1.0",
      "indexof": "npm:indexof@0.0.1",
      "parsejson": "npm:parsejson@0.0.3",
      "parseqs": "npm:parseqs@0.0.5",
      "parseuri": "npm:parseuri@0.0.5",
      "yeast": "npm:yeast@0.1.2"
    },
    "npm:engine.io-parser@1.2.4": {
      "after": "npm:after@0.8.1",
      "arraybuffer.slice": "npm:arraybuffer.slice@0.0.6",
      "base64-arraybuffer": "npm:base64-arraybuffer@0.1.2",
      "blob": "npm:blob@0.0.4",
      "buffer": "npm:buffer@5.1.0",
      "has-binary": "npm:has-binary@0.1.6",
      "utf8": "npm:utf8@2.1.0"
    },
    "npm:engine.io-parser@1.3.1": {
      "after": "npm:after@0.8.1",
      "arraybuffer.slice": "npm:arraybuffer.slice@0.0.6",
      "base64-arraybuffer": "npm:base64-arraybuffer@0.1.5",
      "blob": "npm:blob@0.0.4",
      "buffer": "npm:buffer@5.1.0",
      "has-binary": "npm:has-binary@0.1.6",
      "wtf-8": "npm:wtf-8@1.0.0"
    },
    "npm:engine.io@1.8.0": {
      "accepts": "npm:accepts@1.3.1",
      "base64id": "npm:base64id@0.1.0",
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@2.2.0",
      "engine.io-parser": "npm:engine.io-parser@1.2.4",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "ws": "npm:ws@1.0.1",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:eonasdan-bootstrap-datetimepicker@4.15.35": {
      "bootstrap": "npm:bootstrap@3.3.7",
      "jquery": "npm:jquery@2.1.4",
      "moment": "npm:moment@2.8.4",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:error-ex@1.3.1": {
      "is-arrayish": "npm:is-arrayish@0.2.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:esprima@1.0.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:etag@1.7.0": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:evp_bytestokey@1.0.3": {
      "buffer": "npm:buffer@5.1.0",
      "md5.js": "npm:md5.js@1.3.4",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:exit@0.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:expand-brackets@0.1.5": {
      "is-posix-bracket": "npm:is-posix-bracket@0.1.1"
    },
    "npm:expand-range@1.8.2": {
      "fill-range": "npm:fill-range@2.2.4"
    },
    "npm:express@2.5.11": {
      "buffer": "npm:buffer@5.1.0",
      "connect": "npm:connect@1.9.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "mime": "npm:mime@1.2.4",
      "mkdirp": "npm:mkdirp@0.3.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "qs": "npm:qs@0.4.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:extglob@0.3.2": {
      "is-extglob": "npm:is-extglob@1.0.0"
    },
    "npm:extsprintf@1.3.0": {
      "assert": "npm:assert@1.4.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:fill-range@2.2.4": {
      "is-number": "npm:is-number@2.1.0",
      "isobject": "npm:isobject@2.1.0",
      "randomatic": "npm:randomatic@3.0.0",
      "repeat-element": "npm:repeat-element@1.1.2",
      "repeat-string": "npm:repeat-string@1.6.1"
    },
    "npm:finalhandler@0.5.0": {
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@2.2.0",
      "escape-html": "npm:escape-html@1.0.3",
      "on-finished": "npm:on-finished@2.3.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "statuses": "npm:statuses@1.3.1",
      "unpipe": "npm:unpipe@1.0.0"
    },
    "npm:find-up@1.1.2": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-exists": "npm:path-exists@2.1.0",
      "pinkie-promise": "npm:pinkie-promise@2.0.1"
    },
    "npm:findup-sync@0.1.3": {
      "glob": "npm:glob@3.2.11",
      "lodash": "npm:lodash@2.4.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:follow-redirects@1.5.0": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@3.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:font-awesome@4.6.3": {
      "css": "npm:systemjs-plugin-css@0.1.37"
    },
    "npm:for-own@0.1.5": {
      "for-in": "npm:for-in@1.0.2"
    },
    "npm:forever-agent@0.6.1": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:form-data@2.1.4": {
      "asynckit": "npm:asynckit@0.4.0",
      "buffer": "npm:buffer@5.1.0",
      "combined-stream": "npm:combined-stream@1.0.6",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "mime-types": "npm:mime-types@2.1.18",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:formidable@1.0.16": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:fs-extra@1.0.0": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "jsonfile": "npm:jsonfile@2.4.0",
      "klaw": "npm:klaw@1.3.1",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fs-minipass@1.2.5": {
      "buffer": "npm:buffer@5.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minipass": "npm:minipass@2.3.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fs.realpath@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fsevents@1.2.4": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "nan": "npm:nan@2.10.0",
      "node-pre-gyp": "npm:node-pre-gyp@0.10.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:gauge@2.7.4": {
      "aproba": "npm:aproba@1.2.0",
      "console-control-strings": "npm:console-control-strings@1.1.0",
      "has-unicode": "npm:has-unicode@2.0.1",
      "object-assign": "npm:object-assign@4.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "signal-exit": "npm:signal-exit@3.0.2",
      "string-width": "npm:string-width@1.0.2",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "wide-align": "npm:wide-align@1.1.3"
    },
    "npm:generate-function@2.0.0": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:generate-object-property@1.2.0": {
      "is-property": "npm:is-property@1.0.2"
    },
    "npm:getpass@0.1.7": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:glob-base@0.3.0": {
      "glob-parent": "npm:glob-parent@2.0.0",
      "is-glob": "npm:is-glob@2.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:glob-parent@2.0.0": {
      "assert": "npm:assert@1.4.1",
      "is-glob": "npm:is-glob@2.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0"
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
    "npm:glob@7.1.2": {
      "assert": "npm:assert@1.4.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "fs.realpath": "npm:fs.realpath@1.0.0",
      "inflight": "npm:inflight@1.0.6",
      "inherits": "npm:inherits@2.0.3",
      "minimatch": "npm:minimatch@3.0.4",
      "once": "npm:once@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-is-absolute": "npm:path-is-absolute@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
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
    "npm:graceful-fs@4.1.11": {
      "assert": "npm:assert@1.4.1",
      "constants": "npm:constants-browserify@0.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
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
    "npm:har-validator@2.0.6": {
      "chalk": "npm:chalk@1.1.3",
      "commander": "npm:commander@2.15.1",
      "is-my-json-valid": "npm:is-my-json-valid@2.17.2",
      "pinkie-promise": "npm:pinkie-promise@2.0.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:has-ansi@2.0.0": {
      "ansi-regex": "npm:ansi-regex@2.1.1"
    },
    "npm:has-binary@0.1.6": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:has-binary@0.1.7": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:has-cors@1.1.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:has-unicode@2.0.1": {
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:hawk@3.1.3": {
      "boom": "npm:boom@2.10.1",
      "cryptiles": "npm:cryptiles@2.0.5",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "hoek": "npm:hoek@2.16.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sntp": "npm:sntp@1.0.9",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:hmac-drbg@1.0.1": {
      "hash.js": "npm:hash.js@1.1.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:hoek@2.16.3": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:hooker@0.2.3": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:hosted-git-info@2.6.0": {
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:http-errors@1.5.1": {
      "inherits": "npm:inherits@2.0.3",
      "setprototypeof": "npm:setprototypeof@1.0.2",
      "statuses": "npm:statuses@1.3.1"
    },
    "npm:http-proxy@1.15.2": {
      "buffer": "npm:buffer@5.1.0",
      "eventemitter3": "npm:eventemitter3@1.2.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "requires-port": "npm:requires-port@1.0.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:http-proxy@1.17.0": {
      "buffer": "npm:buffer@5.1.0",
      "eventemitter3": "npm:eventemitter3@3.1.0",
      "follow-redirects": "npm:follow-redirects@1.5.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "requires-port": "npm:requires-port@1.0.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:http-signature@1.1.1": {
      "assert-plus": "npm:assert-plus@0.2.0",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "jsprim": "npm:jsprim@1.4.1",
      "sshpk": "npm:sshpk@1.14.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.2.11": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.23": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safer-buffer": "npm:safer-buffer@2.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:ignore-walk@3.0.1": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimatch": "npm:minimatch@3.0.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:immutable@3.8.1": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:inflight@1.0.6": {
      "once": "npm:once@1.4.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "wrappy": "npm:wrappy@1.0.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.3": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:ini@1.3.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:is-binary-path@1.0.1": {
      "binary-extensions": "npm:binary-extensions@1.11.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:is-buffer@1.1.6": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:is-builtin-module@1.0.0": {
      "builtin-modules": "npm:builtin-modules@1.1.1"
    },
    "npm:is-equal-shallow@0.1.3": {
      "is-primitive": "npm:is-primitive@2.0.0"
    },
    "npm:is-fullwidth-code-point@1.0.0": {
      "number-is-nan": "npm:number-is-nan@1.0.1"
    },
    "npm:is-glob@2.0.1": {
      "is-extglob": "npm:is-extglob@1.0.0"
    },
    "npm:is-my-ip-valid@1.0.0": {
      "assert": "npm:assert@1.4.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:is-my-json-valid@2.17.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "generate-function": "npm:generate-function@2.0.0",
      "generate-object-property": "npm:generate-object-property@1.2.0",
      "is-my-ip-valid": "npm:is-my-ip-valid@1.0.0",
      "jsonpointer": "npm:jsonpointer@4.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "xtend": "npm:xtend@4.0.1"
    },
    "npm:is-number@2.1.0": {
      "kind-of": "npm:kind-of@3.2.2"
    },
    "npm:is-typedarray@1.0.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:isobject@2.1.0": {
      "isarray": "npm:isarray@1.0.0"
    },
    "npm:isstream@0.1.2": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
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
    "npm:jsbn@0.1.1": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:jsonfile@2.4.0": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-fs": "npm:graceful-fs@4.1.11"
    },
    "npm:jsprim@1.4.1": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "extsprintf": "npm:extsprintf@1.3.0",
      "json-schema": "npm:json-schema@0.2.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "verror": "npm:verror@1.10.0"
    },
    "npm:kind-of@3.2.2": {
      "is-buffer": "npm:is-buffer@1.1.6"
    },
    "npm:klaw@1.3.1": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lcid@1.0.0": {
      "invert-kv": "npm:invert-kv@1.0.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:limiter@1.1.3": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:load-json-file@1.1.0": {
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "parse-json": "npm:parse-json@2.2.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "pify": "npm:pify@2.3.0",
      "pinkie-promise": "npm:pinkie-promise@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "strip-bom": "npm:strip-bom@2.0.0"
    },
    "npm:localtunnel@1.8.2": {
      "debug": "npm:debug@2.2.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "openurl": "npm:openurl@1.1.0",
      "request": "npm:request@2.78.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "yargs": "npm:yargs@3.29.0"
    },
    "npm:lodash@0.9.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash@2.4.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lpad@0.1.0": {
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:math-random@1.0.1": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:md5.js@1.3.4": {
      "buffer": "npm:buffer@5.1.0",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:micromatch@2.3.11": {
      "arr-diff": "npm:arr-diff@2.0.0",
      "array-unique": "npm:array-unique@0.2.1",
      "braces": "npm:braces@1.8.5",
      "expand-brackets": "npm:expand-brackets@0.1.5",
      "extglob": "npm:extglob@0.3.2",
      "filename-regex": "npm:filename-regex@2.0.1",
      "is-extglob": "npm:is-extglob@1.0.0",
      "is-glob": "npm:is-glob@2.0.1",
      "kind-of": "npm:kind-of@3.2.2",
      "normalize-path": "npm:normalize-path@2.1.1",
      "object.omit": "npm:object.omit@2.0.1",
      "parse-glob": "npm:parse-glob@3.0.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "regex-cache": "npm:regex-cache@0.4.4"
    },
    "npm:miller-rabin@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0"
    },
    "npm:mime-db@1.33.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:mime-types@2.1.18": {
      "mime-db": "npm:mime-db@1.33.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:mime@1.2.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:mime@1.3.4": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
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
    "npm:minimatch@3.0.4": {
      "brace-expansion": "npm:brace-expansion@1.1.11",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:minipass@2.3.3": {
      "buffer": "npm:buffer@5.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "yallist": "npm:yallist@3.0.2"
    },
    "npm:minizlib@1.1.0": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "minipass": "npm:minipass@2.3.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:mkdirp@0.3.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:mkdirp@0.5.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimist": "npm:minimist@0.0.8",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nan@2.10.0": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nan@2.4.0": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:needle@2.2.1": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "debug": "npm:debug@2.3.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "iconv-lite": "npm:iconv-lite@0.4.23",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "sax": "npm:sax@1.2.4",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:node-pre-gyp@0.10.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "detect-libc": "npm:detect-libc@1.0.3",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "mkdirp": "npm:mkdirp@0.5.1",
      "needle": "npm:needle@2.2.1",
      "nopt": "npm:nopt@4.0.1",
      "npm-packlist": "npm:npm-packlist@1.1.10",
      "npmlog": "npm:npmlog@4.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "rc": "npm:rc@1.2.8",
      "rimraf": "npm:rimraf@2.6.2",
      "semver": "npm:semver@5.5.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "tar": "npm:tar@4.4.4",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:node-uuid@1.4.8": {
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
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
    "npm:nopt@3.0.6": {
      "abbrev": "npm:abbrev@1.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:nopt@4.0.1": {
      "abbrev": "npm:abbrev@1.1.1",
      "osenv": "npm:osenv@0.1.5",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:normalize-package-data@2.4.0": {
      "hosted-git-info": "npm:hosted-git-info@2.6.0",
      "is-builtin-module": "npm:is-builtin-module@1.0.0",
      "semver": "npm:semver@5.5.0",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "validate-npm-package-license": "npm:validate-npm-package-license@3.0.3"
    },
    "npm:normalize-path@2.1.1": {
      "remove-trailing-separator": "npm:remove-trailing-separator@1.1.0"
    },
    "npm:npm-bundled@1.0.3": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:npm-packlist@1.1.10": {
      "ignore-walk": "npm:ignore-walk@3.0.1",
      "npm-bundled": "npm:npm-bundled@1.0.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:npmlog@4.1.2": {
      "are-we-there-yet": "npm:are-we-there-yet@1.1.5",
      "console-control-strings": "npm:console-control-strings@1.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "gauge": "npm:gauge@2.7.4",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "set-blocking": "npm:set-blocking@2.0.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:oauth-sign@0.8.2": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0"
    },
    "npm:object.omit@2.0.1": {
      "for-own": "npm:for-own@0.1.5",
      "is-extendable": "npm:is-extendable@0.1.1"
    },
    "npm:on-finished@2.3.0": {
      "ee-first": "npm:ee-first@1.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:once@1.4.0": {
      "wrappy": "npm:wrappy@1.0.2"
    },
    "npm:openurl@1.1.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:opn@4.0.2": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "object-assign": "npm:object-assign@4.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "pinkie-promise": "npm:pinkie-promise@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:options@0.0.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:os-homedir@1.0.2": {
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-locale@1.4.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "lcid": "npm:lcid@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-tmpdir@1.0.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:osenv@0.1.5": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "os-homedir": "npm:os-homedir@1.0.2",
      "os-tmpdir": "npm:os-tmpdir@1.0.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pako@0.2.9": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:parse-glob@3.0.4": {
      "glob-base": "npm:glob-base@0.3.0",
      "is-dotfile": "npm:is-dotfile@1.0.3",
      "is-extglob": "npm:is-extglob@1.0.0",
      "is-glob": "npm:is-glob@2.0.1"
    },
    "npm:parse-json@2.2.0": {
      "error-ex": "npm:error-ex@1.3.1"
    },
    "npm:parsejson@0.0.3": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseqs@0.0.5": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseuri@0.0.5": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseurl@1.3.2": {
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-exists@2.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "pinkie-promise": "npm:pinkie-promise@2.0.1"
    },
    "npm:path-is-absolute@1.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-type@1.1.0": {
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "pify": "npm:pify@2.3.0",
      "pinkie-promise": "npm:pinkie-promise@2.0.1"
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
    "npm:pify@2.3.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pinkie-promise@2.0.1": {
      "pinkie": "npm:pinkie@2.0.4"
    },
    "npm:portscanner@1.2.0": {
      "async": "npm:async@1.5.2",
      "net": "github:jspm/nodelibs-net@0.1.2"
    },
    "npm:preserve@0.2.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:process-nextick-args@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:punycode@1.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:q@0.8.12": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:qs@0.4.2": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:randomatic@3.0.0": {
      "is-number": "npm:is-number@4.0.0",
      "kind-of": "npm:kind-of@6.0.2",
      "math-random": "npm:math-random@1.0.1"
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
    "npm:rc@1.2.8": {
      "deep-extend": "npm:deep-extend@0.6.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ini": "npm:ini@1.3.5",
      "minimist": "npm:minimist@1.2.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "strip-json-comments": "npm:strip-json-comments@2.0.1"
    },
    "npm:read-pkg-up@1.0.1": {
      "find-up": "npm:find-up@1.1.2",
      "read-pkg": "npm:read-pkg@1.1.0"
    },
    "npm:read-pkg@1.1.0": {
      "load-json-file": "npm:load-json-file@1.1.0",
      "normalize-package-data": "npm:normalize-package-data@2.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-type": "npm:path-type@1.1.0"
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
    "npm:readable-stream@2.3.6": {
      "buffer": "npm:buffer@5.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@2.0.0",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "npm:string_decoder@1.1.1",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:readdirp@2.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "minimatch": "npm:minimatch@3.0.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.3.6",
      "set-immediate-shim": "npm:set-immediate-shim@1.0.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:regex-cache@0.4.4": {
      "is-equal-shallow": "npm:is-equal-shallow@0.1.3"
    },
    "npm:remove-trailing-separator@1.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:request@2.78.0": {
      "aws-sign2": "npm:aws-sign2@0.6.0",
      "aws4": "npm:aws4@1.7.0",
      "buffer": "npm:buffer@5.1.0",
      "caseless": "npm:caseless@0.11.0",
      "combined-stream": "npm:combined-stream@1.0.6",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "extend": "npm:extend@3.0.1",
      "forever-agent": "npm:forever-agent@0.6.1",
      "form-data": "npm:form-data@2.1.4",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "har-validator": "npm:har-validator@2.0.6",
      "hawk": "npm:hawk@3.1.3",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "http-signature": "npm:http-signature@1.1.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "is-typedarray": "npm:is-typedarray@1.0.0",
      "isstream": "npm:isstream@0.1.2",
      "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
      "mime-types": "npm:mime-types@2.1.18",
      "node-uuid": "npm:node-uuid@1.4.8",
      "oauth-sign": "npm:oauth-sign@0.8.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "qs": "npm:qs@6.3.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stringstream": "npm:stringstream@0.0.6",
      "tough-cookie": "npm:tough-cookie@2.3.4",
      "tunnel-agent": "npm:tunnel-agent@0.4.3",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:require-directory@2.1.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:require-main-filename@1.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:requires-port@1.0.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:resp-modifier@6.0.2": {
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@2.2.0",
      "minimatch": "npm:minimatch@3.0.4"
    },
    "npm:rimraf@2.2.8": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:rimraf@2.6.2": {
      "assert": "npm:assert@1.4.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "glob": "npm:glob@7.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ripemd160@2.0.2": {
      "buffer": "npm:buffer@5.1.0",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:rx@4.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:safe-buffer@5.1.2": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:safer-buffer@2.1.2": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sax@1.2.4": {
      "buffer": "npm:buffer@5.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:semver@5.5.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:send@0.14.1": {
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@2.2.0",
      "depd": "npm:depd@1.1.2",
      "destroy": "npm:destroy@1.0.4",
      "encodeurl": "npm:encodeurl@1.0.2",
      "escape-html": "npm:escape-html@1.0.3",
      "etag": "npm:etag@1.7.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fresh": "npm:fresh@0.3.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http-errors": "npm:http-errors@1.5.1",
      "mime": "npm:mime@1.3.4",
      "ms": "npm:ms@0.7.1",
      "on-finished": "npm:on-finished@2.3.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "range-parser": "npm:range-parser@1.2.0",
      "statuses": "npm:statuses@1.3.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:serve-index@1.8.0": {
      "accepts": "npm:accepts@1.3.5",
      "batch": "npm:batch@0.5.3",
      "buffer": "npm:buffer@5.1.0",
      "debug": "npm:debug@2.2.0",
      "escape-html": "npm:escape-html@1.0.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http-errors": "npm:http-errors@1.5.1",
      "mime-types": "npm:mime-types@2.1.18",
      "parseurl": "npm:parseurl@1.3.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:serve-static@1.11.1": {
      "buffer": "npm:buffer@5.1.0",
      "encodeurl": "npm:encodeurl@1.0.2",
      "escape-html": "npm:escape-html@1.0.3",
      "parseurl": "npm:parseurl@1.3.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "send": "npm:send@0.14.1",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:server-destroy@1.0.1": {
      "assert": "npm:assert@1.4.1",
      "net": "github:jspm/nodelibs-net@0.1.2"
    },
    "npm:set-blocking@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:signal-exit@3.0.2": {
      "assert": "npm:assert@1.4.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sntp@1.0.9": {
      "buffer": "npm:buffer@5.1.0",
      "dgram": "github:jspm/nodelibs-dgram@0.1.0",
      "dns": "github:jspm/nodelibs-dns@0.1.0",
      "hoek": "npm:hoek@2.16.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:socket.io-adapter@0.5.0": {
      "debug": "npm:debug@2.3.3",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "socket.io-parser": "npm:socket.io-parser@2.3.1"
    },
    "npm:socket.io-client@1.6.0": {
      "backo2": "npm:backo2@1.0.2",
      "buffer": "npm:buffer@5.1.0",
      "component-bind": "npm:component-bind@1.0.0",
      "component-emitter": "npm:component-emitter@1.2.1",
      "debug": "npm:debug@2.3.3",
      "engine.io-client": "npm:engine.io-client@1.8.0",
      "has-binary": "npm:has-binary@0.1.7",
      "indexof": "npm:indexof@0.0.1",
      "object-component": "npm:object-component@0.0.3",
      "parseuri": "npm:parseuri@0.0.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "socket.io-parser": "npm:socket.io-parser@2.3.1",
      "to-array": "npm:to-array@0.1.4"
    },
    "npm:socket.io-parser@2.3.1": {
      "buffer": "npm:buffer@5.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "debug": "npm:debug@2.2.0",
      "isarray": "npm:isarray@0.0.1",
      "json3": "npm:json3@3.3.2"
    },
    "npm:socket.io@1.6.0": {
      "debug": "npm:debug@2.3.3",
      "engine.io": "npm:engine.io@1.8.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "has-binary": "npm:has-binary@0.1.7",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "object-assign": "npm:object-assign@4.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "socket.io-adapter": "npm:socket.io-adapter@0.5.0",
      "socket.io-client": "npm:socket.io-client@1.6.0",
      "socket.io-parser": "npm:socket.io-parser@2.3.1",
      "url": "github:jspm/nodelibs-url@0.1.0"
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
    "npm:spdx-correct@3.0.0": {
      "spdx-expression-parse": "npm:spdx-expression-parse@3.0.0",
      "spdx-license-ids": "npm:spdx-license-ids@3.0.0"
    },
    "npm:spdx-expression-parse@3.0.0": {
      "spdx-exceptions": "npm:spdx-exceptions@2.1.0",
      "spdx-license-ids": "npm:spdx-license-ids@3.0.0"
    },
    "npm:sshpk@1.14.2": {
      "asn1": "npm:asn1@0.2.3",
      "assert-plus": "npm:assert-plus@1.0.0",
      "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.1",
      "buffer": "npm:buffer@5.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "dashdash": "npm:dashdash@1.14.1",
      "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
      "getpass": "npm:getpass@0.1.7",
      "jsbn": "npm:jsbn@0.1.1",
      "safer-buffer": "npm:safer-buffer@2.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "tweetnacl": "npm:tweetnacl@0.14.5",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:statuses@1.3.1": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:stream-throttle@0.1.3": {
      "commander": "npm:commander@2.15.1",
      "limiter": "npm:limiter@1.1.3",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:string-width@1.0.2": {
      "code-point-at": "npm:code-point-at@1.1.0",
      "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0",
      "strip-ansi": "npm:strip-ansi@3.0.1"
    },
    "npm:string-width@2.1.1": {
      "is-fullwidth-code-point": "npm:is-fullwidth-code-point@2.0.0",
      "strip-ansi": "npm:strip-ansi@4.0.0"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "npm:buffer@5.1.0"
    },
    "npm:string_decoder@1.1.1": {
      "buffer": "npm:buffer@5.1.0",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:stringstream@0.0.6": {
      "buffer": "npm:buffer@5.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:strip-ansi@3.0.1": {
      "ansi-regex": "npm:ansi-regex@2.1.1"
    },
    "npm:strip-ansi@4.0.0": {
      "ansi-regex": "npm:ansi-regex@3.0.0"
    },
    "npm:strip-bom@2.0.0": {
      "buffer": "npm:buffer@5.1.0",
      "is-utf8": "npm:is-utf8@0.2.1"
    },
    "npm:supports-color@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:tar@4.4.4": {
      "buffer": "npm:buffer@5.1.0",
      "chownr": "npm:chownr@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "fs-minipass": "npm:fs-minipass@1.2.5",
      "minipass": "npm:minipass@2.3.3",
      "minizlib": "npm:minizlib@1.1.0",
      "mkdirp": "npm:mkdirp@0.5.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "yallist": "npm:yallist@3.0.2"
    },
    "npm:tfunk@3.1.0": {
      "chalk": "npm:chalk@1.1.3",
      "object-path": "npm:object-path@0.9.2"
    },
    "npm:timers-browserify@1.4.2": {
      "process": "npm:process@0.11.10"
    },
    "npm:tough-cookie@2.3.4": {
      "net": "github:jspm/nodelibs-net@0.1.2",
      "punycode": "npm:punycode@1.4.1",
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:tunnel-agent@0.4.3": {
      "assert": "npm:assert@1.4.1",
      "buffer": "npm:buffer@5.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:typescript@2.7.2": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "source-map-support": "npm:source-map-support@0.5.6"
    },
    "npm:ua-parser-js@0.7.12": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:ultron@1.0.2": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:url@0.10.3": {
      "assert": "npm:assert@1.4.1",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:utf-8-validate@1.2.2": {
      "bindings": "npm:bindings@1.2.1",
      "nan": "npm:nan@2.4.0"
    },
    "npm:utf8@2.1.0": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:validate-npm-package-license@3.0.3": {
      "spdx-correct": "npm:spdx-correct@3.0.0",
      "spdx-expression-parse": "npm:spdx-expression-parse@3.0.0"
    },
    "npm:verror@1.10.0": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "extsprintf": "npm:extsprintf@1.3.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:weinre@2.0.0-pre-I0Z7U9OV": {
      "dns": "github:jspm/nodelibs-dns@0.1.0",
      "express": "npm:express@2.5.11",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "nopt": "npm:nopt@3.0.6",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore": "npm:underscore@1.7.0"
    },
    "npm:which@1.0.9": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:wide-align@1.1.3": {
      "string-width": "npm:string-width@2.1.1"
    },
    "npm:window-size@0.1.4": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:window-size@0.2.0": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:wrap-ansi@2.1.0": {
      "string-width": "npm:string-width@1.0.2",
      "strip-ansi": "npm:strip-ansi@3.0.1"
    },
    "npm:ws@1.0.1": {
      "buffer": "npm:buffer@5.1.0",
      "bufferutil": "npm:bufferutil@1.2.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "options": "npm:options@0.0.6",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "ultron": "npm:ultron@1.0.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "utf-8-validate": "npm:utf-8-validate@1.2.2",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:xtend@4.0.1": {
      "systemjs-json": "npm:systemjs-plugin-json@0.1.0"
    },
    "npm:y18n@3.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:yargs-parser@4.2.1": {
      "camelcase": "npm:camelcase@3.0.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:yargs@3.29.0": {
      "assert": "npm:assert@1.4.1",
      "camelcase": "npm:camelcase@1.2.1",
      "cliui": "npm:cliui@3.2.0",
      "decamelize": "npm:decamelize@1.2.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "os-locale": "npm:os-locale@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "window-size": "npm:window-size@0.1.4",
      "y18n": "npm:y18n@3.2.1"
    },
    "npm:yargs@6.4.0": {
      "camelcase": "npm:camelcase@3.0.0",
      "cliui": "npm:cliui@3.2.0",
      "decamelize": "npm:decamelize@1.2.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "get-caller-file": "npm:get-caller-file@1.0.2",
      "os-locale": "npm:os-locale@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "read-pkg-up": "npm:read-pkg-up@1.0.1",
      "require-directory": "npm:require-directory@2.1.1",
      "require-main-filename": "npm:require-main-filename@1.0.1",
      "set-blocking": "npm:set-blocking@2.0.0",
      "string-width": "npm:string-width@1.0.2",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "which-module": "npm:which-module@1.0.0",
      "window-size": "npm:window-size@0.2.0",
      "y18n": "npm:y18n@3.2.1",
      "yargs-parser": "npm:yargs-parser@4.2.1"
    }
  }
});
