"""Add uid_in_auth and avatar to users, clear existing data first

Revision ID: 74d93c8de581
Revises: None
Create Date: 2025-05-20 23:27:58.986697

"""
from alembic import op
import sqlalchemy as sa


revision = '74d93c8de581'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # 新增欄位，這裡以 VARCHAR 代表字串欄位
    # op.add_column('users', sa.Column('uid_in_auth', sa.String(length=255), nullable=True))
    # op.add_column('users', sa.Column('avatar', sa.String(length=255), nullable=True))


def downgrade():
    # 回退時刪除欄位
    # op.drop_column('users', 'avatar')
    # op.drop_column('users', 'uid_in_auth')
