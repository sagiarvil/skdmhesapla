"use strict";

// Existing API + isolated CBAM server-authoritative seal + regulatory monitoring.
const apiExports = require("./index.js");
const cbamSealExports = require("./cbam-seal-v2.js");
const regulatoryExports = require("./regulatory-monitor-email.js");

module.exports = {
  ...apiExports,
  cbamApiV2: cbamSealExports.cbamApiV2,
  regulatoryWatch15m: regulatoryExports.regulatoryWatch15m,
  regulatoryDigestDaily: regulatoryExports.regulatoryDigestDaily,
};
