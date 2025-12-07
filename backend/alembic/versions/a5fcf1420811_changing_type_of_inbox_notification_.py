"""changing type of inbox notification from float to int

Revision ID: a5fcf1420811
Revises: fe25b2815709
Create Date: 2025-12-06 17:55:32.658163

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5fcf1420811'
down_revision: Union[str, Sequence[str], None] = 'fe25b2815709'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'inbox',
        'notification',
        type_=sa.Integer(),
        postgresql_using='notification::integer'
    )


def downgrade() -> None:
    op.alter_column(
        'inbox',
        'notification',
        type_=sa.Float(),
        postgresql_using='notification::float'
    )