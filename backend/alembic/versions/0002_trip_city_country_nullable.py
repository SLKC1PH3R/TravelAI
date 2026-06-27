"""make trips.country and trips.city nullable

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-27

"""
from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("trips", "country", existing_type=sa.String(), nullable=True)
    op.alter_column("trips", "city", existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    op.alter_column("trips", "city", existing_type=sa.String(), nullable=False)
    op.alter_column("trips", "country", existing_type=sa.String(), nullable=False)
