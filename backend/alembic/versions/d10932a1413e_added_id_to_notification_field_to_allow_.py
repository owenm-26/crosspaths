"""added id to notification field to allow multiple of the same notifications between the same two users

Revision ID: d10932a1413e
Revises: b88df682805a
Create Date: 2025-12-07 17:06:36.064624

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd10932a1413e'
down_revision: Union[str, Sequence[str], None] = 'b88df682805a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # 1. Add id column as nullable
    op.add_column("inbox", sa.Column("id", sa.Integer(), nullable=True))

    # 2. Create sequence and backfill
    op.execute("CREATE SEQUENCE IF NOT EXISTS inbox_id_seq;")
    op.execute("UPDATE inbox SET id = nextval('inbox_id_seq');")

    # 3. Make id auto-incrementing
    op.execute("ALTER TABLE inbox ALTER COLUMN id SET DEFAULT nextval('inbox_id_seq');")

    # 4. Drop old PK
    op.drop_constraint("inbox_pkey", "inbox", type_="primary")

    # 5. Add new PK
    op.create_primary_key("pk_inbox", "inbox", ["id"])

    # 6. Make id NOT NULL
    op.alter_column("inbox", "id", nullable=False)


def downgrade():
    op.drop_constraint("pk_inbox", "inbox", type_="primary")
    op.drop_column("inbox", "id")

