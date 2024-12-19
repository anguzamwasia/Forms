from django.shortcuts import render

from django.http import JsonResponse
import json  # Required to parse JSON request body
from django.shortcuts import render
import os

def frontend_home(request):
    # Path to the index.html file in the Frontend folder
    index_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'E:/Learning/Forms/Frontend/index.html')
    try:
        with open(index_path, 'r') as file:
            return HttpResponse(file.read(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponse("Frontend index.html not found.", status=404)

def submit_data(request):
    if request.method == "POST":
        try:
            # Load the JSON data from the request body
            data = json.loads(request.body)
            name = data.get("name")
            latitude = data.get("latitude")
            longitude = data.get("longitude")

            # You can add logic to save the data or process it here
            print(f"Received data: Name={name}, Latitude={latitude}, Longitude={longitude}")

            # Return a success response
            return JsonResponse({"message": "Data submitted successfully!"})

        except Exception as e:
            # If there is an error, return an error response
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=400)
