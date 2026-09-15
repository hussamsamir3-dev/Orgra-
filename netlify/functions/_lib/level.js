const { XP_CURVE } = require('./economy');

/* level is derived from XP, never sent by the client */
function levelFor(xp) {
  let lvl = 1;
  for (let i = 0; i < XP_CURVE.length; i++) {
    if (xp >= XP_CURVE[i]) lvl = i + 2; else break;
  }
  return Math.min(lvl, XP_CURVE.length + 1);
}
module.exports = { levelFor };
