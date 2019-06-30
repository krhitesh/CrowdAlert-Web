from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from api.events import routing as events_routing
from api.comments import routing as comments_routing

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