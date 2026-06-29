"""add avatar_url and snap_pseudo to users

Revision ID: 0004
Revises: 0003
Create Date: 2026-06-29

"""
from alembic import op
import sqlalchemy as sa

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("avatar_url", sa.String(), nullable=True))
    op.add_column("users", sa.Column("snap_pseudo", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "snap_pseudo")
    op.drop_column("users", "avatar_url")
