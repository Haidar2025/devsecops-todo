"""
Todo App - Flask REST API
DevSecOps Assignment
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Database file path
DB_FILE = 'backend/tasks.json'

def load_tasks():
    """Load tasks from JSON file"""
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_tasks(tasks):
    """Save tasks to JSON file"""
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)

def validate_task(data):
    """Validate task data"""
    errors = []
    
    if not data.get('title') or not data['title'].strip():
        errors.append("Title is required and cannot be empty")
    
    if 'status' in data and data['status'] not in ['ej påbörjad', 'pågående', 'klar']:
        errors.append("Status must be 'ej påbörjad', 'pågående', or 'klar'")
    
    if 'priority' in data and data['priority'] not in ['låg', 'medel', 'hög']:
        errors.append("Priority must be 'låg', 'medel', or 'hög'")
    
    return errors

# Initialize with seed data if file doesn't exist
if not os.path.exists(DB_FILE):
    seed_tasks = [
        {
            "id": 1,
            "title": "Slutför DevOps-uppgift",
            "description": "Implementera alla tester och CI/CD pipeline",
            "status": "pågående",
            "priority": "hög",
            "dueDate": "2025-12-20"
        },
        {
            "id": 2,
            "title": "Lär dig GitHub Actions",
            "description": "Förstå hur workflows fungerar",
            "status": "klar",
            "priority": "medel",
            "dueDate": "2025-12-10"
        }
    ]
    save_tasks(seed_tasks)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """GET - Hämta alla tasks"""
    tasks = load_tasks()
    return jsonify(tasks), 200

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """GET - Hämta en specifik task"""
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    
    return jsonify(task), 200

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """POST - Skapa ny task"""
    data = request.get_json()
    
    # Validate input
    errors = validate_task(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    tasks = load_tasks()
    
    # Generate new ID
    new_id = max([t['id'] for t in tasks], default=0) + 1
    
    # Create new task
    new_task = {
        "id": new_id,
        "title": data['title'].strip(),
        "description": data.get('description', ''),
        "status": data.get('status', 'ej påbörjad'),
        "priority": data.get('priority', 'medel'),
        "dueDate": data.get('dueDate', '')
    }
    
    tasks.append(new_task)
    save_tasks(tasks)
    
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """PUT - Uppdatera task"""
    data = request.get_json()
    
    # Validate input
    errors = validate_task(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    
    # Update task
    task['title'] = data['title'].strip()
    task['description'] = data.get('description', task['description'])
    task['status'] = data.get('status', task['status'])
    task['priority'] = data.get('priority', task['priority'])
    task['dueDate'] = data.get('dueDate', task['dueDate'])
    
    save_tasks(tasks)
    
    return jsonify(task), 200

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """DELETE - Ta bort task"""
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    
    tasks = [t for t in tasks if t['id'] != task_id]
    save_tasks(tasks)
    
    return '', 204

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
