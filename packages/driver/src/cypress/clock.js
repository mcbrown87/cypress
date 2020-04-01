/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require("lodash");
const lolex = require("lolex");

const install = (win, now, methods) => lolex.withGlobal(win).install({
  target: win,
  now,
  toFake: methods
});

const create = function(win, now, methods) {
  let clock = install(win, now, methods);

  const tick = ms => clock.tick(ms);

  const restore = function() {
    _.each(clock.methods, function(method) {
      try {
        //# before restoring the clock, we need to
        //# reset the hadOwnProperty in case a
        //# the application code eradicated the
        //# overridden clock method at a later time.
        //# this is a property that lolex using internally
        //# when restoring the global methods.
        //# https://github.com/cypress-io/cypress/issues/2850
        const fn = clock[method];
        if (fn && fn.hadOwnProperty && win[method]) {
          return win[method].hadOwnProperty = true;
        }
      } catch (error) {}
    });

    return clock.uninstall();
  };

  const bind = win => clock = install(win, now, methods);

  const details = () => _.pick(clock, "now", "methods");

  return {
    tick,

    restore,

    bind,

    details

  };
};

module.exports = {
  create
};