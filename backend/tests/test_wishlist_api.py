# coding: utf-8

from fastapi.testclient import TestClient


from app.models.wish_list_item import WishListItem  # noqa: F401


def test_wishlist_get(client: TestClient):
    """Test case for wishlist_get

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/wishlist",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_wishlist_item_id_reserve_post(client: TestClient):
    """Test case for wishlist_item_id_reserve_post

    
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/wishlist/{item_id}/reserve".format(item_id='item_id_example'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_wishlist_post(client: TestClient):
    """Test case for wishlist_post

    
    """
    wish_list_item = {"reservator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","owner_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","description":"description","id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","title":"title","status":"reserved"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/wishlist",
    #    headers=headers,
    #    json=wish_list_item,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_wishlist_put(client: TestClient):
    """Test case for wishlist_put

    
    """
    wish_list_item = {"reservator_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","owner_id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","description":"description","id":"046b6c7f-0b8a-43b9-b35d-6489e6daee91","title":"title","status":"reserved"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/wishlist",
    #    headers=headers,
    #    json=wish_list_item,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

