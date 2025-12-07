from .auth import router as auth_router
from .users import router as users_router
from .friends import router as friends_router
from .inbox import router as inbox_router
from .friendRequests import router as friend_request_router
from .locations import router as locations_router
from .notifications import router as notifications_router
routers = [
    auth_router,
    users_router,
    friends_router,
    inbox_router,
    friend_request_router,
    locations_router,
    notifications_router
]
