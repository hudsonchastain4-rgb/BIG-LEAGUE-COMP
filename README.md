# The Big League Competition — v1.1.0

Update the existing GitHub repository and Render service; do not create a new service or delete the persistent disk.

## Competition calendar

- Test week 1: November 16–22, 2026
- Test week 2: November 23–29, 2026
- Official week 1: November 30–December 6, 2026
- 50 official regular-season weeks and 2 playoff weeks; championship week ends November 28, 2027.
- The two test weeks are retained in matchup history but do not count toward official standings, season activity totals, MVP bonuses, or playoff seeding. Official stats automatically reset at midnight Eastern on November 30. Sunday practice scores remain editable until Monday noon Eastern.

## What's new

Home displays the points leader and head-to-head leader. Standings includes Head-to-head, Overall points and Season stats subtabs plus league-wide activity totals. Matchup details expand/collapse. Check-in includes a team logo uploader (PNG/JPEG/WebP, automatically resized) and immediate first-time nutrition commitment. A saved current-week goal cannot be changed by participants; it carries forward unless a replacement is scheduled for a future week. Administrators can override it. The Messages tab allows participants to post short messages; signed-in admins can delete posts. The latest 100 messages are displayed, with the latest 500 retained. Honor-system profiles mean anyone with the URL can select a participant, view data and post as them; do not post private information.

## Update the existing deployment

1. Extract this archive and open the BLC folder. Copy its contents into your existing local GitHub Desktop repository, replacing files when prompted. Preserve the hidden `.git` directory.
2. In GitHub Desktop, commit all changes to main, then Push origin.
3. Render should automatically deploy the latest commit. If not, open the existing big-league-competition web service and select Manual Deploy > Deploy latest commit.
4. Verify the new deployment is Live. Refresh the website (Ctrl+F5 on Windows if needed).

The application maintains its existing SQLite database (`/var/data/blc.sqlite`). The startup migration updates the original January 4 season in place, preserving profiles, settings, existing logs and future commitments; it runs only once. The two test weeks use separate scoring accounting. Back up the database before updating if possible. Keep the persistent disk and ADMIN_PIN unchanged. No new environment variables or paid resources are needed.

## Local development

Requires Node 22.16.0 or compatible (built-in SQLite). Run `npm test`, then `ADMIN_PIN=yourpin npm start` (set environment variables appropriately on Windows). Default local port 3001. Set DB_PATH to a separate temporary file for a clean local test. The existing Render configuration is unchanged.

## v1.2.1
Adds only live matchup projections and a collapsible Around the League feed. No new scoring rules or tabs. Existing SQLite data remains compatible. Projections use a smoothed recent completion rate, not betting odds.

## v1.3.0: Profile and interface update

Replace the existing repository files (keep `.git` and the existing Render disk). No new environment variables are required. The scoring and projection modules are unchanged. Participants can view profiles by selecting the Profile tab or clicking a team avatar, and edit their selected profile's display name, handle, team name, bio, tagline, color, decorative emblem, photo and logo. Profile edits preserve the underlying participant ID and administrator roster name. Existing logos are reused; avatar images are stored separately in the existing SQLite image table. The honor system still applies to all profile edits. Nutrition changes remain subject to the existing weekly lock, and are managed on the profile or check-in page. The home page includes a prominent Log today button. This release does not include wearable integrations.

## v1.4 update: Daily progress & weekly superlatives (November 2026)

This is an in-place update for the existing BLC Render service. Keep the existing persistent `/var/data/blc.sqlite` database and `ADMIN_PIN`. No new environment variables are required. The server adds an optional `season.progress` field to existing season JSON; all existing check-ins, points, participant profiles, goals, and standings remain intact.

**Water and steps:** Daily Check-In now offers a slider and exact number input. Press **Save** to record the day's cumulative ounces or steps. A participant receives **one point only** when the saved amount reaches **80 oz water** or **8,000 steps**; additional quantities do not award additional points. Values below target are stored but do not award points. Entries can be revised through the existing daily deadline (until noon Eastern the following day). Entries are self-reported. Users may report quantities above the daily target (up to 500 oz or 100,000 steps; safeguards against accidental values). Existing checked water/step days show their corresponding target quantity as the initial value. Admin score corrections keep those quantities consistent.

**Standings:** The new **Superlatives** subtab shows weekly leaders in each category. Workout Warrior, Bookworm, and Nutrition Champion use completed days. Hydration Hero and Step King use cumulative recorded ounces and steps, with completed goal days as tie-breakers. Tied leaders share an award. The current week's awards are marked provisional until finalized. These are recognition only: no extra points are awarded. Standings sorting includes wins, total/raw points, five category completion totals and cumulative ounces/steps; the search field filters participants by name or team name. The Season Stats tab also offers the sortable full activity comparison.

**Deployment:** Extract this ZIP, copy all contents of its `BLC` folder into the **root** of your existing GitHub Desktop clone, keeping `.git` untouched. Commit and Push origin. Render should redeploy automatically. Do not create a second web service, overwrite or delete the Render disk, or reset the database. Review tests with `npm test`.
