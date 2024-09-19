# coding: utf-8

from fastapi.testclient import TestClient


from app.models.diary_note import DiaryNote  # noqa: F401


def test_diary_get(client: TestClient):
    """Test case for diary_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/diary",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_diary_post(client: TestClient):
    """Test case for diary_post

    
    """
    diary_note = {"date":"2000-01-23T04:56:07.000+00:00","text":"Сегодня я поднял жопу с дивана и помыл посуду"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/diary",
    #    headers=headers,
    #    json=diary_note,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

