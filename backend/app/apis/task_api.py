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
from app.models.task import Task


router = APIRouter()



@router.get(
    "/tasks",
    responses={
        200: {"model": List[Task], "description": "successfult request"},
        403: {"description": "Unauthorized request"},
    },
    tags=["task"],
    response_model_by_alias=True,
)
async def tasks_get(
) -> List[Task]:
    """Get tasks availiable for the user"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/tasks",
    responses={
        200: {"model": List[Task], "description": "successfult request"},
    },
    tags=["task"],
    response_model_by_alias=True,
)
async def tasks_post(
    task: Task = Body(None, description=""),
) -> List[Task]:
    """Create tasks, user must have &#39;parent&#39; role in family to assign the task to other member"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/tasks/{task_id}/approve",
    responses={
        200: {"model": Task, "description": "successfult request"},
        400: {"description": "bad request"},
        404: {"description": "task not found"},
    },
    tags=["task"],
    response_model_by_alias=True,
)
async def tasks_task_id_approve_post(
    task_id: str = Path(..., description="ID of task to approve"),
) -> Task:
    """Approve task (if I am a parent, task is created by myself and assignee has completed it)"""
    raise HTTPException(status_code=500, detail="Not implemented")


@router.post(
    "/tasks/{task_id}/complete",
    responses={
        200: {"model": Task, "description": "successfult request"},
        400: {"description": "bad request"},
        404: {"description": "task not found"},
    },
    tags=["task"],
    response_model_by_alias=True,
)
async def tasks_task_id_complete_post(
    task_id: str = Path(..., description="ID of task to complete"),
) -> Task:
    """Complete task (mark completed, if assigned to me)"""
    raise HTTPException(status_code=500, detail="Not implemented")
