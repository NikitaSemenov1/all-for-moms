# coding: utf-8

from typing import Dict, List  # noqa: F401


from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from app.models.extra_models import TokenModel  # noqa: F401
from app.models.shopping_list_item import ShoppingListItem


router = APIRouter()


@router.get(
    "/shopping_list",
    responses={
        200: {"model": List[ShoppingListItem], "description": "successfult request"},
    },
    tags=["shopping list"],
    response_model_by_alias=True,
)
async def shopping_list_get(
) -> List[ShoppingListItem]:
    return []
    # raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/shopping_list/{item_id}/complete",
    responses={
        200: {"model": List[ShoppingListItem], "description": "Successful operation"},
    },
    tags=["shopping list"],
    response_model_by_alias=True,
)
async def shopping_list_item_id_complete_post(
    item_id: str = Path(..., description="ID of shopping list item to complete"),
) -> List[ShoppingListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/shopping_list/{item_id}/reserve",
    responses={
        200: {"model": List[ShoppingListItem], "description": "Successful operation"},
    },
    tags=["shopping list"],
    response_model_by_alias=True,
)
async def shopping_list_item_id_reserve_post(
    item_id: str = Path(..., description="ID of shopping list item to reserve"),
) -> List[ShoppingListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/shopping_list",
    responses={
        200: {"model": List[ShoppingListItem], "description": "Successful operation"},
    },
    tags=["shopping list"],
    response_model_by_alias=True,
)
async def shopping_list_post(
    shopping_list_item: ShoppingListItem = Body(None, description=""),
) -> List[ShoppingListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.put(
    "/shopping_list",
    responses={
        200: {"model": List[ShoppingListItem], "description": "Successful operation"},
    },
    tags=["shopping list"],
    response_model_by_alias=True,
)
async def shopping_list_put(
    shopping_list_item: ShoppingListItem = Body(None, description=""),
) -> List[ShoppingListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")
