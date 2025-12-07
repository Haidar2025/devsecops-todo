"""
Unit tests for Flask Todo API
Minimum 5 tests required for G, 10+ for VG
"""
import pytest
import json
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, save_tasks, load_tasks, validate_task

@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_tasks():
    """Sample tasks for testing"""
    return [
        {
            "id": 1,
            "title": "Test Task 1",
            "description": "Test description",
            "status": "pågående",
            "priority": "hög",
            "dueDate": "2025-12-20"
        },
        {
            "id": 2,
            "title": "Test Task 2",
            "description": "Another test",
            "status": "ej påbörjad",
            "priority": "låg",
            "dueDate": "2025-12-25"
        }
    ]

def test_health_check(client):
    """Test 1: Health check endpoint returns 200"""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_get_all_tasks(client):
    """Test 2: GET /api/tasks returns task list"""
    response = client.get('/api/tasks')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

def test_get_task_by_id(client, sample_tasks):
    """Test 3: GET /api/tasks/:id returns specific task"""
    # Setup
    save_tasks(sample_tasks)
    
    response = client.get('/api/tasks/1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == 1
    assert data['title'] == "Test Task 1"

def test_get_nonexistent_task(client):
    """Test 4: GET /api/tasks/:id returns 404 for non-existent task"""
    response = client.get('/api/tasks/99999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data

def test_create_task(client):
    """Test 5: POST /api/tasks creates new task and returns 201"""
    new_task = {
        "title": "New Test Task",
        "description": "Created via test",
        "status": "ej påbörjad",
        "priority": "medel",
        "dueDate": "2025-12-30"
    }
    
    response = client.post('/api/tasks',
                          data=json.dumps(new_task),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == "New Test Task"
    assert 'id' in data

def test_create_task_validation_error(client):
    """Test 6: POST /api/tasks returns 400 for invalid data"""
    invalid_task = {
        "title": "",  # Empty title should fail
        "description": "Invalid task"
    }
    
    response = client.post('/api/tasks',
                          data=json.dumps(invalid_task),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data

def test_update_task(client, sample_tasks):
    """Test 7: PUT /api/tasks/:id updates task"""
    # Setup
    save_tasks(sample_tasks)
    
    updated_data = {
        "title": "Updated Task",
        "description": "Updated description",
        "status": "klar",
        "priority": "låg",
        "dueDate": "2025-12-31"
    }
    
    response = client.put('/api/tasks/1',
                         data=json.dumps(updated_data),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == "Updated Task"
    assert data['status'] == "klar"

def test_update_nonexistent_task(client):
    """Test 8: PUT /api/tasks/:id returns 404 for non-existent task"""
    updated_data = {
        "title": "Updated Task",
        "status": "klar"
    }
    
    response = client.put('/api/tasks/99999',
                         data=json.dumps(updated_data),
                         content_type='application/json')
    
    assert response.status_code == 404

def test_delete_task(client, sample_tasks):
    """Test 9: DELETE /api/tasks/:id removes task"""
    # Setup
    save_tasks(sample_tasks)
    
    response = client.delete('/api/tasks/1')
    assert response.status_code == 204
    
    # Verify task is deleted
    tasks = load_tasks()
    assert len(tasks) == 1
    assert tasks[0]['id'] == 2

def test_delete_nonexistent_task(client):
    """Test 10: DELETE /api/tasks/:id returns 404 for non-existent task"""
    response = client.delete('/api/tasks/99999')
    assert response.status_code == 404

def test_validate_task_function():
    """Test 11: validate_task function works correctly"""
    # Valid task
    valid_task = {
        "title": "Valid Task",
        "status": "pågående",
        "priority": "hög"
    }
    errors = validate_task(valid_task)
    assert len(errors) == 0
    
    # Invalid status
    invalid_task = {
        "title": "Test",
        "status": "invalid_status"
    }
    errors = validate_task(invalid_task)
    assert len(errors) > 0
