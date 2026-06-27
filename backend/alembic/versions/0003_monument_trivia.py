"""add trivia_question and trivia_answer to monuments

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-27

"""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("monuments", sa.Column("trivia_question", sa.Text(), nullable=True))
    op.add_column("monuments", sa.Column("trivia_answer", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("monuments", "trivia_answer")
    op.drop_column("monuments", "trivia_question")
