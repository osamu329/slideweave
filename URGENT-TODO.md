# URGENT TODO

## CLAUDE.md Critical Issue - Incomplete Edit

### Background
During OSN-167 work session, CLAUDE.md was edited to add phase structure but the edit was left incomplete.

### What Happened
1. Added new phase structure to CLAUDE.md (Phase 0-9)
2. Added placeholder text: "（以下、元のCLAUDE.mdの内容が続く）" (Original CLAUDE.md content continues below)
3. **CRITICAL**: Did not actually append the original content
4. Left CLAUDE.md in broken state with placeholder only

### Current State
- CLAUDE.md contains only phase structure + placeholder comment
- Original content (including verification tools info) is missing
- Original content is recoverable from git: commit 4ac8239
- Backup created at: `/home/osamu329/ws/slideweave/tmp/CLAUDE.old.md`

### Impact
- Lost access to verification tools documentation
- Broke continuity for future AI sessions
- Created incomplete project documentation

### Required Actions
1. **PRIORITY 1**: Restore CLAUDE.md by merging:
   - Current phase structure (keep)
   - Original content from CLAUDE.old.md (append)
   - Remove placeholder text
2. Implement editing safeguards to prevent recurrence
3. Document editing protocols for large files

### Technical Constraints That Led to Issue
- Edit tool limitations for large files
- AI tendency to use placeholders for "later completion"
- No built-in verification of edit completeness
- AI forgets "pending tasks" between operations

### Files Involved
- `/home/osamu329/ws/slideweave/CLAUDE.md` (broken)
- `/home/osamu329/ws/slideweave/tmp/CLAUDE.old.md` (backup)
- Git commit: 4ac8239 (original state)