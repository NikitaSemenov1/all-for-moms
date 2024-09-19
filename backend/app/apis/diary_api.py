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
from app.models.diary_note import DiaryNote


router = APIRouter()


@router.get(
    "/diary",
    responses={
        200: {"model": List[DiaryNote], "description": "Successful operation"},
    },
    tags=["diary"],
    response_model_by_alias=True,
)
async def diary_get(
) -> List[DiaryNote]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/diary",
    responses={
        200: {"model": List[DiaryNote], "description": "Successful operation"},
    },
    tags=["diary"],
    response_model_by_alias=True,
)
async def diary_post(
    diary_note: DiaryNote = Body(None, description=""),
) -> List[DiaryNote]:
    raise HTTPException(status_code=500, detail="Not implemented")
