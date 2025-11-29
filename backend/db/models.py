from sqlalchemy import String, DateTime, Float, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class User(Base):
    __tablename__ = "users"
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    phone_number: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    # email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    home_location: Mapped[str] = mapped_column(String, nullable=False) 
    curr_location: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    notif_enabled: Mapped[float] = mapped_column(Float, nullable=False, server_default = "0")
    
    # Relationship to friendships where *this user* is user_id
    friendships: Mapped[list["Friend"]] = relationship(
        "Friend",
        back_populates="user",
        foreign_keys="Friend.user_phone"
    )

    # Relationship to friendships where *this user* is friend_id
    friend_of: Mapped[list["Friend"]] = relationship(
        "Friend",
        back_populates="friend",
        foreign_keys="Friend.friend_phone"
    )

    # Friend requests sent by this user
    friendships_sent: Mapped[list["FriendRequest"]] = relationship(
        "FriendRequest",
        back_populates="user",   # matches FriendRequest.user
        foreign_keys="FriendRequest.from_phone"
    )

    # Friend requests received by this user
    friendships_received: Mapped[list["FriendRequest"]] = relationship(
        "FriendRequest",
        back_populates="friend",  # matches FriendRequest.friend
        foreign_keys="FriendRequest.to_phone"
    )


    # Inbox notifications sent by this user
    notifications_sent: Mapped[list["Inbox"]] = relationship(
        "Inbox",
        back_populates="user",
        foreign_keys="Inbox.from_phone"
    )

    # Inbox notifications received by this user
    notifications_received: Mapped[list["Inbox"]] = relationship(
        "Inbox",
        back_populates="friend",
        foreign_keys="Inbox.to_phone"
    )


class Friend(Base):

    __tablename__ = "friends"

    user_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    friend_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    # ORM relationships
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_phone],
        back_populates="friendships"
    )

    friend: Mapped["User"] = relationship(
        "User",
        foreign_keys=[friend_phone],
        back_populates="friend_of"
    )

class FriendRequest(Base):
    
    __tablename__ = "friend_requests"
    
    from_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    to_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    accepted: Mapped[float] = mapped_column(
        Float, nullable=False, server_default="0"
    )

    # ORM relationships
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[from_phone],
        back_populates="friendships_sent"
    )

    friend: Mapped["User"] = relationship(
        "User",
        foreign_keys=[to_phone],
        back_populates="friendships_received"
    )

class Inbox(Base):

    __tablename__="inbox"

    notification: Mapped[float] = mapped_column(Float, primary_key=True)
    

    from_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    to_phone: Mapped[str] = mapped_column(
        ForeignKey("users.phone_number"),
        primary_key=True
    )

    # ORM relationships
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[from_phone],
        back_populates="notifications_sent"
    )

    friend: Mapped["User"] = relationship(
        "User",
        foreign_keys=[to_phone],
        back_populates="notifications_received"
    )



class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    zipcode: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String, nullable=False)
