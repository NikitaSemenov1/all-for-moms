from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
import uuid

Base = declarative_base()


class TaskAssignmentStatus(enum.Enum):
    created = "created"
    reserved = "reserved"
    completed = "completed"


class WishListItemStatus(enum.Enum):
    hidden = "hidden"
    public = "public"
    reserved = "reserved"
    archived = "archived"


class ShoppingListItemStatus(enum.Enum):
    created = "created"
    reserved = "reserved"
    completed = "completed"


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assigner_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start = Column(DateTime, nullable=True)
    end = Column(DateTime, nullable=True)
    assignments = relationship("TaskAssignment", back_populates="task")


class TaskAssignment(Base):
    __tablename__ = 'task_assignments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignee_id = Column(UUID(as_uuid=True), nullable=False)
    status = Column(Enum(TaskAssignmentStatus), nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id'), nullable=False)
    task = relationship("Task", back_populates="assignments")


class Award(Base):
    __tablename__ = 'awards'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    cost = Column(Integer, nullable=False)
    assignments = relationship("AwardAssignment", back_populates="award")


class AwardAssignment(Base):
    __tablename__ = 'award_assignments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignee_id = Column(UUID(as_uuid=True), nullable=False)
    status = Column(String, nullable=False)
    award_id = Column(UUID(as_uuid=True), ForeignKey('awards.id'), nullable=False)
    award = relationship("Award", back_populates="assignments")


class ShoppingListItem(Base):
    __tablename__ = 'shopping_list_items'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), nullable=False)
    reservator_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(ShoppingListItemStatus), nullable=False)


class WishListItem(Base):
    __tablename__ = 'wishlist_items'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    reservator_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(WishListItemStatus), nullable=False)
