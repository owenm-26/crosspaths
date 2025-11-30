import bcrypt

class PasswordHash:
    """Object wrapper representing a hashed password."""

    def __init__(self, hashed: str):
        if isinstance(hashed, bytes):
            hashed = hashed.decode("utf-8")
        self.hash = hashed

    @staticmethod
    def new(password: str, rounds: int = 12) -> "PasswordHash":
        """Create a new hash from a plaintext password."""
        if not isinstance(password, str):
            raise TypeError("Password must be a string")

        salt = bcrypt.gensalt(rounds)
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return PasswordHash(hashed.decode("utf-8"))

    def verify(self, password: str) -> bool:
        """Check whether a plaintext password matches this hash."""
        if not isinstance(password, str):
            return False

        return bcrypt.checkpw(password.encode("utf-8"), self.hash.encode("utf-8"))

    def __repr__(self):
        return f"PasswordHash(***)"
