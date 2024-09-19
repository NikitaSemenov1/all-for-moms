# coding: utf-8

from fastapi.testclient import TestClient


from app.models.task import Task  # noqa: F401


def test_tasks_get(client: TestClient):
    """Test case for tasks_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/tasks",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_tasks_post(client: TestClient):
    """Test case for tasks_post

    
    """
    task = {"assignments":[{"assignee_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","status":"approved"},{"assignee_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","status":"approved"}],"assigner_id":"d00782d0-1e29-43e7-964b-e396c59c41b5","start":"2000-01-23T04:56:07.000+00:00","description":"Требуется поднять жопу с дивана и помыть посуду","end":"2000-01-23T04:56:07.000+00:00","id":"a69f868a-fe8f-4c11-a0d4-51451769fd37","title":"Помыть посуду"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/tasks",
    #    headers=headers,
    #    json=task,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_tasks_task_id_approve_post(client: TestClient):
    """Test case for tasks_task_id_approve_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/tasks/{task_id}/approve".format(task_id='task_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_tasks_task_id_complete_post(client: TestClient):
    """Test case for tasks_task_id_complete_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/tasks/{task_id}/complete".format(task_id='task_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

