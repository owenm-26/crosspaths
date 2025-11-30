from sqlalchemy.types import TypeDecorator, Text
from .hashing import PasswordHash

class Password(TypeDecorator):
    """SQLAlchemy-aware type that stores PasswordHash objects."""
    impl = Text
    cache_ok = True

    def __init__(self, rounds=12, **kwds):
        self.rounds = rounds
        super().__init__(**kwds)

    def process_bind_param(self, value, dialect):
        return self._convert(value).hash

    def process_result_value(self, value, dialect):
        if value is not None:
            return PasswordHash(value)

    def validator(self, password):
        return self._convert(password)

    def _convert(self, value):
        if isinstance(value, PasswordHash):
            return value
        if isinstance(value, str):  # Python 3 safe
            return PasswordHash.new(value, self.rounds)
        if value is not None:
            raise TypeError(f"Cannot convert {type(value)} to PasswordHash")
        return value
