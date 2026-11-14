all routes under /api/v1/

## /auth/
@todo pick a oauth provider and design spec aroung

## /lines
GET  /        - fetch a snapshot fo the lines for the the current state of the program
GET  /{id}    - get a specific snapshot of a program
POST /edit    - update the contents of a given line body
POST /add     - add a new line

## /history
GET /         - list of month,year,goal,snapshot_id

## /admin
POST /goal    - add a goal to the queue of goals for the next months

Ideal flow for main app:
1. get("/lines") and show the current program
2. user finds a line they want to edit
3. post("/lines/edit", line_id, new_text)  OR post("lines/add", line_id_above_the_new_line, new_text) for adding a line

