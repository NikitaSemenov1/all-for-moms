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
from app.models.wish_list_item import WishListItem


router = APIRouter()



@router.get(
    "/wishlist",
    responses={
        200: {"model": List[WishListItem], "description": "successfult request"},
    },
    tags=["wishlist"],
    response_model_by_alias=True,
)
async def wishlist_get(
) -> List[WishListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/wishlist/{item_id}/reserve",
    responses={
        200: {"model": List[WishListItem], "description": "Successful operation"},
    },
    tags=["wishlist"],
    response_model_by_alias=True,
)
async def wishlist_item_id_reserve_post(
    item_id: str = Path(..., description="ID of wishlist item to reserve"),
) -> List[WishListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/wishlist",
    responses={
        200: {"model": List[WishListItem], "description": "Successful operation"},
    },
    tags=["wishlist"],
    response_model_by_alias=True,
)
async def wishlist_post(
    wish_list_item: WishListItem = Body(None, description=""),
) -> List[WishListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.put(
    "/wishlist",
    responses={
        200: {"model": List[WishListItem], "description": "Successful operation"},
    },
    tags=["wishlist"],
    response_model_by_alias=True,
)
async def wishlist_put(
    wish_list_item: WishListItem = Body(None, description=""),
) -> List[WishListItem]:
    raise HTTPException(status_code=500, detail="Not implemented")
