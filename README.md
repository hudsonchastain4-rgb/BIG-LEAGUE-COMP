# The Big League Competition (BLC)

Mobile-first lifestyle competition inspired by the Transy Alumni Scramble app. A separate app and database: no original golf scores or participants are copied. Reuses the original server-sent event broadcast helper; the new client is dependency-free HTML/CSS/JavaScript and the server uses Node 22's built-in HTTP and SQLite modules. No build step or npm dependencies are required.

## Launch on Render

1. Extract this ZIP. Create a new GitHub repository and upload the contents of the project folder (including `render.yaml`, `package.json`, `public`, `server`, and `tests`). Do not replace the Transy repository.
2. In Render, choose New > Blueprint and connect the new GitHub repository. Alternatively create a Node web service manually: build command `npm test`, start command `npm start`, Node version 22.16.0.
3. When prompted, set `ADMIN_PIN` to your own strong secret PIN/password. Do not put it in GitHub. For manual setup, also set `DB_PATH=/var/data/blc.sqlite` and attach a persistent disk at `/var/data`. The blueprint specifies a paid Starter service and persistent disk; confirm Render's current pricing before deployment. An ephemeral filesystem will lose data on redeploy.
4. Open the deployed URL. Select **Admin**, sign in, add participants and choose their team colors. Share the same URL with the league. No participant PIN is required. Have members select their profile and enter a nutrition commitment before January 4.
5. On mobile, add the site to the home screen (iOS Safari: Share > Add to Home Screen; Android Chrome: menu > Install/Add to home screen). Internet access is required for scores and changes.

## Run locally

Requires Node.js 22.13 or newer (tested on 22.16.0). macOS/Linux: `ADMIN_PIN=your-secret npm start`. Windows PowerShell: `$env:ADMIN_PIN='your-secret'; npm start`. Open http://localhost:3001. Data lives in `data/blc.sqlite` unless DB_PATH overrides it. Run `npm test` for the scoring tests. Node 22 may print an experimental SQLite warning; this is expected.

## Rules

- Default season begins Monday January 4, 2027, and consists of 52 full competition weeks. Week 52 ends Sunday January 2, 2028. Finalization is Monday January 3 at noon Eastern. This is a 364-day league season, not a calendar year.
- Each daily completion earns one point: workout (30 min), reading (15 min), hydration (80 oz), personal weekly nutrition commitment, and 8,000 steps. Five daily, 35 weekly. Intentional active recovery counts as exercise.
- Weekly goal text can be set before the week begins, carries forward, and is public. It locks Monday at midnight Eastern; without a goal the nutrition point is unavailable until an admin sets one. Admin changes are logged.
- Each date is editable through 11:59 a.m. Eastern the following day. Matchups finalize Monday at noon. Self-reporting is an honor system, not authenticated identity: anyone with the link can choose any participant or edit their open check-ins. The admin area is protected by a server-side session and secret PIN/password. Do not collect sensitive information in goals. League scores and individual activity history are visible to anyone with the URL.
- Regular season is weeks 1–50. Round robin repeats as necessary. Odd rosters have rotating byes; bye points count for annual standings and MVP, but not W-L-T. New participants added after kickoff join the following full week. Removed players retain history and leave after the current week. Roster changes can alter future automatic pairings; admin can override regular-season pairings.
- MVP: highest nonzero raw score each finalized week; all ties receive +5 annual points each, never matchup points. No MVP for an all-zero week.
- Weeks 51 and 52 are semifinals and championship. Top four eligible participants by regular-season win percentage (ties count as half a win), then regular-season raw points, then alphabetical name qualify. Seeds 1/4 and 2/3 meet; higher seed wins a tied playoff. With two or three participants, top two meet in week 52; with fewer than two no playoff champion is declared. Non-playoff players continue logging for the annual championship. Late Sunday entries can affect playoff seeding until Monday noon; the next round is displayed after finalization. Administrative corrections can recalculate prior scores, MVPs and playoff outcomes; use carefully after playoff rounds start.
- Annual points = raw activity points + MVP bonuses. No other bonuses. Regular-season records exclude playoff results. In equal annual totals, the interface orders by raw points then name; equal total points are tied in the points competition unless the league adopts another rule.
- New seasons archive the previous season and begin with an empty roster. Historical stats are available by season. CSV export includes daily activities, not a complete database backup. Back up the persistent SQLite database using your hosting backup tools (including WAL-safe handling). Admin may edit category descriptions season-wide; historical descriptions are not separately versioned.

## Verification

Scoring unit tests cover round-robin, byes, Eastern dates/cutoffs, MVP bonuses, category counting, playoffs and nutrition carryover. Local HTTP smoke tests covered server state, PIN login and adding participants. Full interactive browser testing and live hosting are not verified in this package; perform a preseason trial before sharing with the league.
