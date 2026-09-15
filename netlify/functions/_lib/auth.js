/* Netlify Identity puts the verified user on context.clientContext.
   If it is absent the caller is not signed in - we never trust a body field. */
function requireUser(context) {
  const u = context && context.clientContext && context.clientContext.user;
  if (!u || !u.sub) return null;
  return {
    sub: u.sub,
    email: u.email,
    name: (u.user_metadata && u.user_metadata.full_name) || null,
    roles: (u.app_metadata && u.app_metadata.roles) || []
  };
}

const json = (code, body) => ({
  statusCode: code,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  body: JSON.stringify(body)
});

const unauthorized = () => json(401, { error: 'sign in required' });

/* a player serving a ban gets nothing back but the clock */
function bannedResponse(p) {
  return json(403, {
    error: 'banned',
    until: p.banned_until,
    reason: p.ban_reason || 'irregular activity'
  });
}

module.exports = { requireUser, json, unauthorized, bannedResponse };
