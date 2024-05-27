from django.contrib import admin
from django.urls import path
from hermandabd.urls import hermandabd_url_patterns

urlpatterns = [
    path("admin/", admin.site.urls),
]

urlpatterns += hermandabd_url_patterns
