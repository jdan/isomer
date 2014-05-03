var Isomer = require('./js/isomer');

if (typeof window !== "undefined") {
  window.Isomer = Isomer;
} else {
  module.exports = Isomer;
}
