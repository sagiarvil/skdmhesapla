"use strict";

// Keep the existing API untouched; extend the Firebase export surface with
// isolated regulatory monitoring functions.
const apiExports = require("./index.js");
const regulatoryExports = require("./regulatory-monitor-whatsapp.js");

module.exports = {
  ...apiExports,
  regulatoryWatch15m: regulatoryExports.regulatoryWatch15m,
  regulatoryDigestDaily: regulatoryExports.regulatoryDigestDaily,
};
