from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

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
    #path(r"api/v1/", include("djoser.urls")),
    path(r"api/v1/", include("djoser.urls.authtoken")),
    path(
        "api/v1/export", ExportHermandadDataView.as_view(), name="export-hermandad-data"
    ),
    path("api/v1/import/<str:model_name>/", ImportDataView.as_view(), name="upload_csv"),
]

hermandabd_url_patterns += [path(r"api/v1/", include(router.urls))]
