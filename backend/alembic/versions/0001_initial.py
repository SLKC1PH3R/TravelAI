"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-26

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("anonymous_uuid", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("photo_consent", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("ix_users_anonymous_uuid", "users", ["anonymous_uuid"], unique=True)

    op.create_table(
        "trips",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("country", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("started_at", sa.DateTime(), nullable=False),
        sa.Column("ended_at", sa.DateTime(), nullable=True),
        sa.Column("title", sa.String(), nullable=True),
    )

    op.create_table(
        "monuments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("trip_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("trips.id"), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("visited_at", sa.DateTime(), nullable=False),
        sa.Column("is_favorite", sa.Boolean(), nullable=False, server_default=sa.false()),
    )

    op.create_table(
        "photos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("monument_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("monuments.id"), nullable=False),
        sa.Column("filename", sa.String(), nullable=False),
        sa.Column("thumbnail_filename", sa.String(), nullable=True),
        sa.Column("taken_at", sa.DateTime(), nullable=False),
        sa.Column("stored", sa.Boolean(), nullable=False, server_default=sa.false()),
    )

    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("monument_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("monuments.id"), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("conversations")
    op.drop_table("photos")
    op.drop_table("monuments")
    op.drop_table("trips")
    op.drop_index("ix_users_anonymous_uuid", table_name="users")
    op.drop_table("users")
