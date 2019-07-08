from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from api.comments import routing as comments_routing
from api.events import routing as events_routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                events_routing.websocket_urlpatterns +
                comments_routing.websocket_urlpatterns
            )
        )
    )
})
