
Table Function_Blocks {
  id integer [primary key]
  created_by integer [not null]
  last_edited_by integer
  python_script blob
  being_edited bool
}

Table Users {
  id integer [primary key]
  username varchar
  is_admin bool
  has_edited_today bool
}

Ref user_created: Function_Blocks.created_by - users.username
Ref last_edited_by: Function_Blocks.last_edited_by - users.username
