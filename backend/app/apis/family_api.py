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
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.models.extra_models import TokenModel  # noqa: F401
from app.models.award import Award
from app.models.family_get200_response import FamilyGet200Response

from app import data

router = APIRouter()


@router.post(
    "/family/awards/{award_id}/assignments/{assignment_id}/approve",
    responses={
        200: {"model": List[Award], "description": "successfult request"},
        400: {"description": "bad request"},
        404: {"description": "award not found"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_awards_award_id_assignments_assignment_id_approve_post(
    award_id: str = Path(..., description="ID of award to request"),
    assignment_id: str = Path(..., description="ID of reqeusted award assignment"),
) -> List[Award]:
    """Approve requested award"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.delete(
    "/family/awards/{award_id}",
    responses={
        200: {"model": List[Award], "description": "successfult request"},
        400: {"description": "bad request"},
        404: {"description": "award not found"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_awards_award_id_delete(
    award_id: str = Path(..., description="ID of award to remove, user must be parent"),
) -> List[Award]:
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/family/awards/{award_id}/request",
    responses={
        200: {"model": List[Award], "description": "successfult request"},
        400: {"description": "bad request"},
        404: {"description": "award not found"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_awards_award_id_request_post(
    award_id: str = Path(..., description="ID of award to request"),
) -> List[Award]:
    """Reqest award"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.get(
    "/family/awards",
    responses={
        200: {"model": List[Award], "description": "successfult request"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_awards_get(
) -> List[Award]:
    """Get awards table"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/family/awards",
    responses={
        200: {"model": List[Award], "description": "successfult request"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_awards_post(
    award: Award = Body(None, description=""),
) -> List[Award]:
    """Add award to awards table, user must have &#39;parent&#39; role in family"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.get(
    "/family",
    responses={
        200: {"model": FamilyGet200Response, "description": "successfult request"},
    },
    tags=["family"],
    response_model_by_alias=True,
)
async def family_get(db: Session = Depends(get_db)) -> FamilyGet200Response:
    response = db.query(data.models.Family).first()

    return response
