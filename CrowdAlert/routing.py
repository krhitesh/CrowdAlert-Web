from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
# from django.urls import path, include
from api.events import routing as events_routing
from api.comments import routing as comments_routing
from api.upvote import routing as upvote_routing
from django.conf.urls import url
from channels.http import AsgiHandler

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'http': AuthMiddlewareStack(
        URLRouter(
            upvote_routing.websocket_urlpatterns +
            [url(r"^.*$", AsgiHandler),]
        )
    ),
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                # [
                #     path('ws/events/', include('api.events.routing')),
                #     path('ws/comments/', include('api.comments.routing')),
                # ]
                events_routing.websocket_urlpatterns +
                comments_routing.websocket_urlpatterns
            )
        )
    )
})