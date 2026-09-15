/* GET /api/admin-export — your monitoring JSON.
   Requires the 'admin' role on the Identity user. */
const { sql } = require('./_lib/db');
const { requireUser, json, unauthorized } = require('./_lib/auth');

exports.handler = async (event, context) => {
  const user = requireUser(context);
  if (!user) return unauthorized();
  if (!user.roles.includes('admin')) return json(403, { error: 'admin only' });

  const players = await sql`select * from player_overview`;
  const flags   = await sql`select * from flags where not reviewed order by created_at desc limit 500`;
  const trips   = await sql`select * from trips order by ended_at desc limit 1000`;

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'content-disposition': 'attachment; filename="ogra-players.json"'
    },
    body: JSON.stringify({ exported: new Date().toISOString(), players, flags, trips }, null, 2)
  };
};
