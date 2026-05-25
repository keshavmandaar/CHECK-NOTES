from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Create database table
def init_db():
    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

init_db()

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# Get all notes
@app.route('/notes', methods=['GET'])
def get_notes():
    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM notes ORDER BY id DESC')
    notes = cursor.fetchall()

    conn.close()

    notes_list = [
        {"id": note[0], "content": note[1]}
        for note in notes
    ]

    return jsonify(notes_list)

# Save note
@app.route('/notes', methods=['POST'])
def add_note():
    data = request.json
    content = data.get('content')

    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()

    cursor.execute(
        'INSERT INTO notes (content) VALUES (?)',
        (content,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Note saved successfully"})

if __name__ == '__main__':
    app.run(debug=True)