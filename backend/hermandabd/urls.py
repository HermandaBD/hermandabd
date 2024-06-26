from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *
from .views_statistics import get_statistics
router = DefaultRouter()
router.register("hermandades", HermandadViewSet, basename="hermandades")
router.register("hermanos", HermanoViewSet, basename="hermanos")
router.register("eventos", EventoViewSet, basename="eventos")
router.register("etiquetas", EtiquetaViewSet, basename="etiquetas")
router.register("documentos", DocumentoViewSet, basename="documentos")
router.register("patrimonios", PatrimonioViewSet, basename="patrimonios")
router.register("inventarios", InventarioViewSet, basename="inventarios")
router.register("papeletasitios", PapeletaSitioViewSet, basename="papeletasitios")
router.register("cartas", CartaViewSet, basename="cartas")
router.register("pagos", PagoViewSet, basename="pagos")
router.register("users", CustomUserViewSet, basename="users")

hermandabd_url_patterns = [
    # path(r"api/v1/", include("djoser.urls")), # Cambiado por mi propio viewSet para modificar el serializer
    path(r"api/v1/", include("djoser.urls.authtoken")),
    path(
        "api/v1/export", ExportHermandadDataView.as_view(), name="export-hermandad-data"
    ),
    path(
        "api/v1/import/<str:model_name>/", ImportDataView.as_view(), name="upload_csv"
    ),
    path('api/v1/pagos/generate_pdf/<str:id>/', generate_pdf, name='generate_pdf'),
    path('api/v1/papeletasitios/generate_papeleta/<str:id>/', generate_papeleta, name='generate_papeleta'),
    path('api/v1/statistics/', get_statistics, name='get_statistics'),
]

hermandabd_url_patterns += [path(r"api/v1/", include(router.urls))]
