from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from hermandabd.urls import hermandabd_url_patterns

urlpatterns = [
    path('admin/', admin.site.urls),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += hermandabd_url_patterns
