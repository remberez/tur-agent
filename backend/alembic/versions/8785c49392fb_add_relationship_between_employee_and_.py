"""add relationship between employee and user

Revision ID: 8785c49392fb
Revises: ed0a15432624
Create Date: 2025-05-02 22:32:23.722191

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8785c49392fb'
down_revision: Union[str, None] = 'ed0a15432624'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('employees', sa.Column('user_id', sa.Integer(), nullable=True))

    # Именованные ограничения
    op.create_unique_constraint('uq_employees_user_id', 'employees', ['user_id'])
    op.create_foreign_key(
        'fk_employees_user_id_clients',
        'employees', 'clients',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_column('employees', 'full_name')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('employees', sa.Column('full_name', sa.String(), nullable=False))

    op.drop_constraint('fk_employees_user_id_clients', 'employees', type_='foreignkey')
    op.drop_constraint('uq_employees_user_id', 'employees', type_='unique')

    op.drop_column('employees', 'user_id')
