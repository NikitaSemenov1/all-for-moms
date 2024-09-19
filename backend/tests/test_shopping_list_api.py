# coding: utf-8

from fastapi.testclient import TestClient


from app.models.shopping_list_item import ShoppingListItem  # noqa: F401


def test_shopping_list_get(client: TestClient):
    """Test case for shopping_list_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/shopping_list",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_shopping_list_item_id_complete_post(client: TestClient):
    """Test case for shopping_list_item_id_complete_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/shopping_list/{item_id}/complete".format(item_id='item_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_shopping_list_item_id_reserve_post(client: TestClient):
    """Test case for shopping_list_item_id_reserve_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/shopping_list/{item_id}/reserve".format(item_id='item_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_shopping_list_post(client: TestClient):
    """Test case for shopping_list_post

    
    """
    shopping_list_item = {"reservator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","creator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","description":"description","id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","title":"title","status":"reserved"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/shopping_list",
    #    headers=headers,
    #    json=shopping_list_item,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_shopping_list_put(client: TestClient):
    """Test case for shopping_list_put

    
    """
    shopping_list_item = {"reservator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","creator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","description":"description","id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","title":"title","status":"reserved"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/shopping_list",
    #    headers=headers,
    #    json=shopping_list_item,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

