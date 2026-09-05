"use strict";

// Existing API + isolated CBAM server-authoritative seal + regulatory monitoring + maritime backend.
const apiExports = require("./index.js");
const cbamSealExports = require("./cbam-seal-v2.js");
const regulatoryExports = require("./regulatory-monitor-email.js");
const maritimeExports = require("./maritime-backend-v2.js");

module.exports = {
  ...apiExports,
  cbamApiV2: cbamSealExports.cbamApiV2,
  maritimeApi: maritimeExports.maritimeApi,
  regulatoryWatch15m: regulatoryExports.regulatoryWatch15m,
  regulatoryDigestDaily: regulatoryExports.regulatoryDigestDaily,
};
