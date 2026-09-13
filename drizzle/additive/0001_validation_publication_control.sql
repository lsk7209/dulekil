-- Additive only. Verified against the 2026-09-13 restored schema; never recreates existing tables.
CREATE TABLE challenge_lists (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, key TEXT NOT NULL UNIQUE, name TEXT NOT NULL, publisher TEXT NOT NULL, version_label TEXT, source_url TEXT NOT NULL, source_checked_at INTEGER, created_at INTEGER DEFAULT (unixepoch()));
CREATE TABLE challenge_memberships (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, challenge_list_id INTEGER NOT NULL REFERENCES challenge_lists(id) ON DELETE CASCADE, mountain_id INTEGER NOT NULL REFERENCES mountains(id) ON DELETE RESTRICT, source_item_name TEXT NOT NULL, source_record_id TEXT, match_status TEXT NOT NULL DEFAULT 'candidate', match_basis TEXT, created_at INTEGER DEFAULT (unixepoch()));
CREATE UNIQUE INDEX uq_challenge_membership ON challenge_memberships(challenge_list_id,mountain_id);
CREATE INDEX idx_challenge_membership_status ON challenge_memberships(match_status);

CREATE TABLE hiking_routes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, route_key TEXT NOT NULL UNIQUE, name TEXT NOT NULL, route_type TEXT NOT NULL, trailhead TEXT NOT NULL, endpoint TEXT NOT NULL, trailhead_id TEXT, endpoint_id TEXT, distance_km REAL, duration_minutes INTEGER, duration_scope TEXT, elevation_gain_m INTEGER, difficulty TEXT, difficulty_source TEXT, source_ids TEXT, source_updated_at INTEGER, review_status TEXT NOT NULL DEFAULT 'unverified', source_checked_at INTEGER, last_human_reviewed_at INTEGER, created_at INTEGER DEFAULT (unixepoch()), updated_at INTEGER DEFAULT (unixepoch()));
CREATE INDEX idx_hiking_route_review ON hiking_routes(review_status);
CREATE TABLE hiking_route_mountains (route_id INTEGER NOT NULL REFERENCES hiking_routes(id) ON DELETE CASCADE, mountain_id INTEGER NOT NULL REFERENCES mountains(id) ON DELETE RESTRICT, sequence INTEGER NOT NULL DEFAULT 0);
CREATE UNIQUE INDEX uq_hiking_route_mountain ON hiking_route_mountains(route_id,mountain_id);
CREATE TABLE hiking_route_segments (route_id INTEGER NOT NULL REFERENCES hiking_routes(id) ON DELETE CASCADE, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT, sequence INTEGER NOT NULL, direction TEXT NOT NULL);
CREATE UNIQUE INDEX uq_hiking_route_segment_sequence ON hiking_route_segments(route_id,sequence);
CREATE UNIQUE INDEX uq_hiking_route_course_direction ON hiking_route_segments(route_id,course_id,direction);

CREATE TABLE claim_evidence (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, field_name TEXT NOT NULL, normalized_value TEXT, source_url TEXT NOT NULL, source_title TEXT, source_authority TEXT, source_updated_at INTEGER, retrieved_at INTEGER NOT NULL, source_checked_at INTEGER, checked_by_type TEXT NOT NULL DEFAULT 'unverified', conflict_status TEXT NOT NULL DEFAULT 'none', valid_until INTEGER);
CREATE INDEX idx_claim_evidence_entity ON claim_evidence(entity_type,entity_id,field_name);
CREATE INDEX idx_claim_evidence_validity ON claim_evidence(valid_until);
CREATE TABLE editorial_reviews (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, review_status TEXT NOT NULL, reviewer_type TEXT NOT NULL, reviewed_at INTEGER NOT NULL, source_snapshot_hash TEXT, notes TEXT);
CREATE UNIQUE INDEX uq_editorial_review_snapshot ON editorial_reviews(entity_type,entity_id,source_snapshot_hash);
CREATE INDEX idx_editorial_review_status ON editorial_reviews(review_status,reviewer_type);

CREATE TABLE publication_approvals (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE RESTRICT, revision INTEGER NOT NULL, source_snapshot_hash TEXT NOT NULL, reviewer_type TEXT NOT NULL, review_status TEXT NOT NULL, reviewed_at INTEGER NOT NULL, created_at INTEGER DEFAULT (unixepoch()));
CREATE UNIQUE INDEX uq_publication_approval_revision ON publication_approvals(page_id,revision);
CREATE INDEX idx_publication_approval_snapshot ON publication_approvals(page_id,source_snapshot_hash);
CREATE TABLE publication_runs (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, run_key_kst TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'started', requested_limit INTEGER NOT NULL, claimed_count INTEGER NOT NULL DEFAULT 0, started_at INTEGER DEFAULT (unixepoch()), completed_at INTEGER);
CREATE TABLE indexing_outbox (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE RESTRICT, approval_revision INTEGER NOT NULL, provider TEXT NOT NULL, url TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempt_count INTEGER NOT NULL DEFAULT 0, next_attempt_at INTEGER, last_error TEXT, created_at INTEGER DEFAULT (unixepoch()), sent_at INTEGER);
CREATE UNIQUE INDEX uq_indexing_outbox_delivery ON indexing_outbox(page_id,approval_revision,provider,url);
CREATE INDEX idx_indexing_outbox_retry ON indexing_outbox(status,next_attempt_at);
