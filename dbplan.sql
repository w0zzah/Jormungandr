CREATE TABLE user (
  _id INTEGER,
  name TEXT,

  -- auth shit
)

CREATE TABLE line (
  _id INTEGER,
  prev_line_id INTEGER,
  text VARCHAR(255),
  created_by INTEGER,
  updated_by INTEGER,
  updated_at INTEGER,
  deleted BOOL
);

CREATE TABLE action (

  _id INTEGER,
  created_at INTEGER,
  type TEXT,
  user_id INTEGER,
  line_id INTEGER,
  prev_line_id INTEGER,
  old_text TEXT,
  new_text TEXT,
  reverted_action_id INTEGER,
  
),


-- TYPE: UPDATE,INSERT,DELETE,REVERT
-- Prev line is just a ref to the line above it in the "ide" we have 
