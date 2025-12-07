import pydantic
class FriendshipPayload(pydantic.BaseModel):
    user_phone: str
    friend_phone: str

class FriendRequestPayload(pydantic.BaseModel):
    from_phone: str
    to_phone: str