from rest_framework.views import APIView
from rest_framework.response import Response

class ZarinpalCallbackStubView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"detail": "Callback not implemented yet."}, status=501)
