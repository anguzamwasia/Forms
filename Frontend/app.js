document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  const status = document.getElementById("status");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");

  // Initialize Leaflet map
  const map = L.map("map").setView([0, 0], 2); // Default center at (0, 0)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker([0, 0], { draggable: true }).addTo(map);

  // Automatically use the device's location
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;

        // Center the map and move the marker to the user's location
        map.setView([latitude, longitude], 13);
        marker.setLatLng([latitude, longitude]);
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
        status.textContent = "Could not fetch your location. Please drag the marker to set it.";
      }
    );
  } else {
    status.textContent = "Geolocation is not supported by your browser.";
  }

  // Update latitude and longitude fields when the marker is dragged
  marker.on("dragend", function () {
    const position = marker.getLatLng();
    latitudeInput.value = position.lat;
    longitudeInput.value = position.lng;
  });

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;

    if (!name || !latitude || !longitude) {
      status.textContent = "Please fill in all fields.";
      return;
    }

    const data = {
      name: name,
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/submit-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        status.textContent = responseData.message || "Data submitted successfully!";
        form.reset();
        marker.setLatLng([0, 0]); // Reset marker position
        map.setView([0, 0], 2);   // Reset map view
      } else {
        const errorData = await response.json();
        status.textContent = errorData.error || "Error submitting data.";
      }
    } catch (error) {
      console.error("Error:", error);
      status.textContent = "Network error. Please try again later.";
    }
  });
});
