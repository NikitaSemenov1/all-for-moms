# coding: utf-8

from fastapi.testclient import TestClient


from app.models.award import Award  # noqa: F401
from app.models.family_get200_response import FamilyGet200Response  # noqa: F401


def test_family_awards_award_id_assignments_assignment_id_approve_post(client: TestClient):
    """Test case for family_awards_award_id_assignments_assignment_id_approve_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/family/awards/{award_id}/assignments/{assignment_id}/approve".format(award_id='award_id_example', assignment_id='assignment_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_family_awards_award_id_delete(client: TestClient):
    """Test case for family_awards_award_id_delete

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/family/awards/{award_id}".format(award_id='award_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_family_awards_award_id_request_post(client: TestClient):
    """Test case for family_awards_award_id_request_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/family/awards/{award_id}/request".format(award_id='award_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_family_awards_get(client: TestClient):
    """Test case for family_awards_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/family/awards",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_family_awards_post(client: TestClient):
    """Test case for family_awards_post

    
    """
    award = {"cost":500,"assignments":[{"id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","assignee_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","status":"approved"},{"id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","assignee_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","status":"approved"}],"description":"Поход в кино на сеанс по выбору","id":"4b4fcc35-5844-42e9-93b9-76b3260505da","title":"Сходить в кино"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/family/awards",
    #    headers=headers,
    #    json=award,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_family_get(client: TestClient):
    """Test case for family_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/family",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

