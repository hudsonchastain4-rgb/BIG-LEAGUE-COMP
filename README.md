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
