"""
FriendRequest App - A Flask web application for friend requests and photo sharing.
Features:
  - User registration and login
  - Send, accept, and reject friend requests
  - Upload and share photos with friends
  - View a friends photo gallery
"""

import os
import sqlite3
from datetime import datetime
from functools import wraps
from werkzeug.utils import secure_filename
from flask import (
    Flask, render_template_string, request, redirect, url_for,
    session, flash, g, send_from_directory
)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

# ── Config ──────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "friendrequest.db")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ── Database helpers ─────────────────────────────────────────────────────────

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT    UNIQUE NOT NULL,
            password TEXT    NOT NULL,
            joined   TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS friend_requests (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id   INTEGER NOT NULL REFERENCES users(id),
            receiver_id INTEGER NOT NULL REFERENCES users(id),
            status      TEXT    NOT NULL DEFAULT 'pending',  -- pending | accepted | rejected
            created_at  TEXT    NOT NULL,
            UNIQUE(sender_id, receiver_id)
        );

        CREATE TABLE IF NOT EXISTS photos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            uploader_id INTEGER NOT NULL REFERENCES users(id),
            filename    TEXT    NOT NULL,
            caption     TEXT,
            uploaded_at TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS photo_tags (
            photo_id INTEGER NOT NULL REFERENCES photos(id),
            user_id  INTEGER NOT NULL REFERENCES users(id),
            PRIMARY KEY (photo_id, user_id)
        );
    """)
    db.commit()


# ── Auth helpers ─────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            flash("Please log in first.", "warning")
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


def current_user():
    if "user_id" not in session:
        return None
    db = get_db()
    return db.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ── Templates ────────────────────────────────────────────────────────────────

BASE_HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FriendRequest App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f0f2f5; color: #1c1e21; }
    a { color: #1877f2; text-decoration: none; }
    a:hover { text-decoration: underline; }
    nav { background: #1877f2; padding: 10px 24px; display: flex; align-items: center; gap: 16px; }
    nav .brand { color: #fff; font-size: 1.4rem; font-weight: 700; }
    nav a { color: #d0e8ff; font-size: .95rem; }
    nav a:hover { color: #fff; text-decoration: none; }
    nav .spacer { flex: 1; }
    .container { max-width: 900px; margin: 28px auto; padding: 0 16px; }
    .card { background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 20px;
            box-shadow: 0 1px 4px rgba(0,0,0,.12); }
    h1, h2, h3 { margin-bottom: 14px; }
    input[type=text], input[type=password], textarea, select {
      width: 100%; padding: 10px 12px; border: 1px solid #ccd0d5; border-radius: 6px;
      font-size: .95rem; margin-bottom: 12px; }
    input[type=file] { margin-bottom: 12px; }
    button, .btn {
      display: inline-block; padding: 10px 20px; background: #1877f2; color: #fff;
      border: none; border-radius: 6px; cursor: pointer; font-size: .95rem; }
    button:hover, .btn:hover { background: #166fe5; }
    .btn-danger { background: #e74c3c; }
    .btn-danger:hover { background: #c0392b; }
    .btn-success { background: #27ae60; }
    .btn-success:hover { background: #219a52; }
    .btn-secondary { background: #6c757d; }
    .btn-secondary:hover { background: #5a6268; }
    .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-size: .9rem; }
    .alert-success { background: #d4edda; color: #155724; }
    .alert-danger  { background: #f8d7da; color: #721c24; }
    .alert-warning { background: #fff3cd; color: #856404; }
    .alert-info    { background: #d1ecf1; color: #0c5460; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .photo-card img { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; }
    .photo-card p  { margin-top: 6px; font-size: .85rem; color: #555; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: .78rem; font-weight: 600; }
    .badge-pending  { background: #fff3cd; color: #856404; }
    .badge-accepted { background: #d4edda; color: #155724; }
    .badge-rejected { background: #f8d7da; color: #721c24; }
    .user-list li { list-style: none; padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px; }
    .user-list li:last-child { border-bottom: none; }
  </style>
</head>
<body>
<nav>
  <span class="brand">FriendRequest</span>
  {% if session.get('user_id') %}
    <a href="{{ url_for('dashboard') }}">Home</a>
    <a href="{{ url_for('friends') }}">Friends</a>
    <a href="{{ url_for('photos') }}">Photos</a>
    <a href="{{ url_for('upload_photo') }}">Upload</a>
    <span class="spacer"></span>
    <a href="{{ url_for('profile', username=session.get('username','')) }}">{{ session.get('username') }}</a>
    <a href="{{ url_for('logout') }}">Log out</a>
  {% else %}
    <span class="spacer"></span>
    <a href="{{ url_for('login') }}">Log in</a>
    <a href="{{ url_for('register') }}">Register</a>
  {% endif %}
</nav>
<div class="container">
  {% for cat, msg in get_flashed_messages(with_categories=True) %}
    <div class="alert alert-{{ cat }}">{{ msg }}</div>
  {% endfor %}
  {% block content %}{% endblock %}
</div>
</body>
</html>
"""


def render(template_str, **ctx):
    """Render a child template inside BASE_HTML."""
    full = BASE_HTML.replace("{% block content %}{% endblock %}", template_str)
    return render_template_string(full, **ctx)


# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


# -- Auth --

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()
        if not username or not password:
            flash("Username and password are required.", "danger")
        else:
            db = get_db()
            existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
            if existing:
                flash("Username already taken.", "danger")
            else:
                db.execute(
                    "INSERT INTO users (username, password, joined) VALUES (?, ?, ?)",
                    (username, password, datetime.utcnow().isoformat())
                )
                db.commit()
                flash("Account created! Please log in.", "success")
                return redirect(url_for("login"))
    template = """
    {% block content %}
    <div class="card" style="max-width:400px;margin:0 auto;">
      <h2>Create an account</h2>
      <form method="post">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Register</button>
      </form>
      <p style="margin-top:12px;">Already have an account? <a href="{{ url_for('login') }}">Log in</a></p>
    </div>
    {% endblock %}
    """
    return render(template)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()
        db = get_db()
        user = db.execute(
            "SELECT * FROM users WHERE username = ? AND password = ?", (username, password)
        ).fetchone()
        if user:
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return redirect(url_for("dashboard"))
        flash("Invalid username or password.", "danger")
    template = """
    {% block content %}
    <div class="card" style="max-width:400px;margin:0 auto;">
      <h2>Log in</h2>
      <form method="post">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log in</button>
      </form>
      <p style="margin-top:12px;">No account? <a href="{{ url_for('register') }}">Register</a></p>
    </div>
    {% endblock %}
    """
    return render(template)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# -- Dashboard --

@app.route("/dashboard")
@login_required
def dashboard():
    db = get_db()
    uid = session["user_id"]

    # Pending incoming requests
    incoming = db.execute("""
        SELECT fr.id, u.username, fr.created_at
        FROM friend_requests fr
        JOIN users u ON u.id = fr.sender_id
        WHERE fr.receiver_id = ? AND fr.status = 'pending'
        ORDER BY fr.created_at DESC
    """, (uid,)).fetchall()

    # Recent photos from friends
    friend_ids = db.execute("""
        SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS fid
        FROM friend_requests
        WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
    """, (uid, uid, uid)).fetchall()
    fids = [row["fid"] for row in friend_ids] + [uid]
    placeholders = ",".join("?" * len(fids))
    recent_photos = db.execute(f"""
        SELECT p.*, u.username
        FROM photos p
        JOIN users u ON u.id = p.uploader_id
        WHERE p.uploader_id IN ({placeholders})
        ORDER BY p.uploaded_at DESC LIMIT 12
    """, fids).fetchall()

    template = """
    {% block content %}
    <h1>Welcome, {{ session.username }}!</h1>

    {% if incoming %}
    <div class="card">
      <h2>Friend Requests ({{ incoming|length }})</h2>
      <ul class="user-list">
      {% for req in incoming %}
        <li>
          <a href="{{ url_for('profile', username=req.username) }}">{{ req.username }}</a>
          <span style="color:#888;font-size:.8rem;">{{ req.created_at[:10] }}</span>
          <span class="spacer" style="flex:1"></span>
          <form method="post" action="{{ url_for('respond_request', req_id=req.id, action='accept') }}" style="display:inline">
            <button class="btn-success" style="padding:4px 12px;font-size:.85rem;">Accept</button>
          </form>
          <form method="post" action="{{ url_for('respond_request', req_id=req.id, action='reject') }}" style="display:inline;margin-left:6px;">
            <button class="btn-danger" style="padding:4px 12px;font-size:.85rem;">Reject</button>
          </form>
        </li>
      {% endfor %}
      </ul>
    </div>
    {% endif %}

    <div class="card">
      <h2>Recent Photos</h2>
      {% if recent_photos %}
      <div class="grid">
        {% for p in recent_photos %}
        <div class="photo-card">
          <img src="{{ url_for('uploaded_file', filename=p.filename) }}" alt="photo">
          <p><strong>{{ p.username }}</strong> &mdash; {{ p.uploaded_at[:10] }}</p>
          {% if p.caption %}<p>{{ p.caption }}</p>{% endif %}
        </div>
        {% endfor %}
      </div>
      {% else %}
      <p>No photos yet. <a href="{{ url_for('upload_photo') }}">Upload one!</a></p>
      {% endif %}
    </div>
    {% endblock %}
    """
    return render(template, incoming=incoming, recent_photos=recent_photos)


# -- Friends --

@app.route("/friends")
@login_required
def friends():
    db = get_db()
    uid = session["user_id"]

    friends_list = db.execute("""
        SELECT u.id, u.username,
               CASE WHEN fr.sender_id = ? THEN 'You sent' ELSE u.username || ' sent' END as direction,
               fr.status
        FROM friend_requests fr
        JOIN users u ON u.id = CASE WHEN fr.sender_id = ? THEN fr.receiver_id ELSE fr.sender_id END
        WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'accepted'
    """, (uid, uid, uid, uid)).fetchall()

    sent = db.execute("""
        SELECT fr.id, u.username, fr.status, fr.created_at
        FROM friend_requests fr
        JOIN users u ON u.id = fr.receiver_id
        WHERE fr.sender_id = ? AND fr.status = 'pending'
    """, (uid,)).fetchall()

    # All other users (potential friends)
    others = db.execute("""
        SELECT id, username FROM users
        WHERE id != ?
          AND id NOT IN (
            SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
            FROM friend_requests
            WHERE sender_id = ? OR receiver_id = ?
          )
    """, (uid, uid, uid, uid)).fetchall()

    template = """
    {% block content %}
    <div class="card">
      <h2>Your Friends</h2>
      {% if friends_list %}
      <ul class="user-list">
        {% for f in friends_list %}
        <li>
          <a href="{{ url_for('profile', username=f.username) }}">{{ f.username }}</a>
        </li>
        {% endfor %}
      </ul>
      {% else %}
      <p>You have no friends yet.</p>
      {% endif %}
    </div>

    {% if sent %}
    <div class="card">
      <h2>Pending Sent Requests</h2>
      <ul class="user-list">
        {% for r in sent %}
        <li>
          <a href="{{ url_for('profile', username=r.username) }}">{{ r.username }}</a>
          <span class="badge badge-pending">pending</span>
          <span style="color:#888;font-size:.8rem;">{{ r.created_at[:10] }}</span>
        </li>
        {% endfor %}
      </ul>
    </div>
    {% endif %}

    <div class="card">
      <h2>Find Friends</h2>
      {% if others %}
      <ul class="user-list">
        {% for u in others %}
        <li>
          <a href="{{ url_for('profile', username=u.username) }}">{{ u.username }}</a>
          <span class="spacer" style="flex:1"></span>
          <form method="post" action="{{ url_for('send_request', receiver_id=u.id) }}">
            <button style="padding:4px 14px;font-size:.85rem;">Add Friend</button>
          </form>
        </li>
        {% endfor %}
      </ul>
      {% else %}
      <p>No new users to add.</p>
      {% endif %}
    </div>
    {% endblock %}
    """
    return render(template, friends_list=friends_list, sent=sent, others=others)


@app.route("/send_request/<int:receiver_id>", methods=["POST"])
@login_required
def send_request(receiver_id):
    db = get_db()
    uid = session["user_id"]
    if receiver_id == uid:
        flash("You cannot send a friend request to yourself.", "warning")
        return redirect(url_for("friends"))
    existing = db.execute(
        "SELECT id FROM friend_requests WHERE sender_id = ? AND receiver_id = ?",
        (uid, receiver_id)
    ).fetchone()
    if existing:
        flash("Friend request already sent.", "info")
    else:
        db.execute(
            "INSERT INTO friend_requests (sender_id, receiver_id, status, created_at) VALUES (?,?,?,?)",
            (uid, receiver_id, "pending", datetime.utcnow().isoformat())
        )
        db.commit()
        flash("Friend request sent!", "success")
    return redirect(url_for("friends"))


@app.route("/respond_request/<int:req_id>/<action>", methods=["POST"])
@login_required
def respond_request(req_id, action):
    if action not in ("accept", "reject"):
        flash("Invalid action.", "danger")
        return redirect(url_for("dashboard"))
    db = get_db()
    uid = session["user_id"]
    req = db.execute(
        "SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?", (req_id, uid)
    ).fetchone()
    if not req:
        flash("Request not found.", "danger")
        return redirect(url_for("dashboard"))
    new_status = "accepted" if action == "accept" else "rejected"
    db.execute("UPDATE friend_requests SET status = ? WHERE id = ?", (new_status, req_id))
    db.commit()
    flash(f"Friend request {new_status}.", "success")
    return redirect(url_for("dashboard"))


# -- Photos --

@app.route("/photos")
@login_required
def photos():
    db = get_db()
    uid = session["user_id"]
    friend_ids = db.execute("""
        SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS fid
        FROM friend_requests
        WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
    """, (uid, uid, uid)).fetchall()
    fids = [row["fid"] for row in friend_ids] + [uid]
    placeholders = ",".join("?" * len(fids))
    all_photos = db.execute(f"""
        SELECT p.*, u.username
        FROM photos p
        JOIN users u ON u.id = p.uploader_id
        WHERE p.uploader_id IN ({placeholders})
        ORDER BY p.uploaded_at DESC
    """, fids).fetchall()

    template = """
    {% block content %}
    <div class="card">
      <h2>Friends Photos</h2>
      <a href="{{ url_for('upload_photo') }}" class="btn" style="margin-bottom:16px;display:inline-block;">+ Upload Photo</a>
      {% if all_photos %}
      <div class="grid">
        {% for p in all_photos %}
        <div class="photo-card">
          <a href="{{ url_for('photo_detail', photo_id=p.id) }}">
            <img src="{{ url_for('uploaded_file', filename=p.filename) }}" alt="photo">
          </a>
          <p><a href="{{ url_for('profile', username=p.username) }}">{{ p.username }}</a> &mdash; {{ p.uploaded_at[:10] }}</p>
          {% if p.caption %}<p>{{ p.caption }}</p>{% endif %}
        </div>
        {% endfor %}
      </div>
      {% else %}
      <p>No photos yet.</p>
      {% endif %}
    </div>
    {% endblock %}
    """
    return render(template, all_photos=all_photos)


@app.route("/upload", methods=["GET", "POST"])
@login_required
def upload_photo():
    db = get_db()
    uid = session["user_id"]

    # Get friends to tag
    friends_list = db.execute("""
        SELECT u.id, u.username
        FROM friend_requests fr
        JOIN users u ON u.id = CASE WHEN fr.sender_id = ? THEN fr.receiver_id ELSE fr.sender_id END
        WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'accepted'
    """, (uid, uid, uid)).fetchall()

    if request.method == "POST":
        caption = request.form.get("caption", "").strip()
        tagged_ids = request.form.getlist("tag_friends")
        file = request.files.get("photo")

        if not file or file.filename == "":
            flash("Please select a photo to upload.", "danger")
        elif not allowed_file(file.filename):
            flash("File type not allowed. Use PNG, JPG, GIF, or WEBP.", "danger")
        else:
            filename = secure_filename(file.filename)
            # Prefix with timestamp to avoid collisions
            unique_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{filename}"
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], unique_name))

            cur = db.execute(
                "INSERT INTO photos (uploader_id, filename, caption, uploaded_at) VALUES (?,?,?,?)",
                (uid, unique_name, caption, datetime.utcnow().isoformat())
            )
            photo_id = cur.lastrowid

            # Tag friends
            for fid in tagged_ids:
                try:
                    db.execute("INSERT INTO photo_tags (photo_id, user_id) VALUES (?,?)", (photo_id, int(fid)))
                except Exception:
                    pass

            db.commit()
            flash("Photo uploaded successfully!", "success")
            return redirect(url_for("photo_detail", photo_id=photo_id))

    template = """
    {% block content %}
    <div class="card" style="max-width:560px;margin:0 auto;">
      <h2>Upload a Photo</h2>
      <form method="post" enctype="multipart/form-data">
        <label style="font-weight:600;display:block;margin-bottom:4px;">Photo *</label>
        <input type="file" name="photo" accept="image/*" required>
        <label style="font-weight:600;display:block;margin-bottom:4px;">Caption</label>
        <textarea name="caption" rows="3" placeholder="Say something about this photo..."></textarea>
        {% if friends_list %}
        <label style="font-weight:600;display:block;margin-bottom:4px;">Tag Friends</label>
        {% for f in friends_list %}
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-weight:normal;">
            <input type="checkbox" name="tag_friends" value="{{ f.id }}"> {{ f.username }}
          </label>
        {% endfor %}
        {% endif %}
        <br>
        <button type="submit">Upload</button>
        <a href="{{ url_for('photos') }}" class="btn btn-secondary" style="margin-left:8px;">Cancel</a>
      </form>
    </div>
    {% endblock %}
    """
    return render(template, friends_list=friends_list)


@app.route("/photo/<int:photo_id>")
@login_required
def photo_detail(photo_id):
    db = get_db()
    photo = db.execute(
        "SELECT p.*, u.username FROM photos p JOIN users u ON u.id = p.uploader_id WHERE p.id = ?",
        (photo_id,)
    ).fetchone()
    if not photo:
        flash("Photo not found.", "danger")
        return redirect(url_for("photos"))

    tagged = db.execute("""
        SELECT u.username FROM photo_tags pt
        JOIN users u ON u.id = pt.user_id
        WHERE pt.photo_id = ?
    """, (photo_id,)).fetchall()

    template = """
    {% block content %}
    <div class="card">
      <img src="{{ url_for('uploaded_file', filename=photo.filename) }}"
           style="max-width:100%;border-radius:8px;" alt="photo">
      <h3 style="margin-top:12px;">{{ photo.username }}</h3>
      <p style="color:#888;font-size:.85rem;">{{ photo.uploaded_at[:16].replace('T',' ') }}</p>
      {% if photo.caption %}<p style="margin-top:8px;">{{ photo.caption }}</p>{% endif %}
      {% if tagged %}
      <p style="margin-top:10px;"><strong>Tagged:</strong>
        {% for t in tagged %}
          <a href="{{ url_for('profile', username=t.username) }}">{{ t.username }}</a>{% if not loop.last %}, {% endif %}
        {% endfor %}
      </p>
      {% endif %}
      <a href="{{ url_for('photos') }}" class="btn btn-secondary" style="margin-top:16px;">Back to Photos</a>
      {% if photo.uploader_id == session.user_id %}
      <form method="post" action="{{ url_for('delete_photo', photo_id=photo.id) }}"
            style="display:inline;margin-left:8px;"
            onsubmit="return confirm('Delete this photo?');">
        <button class="btn-danger" style="margin-top:16px;">Delete</button>
      </form>
      {% endif %}
    </div>
    {% endblock %}
    """
    return render(template, photo=photo, tagged=tagged)


@app.route("/photo/<int:photo_id>/delete", methods=["POST"])
@login_required
def delete_photo(photo_id):
    db = get_db()
    uid = session["user_id"]
    photo = db.execute("SELECT * FROM photos WHERE id = ? AND uploader_id = ?", (photo_id, uid)).fetchone()
    if not photo:
        flash("Photo not found or permission denied.", "danger")
        return redirect(url_for("photos"))
    # Delete file from disk
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], photo["filename"])
    if os.path.exists(filepath):
        os.remove(filepath)
    db.execute("DELETE FROM photo_tags WHERE photo_id = ?", (photo_id,))
    db.execute("DELETE FROM photos WHERE id = ?", (photo_id,))
    db.commit()
    flash("Photo deleted.", "success")
    return redirect(url_for("photos"))


# -- Profile --

@app.route("/profile/<username>")
@login_required
def profile(username):
    db = get_db()
    uid = session["user_id"]
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if not user:
        flash("User not found.", "danger")
        return redirect(url_for("dashboard"))

    # Friendship status between current user and profile user
    rel = db.execute("""
        SELECT * FROM friend_requests
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    """, (uid, user["id"], user["id"], uid)).fetchone()

    photos = db.execute(
        "SELECT * FROM photos WHERE uploader_id = ? ORDER BY uploaded_at DESC",
        (user["id"],)
    ).fetchall()

    template = """
    {% block content %}
    <div class="card">
      <h2>{{ user.username }}</h2>
      <p style="color:#888;font-size:.85rem;">Joined {{ user.joined[:10] }}</p>

      {% if user.id != session.user_id %}
        {% if not rel %}
          <form method="post" action="{{ url_for('send_request', receiver_id=user.id) }}" style="margin-top:12px;">
            <button>Add Friend</button>
          </form>
        {% elif rel.status == 'pending' %}
          {% if rel.sender_id == session.user_id %}
            <p style="margin-top:12px;">Friend request <span class="badge badge-pending">pending</span></p>
          {% else %}
            <form method="post" action="{{ url_for('respond_request', req_id=rel.id, action='accept') }}" style="margin-top:12px;display:inline;">
              <button class="btn-success">Accept Request</button>
            </form>
            <form method="post" action="{{ url_for('respond_request', req_id=rel.id, action='reject') }}" style="margin-top:12px;display:inline;margin-left:8px;">
              <button class="btn-danger">Reject</button>
            </form>
          {% endif %}
        {% elif rel.status == 'accepted' %}
          <p style="margin-top:12px;"><span class="badge badge-accepted">Friends</span></p>
        {% else %}
          <p style="margin-top:12px;"><span class="badge badge-rejected">Not friends</span></p>
        {% endif %}
      {% endif %}
    </div>

    <div class="card">
      <h2>{{ user.username }}'s Photos ({{ photos|length }})</h2>
      {% if photos %}
      <div class="grid">
        {% for p in photos %}
        <div class="photo-card">
          <a href="{{ url_for('photo_detail', photo_id=p.id) }}">
            <img src="{{ url_for('uploaded_file', filename=p.filename) }}" alt="photo">
          </a>
          {% if p.caption %}<p>{{ p.caption }}</p>{% endif %}
          <p style="color:#888;font-size:.8rem;">{{ p.uploaded_at[:10] }}</p>
        </div>
        {% endfor %}
      </div>
      {% else %}
      <p>No photos uploaded yet.</p>
      {% endif %}
    </div>
    {% endblock %}
    """
    return render(template, user=user, rel=rel, photos=photos)


# -- Static uploads --

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    with app.app_context():
        init_db()
    print("FriendRequest App running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
