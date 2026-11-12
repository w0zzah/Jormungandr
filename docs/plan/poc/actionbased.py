import sqlite3, time

db = sqlite3.connect("poc.db")
db.executescript("""
CREATE TABLE IF NOT EXISTS line (
    _id INTEGER PRIMARY KEY, 
    prev_line_id INTEGER, 
    text TEXT,
    deleted BOOL NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS action (
    _id INTEGER PRIMARY KEY AUTOINCREMENT, 
    created_at INTEGER, 
    type TEXT,
    line_id INTEGER, 
    prev_line_id INTEGER, 
    old_text TEXT, 
    new_text TEXT
);
""")

def do(atype, line_id, prev_line_id=None, old=None, new=None):
    with db:

        # Record what happened
        db.execute("INSERT INTO action(created_at,type,line_id,prev_line_id,old_text,new_text) VALUES (?,?,?,?,?,?)",(int(time.time()), atype, line_id, prev_line_id, old, new))

        # Update the pyscript
        match atype:
            case "INSERT":
                db.execute("INSERT INTO line(_id,prev_line_id,text) VALUES (?,?,?)", (line_id, prev_line_id, new))

            case "UPDATE":
                db.execute("UPDATE line SET text=? WHERE _id=?", (new, line_id))

            case "DELETE":
                db.execute("UPDATE line SET deleted=true WHERE _id=?", (line_id,))

def show(rows):
    for i, row in enumerate(rows):
        _id, text = row
        print(f"{(i + 1):04d}: {text}")

def get_script():
    return db.execute("SELECT _id, text FROM line WHERE NOT deleted ORDER BY _id").fetchall()

def replay():
    lines = {}
    actions = db.execute("SELECT _id, type, line_id, old_text, new_text FROM action ORDER BY _id").fetchall()

    for action in actions:

        id, atype, line_id, old, new = action
        match atype:
            case "INSERT" | "UPDATE":
                lines[line_id] = new
            case "DELETE":
                del lines[line_id]

        print(f"\n#{id} {atype} line {line_id}: {old!r} -> {new!r}")
        show(list(lines.items()))
        time.sleep(0.5)

def pick(rows, n):
    if not 1 <= n <= len(rows):
        raise IndexError
    return rows[n - 1]

def add_line(text):
    last_id = db.execute("SELECT MAX(_id) FROM line").fetchone()[0]   # None when empty
    do("INSERT", (last_id or 0) + 1, prev_line_id=last_id, new=text)

def set_line(rows, n, text):
    line_id, old = pick(rows, n)
    do("UPDATE", line_id, old=old, new=text)

def remove_line(rows, n):
    line_id, old = pick(rows, n)
    do("DELETE", line_id, old=old)

print("ls | add <text> | set <n> <text> | rm <n> | replay | q")
while True:

    cmd = input("> ").strip().split(" ")
    rows = get_script()

    try:

        match cmd[0]:
            case "ls":
                show(rows)

            case "add":
                add_line(" ".join(cmd[1:]))

            case "set":
                set_line(rows, int(cmd[1]), " ".join(cmd[2:]))

            case "rm":
                remove_line(rows, int(cmd[1]))

            case "replay":
                replay()

            case "q":
                exit(0)

    except:
        print("bad line number")