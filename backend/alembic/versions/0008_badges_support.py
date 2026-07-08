"""add is_unesco to monuments and first_carnet_export_at to users

Revision ID: 0008
Revises: 0007
Create Date: 2026-07-08

"""
from alembic import op
import sqlalchemy as sa

revision = "0008"
down_revision = "0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "monuments",
        sa.Column("is_unesco", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column("users", sa.Column("first_carnet_export_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "first_carnet_export_at")
    op.drop_column("monuments", "is_unesco")
