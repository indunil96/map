const map = L.map('map' , {
    center:[35.6895, 139.6917],
    zoom: 5,
    maxBounds:[
        [24.396308, 122.93457],
        [45.551483, 153.986672]
    ],
    maxBoundsViscosity: 1.0
});

map.setMinZoom(5);
map.setMaxZoom(18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Indunil'
}).addTo(map);

/* const marker = L.marker([33.5833, 130.3999]).addTo(map);
marker.bindPopup("fukuoka").openPopup(); */

const locations = [
    { 
        name: "Tokyo", 
        lat: 35.689487, 
        lng: 139.691711, 
        url: "locations/tokyo.html" 
    },
    { 
        name: "Yokohama", 
        lat: 35.443707, 
        lng: 139.638031, 
        url: "locations/yokohama.html" 
    },
    { 
        name: "Osaka", 
        lat: 34.693737, 
        lng: 135.502167, 
        url: "locations/osaka.html" 
    },
    { 
        name: "Nagoya", 
        lat: 35.181446, 
        lng: 136.906398, 
        url: "locations/nagoya.html" 
    },
    { 
        name: "Sapporo", 
        lat: 43.062095, 
        lng: 141.354376, 
        url: "locations/sapporo.html" 
    },
    { 
        name: "Fukuoka", 
        lat: 33.590355, 
        lng: 130.401716, 
        url: "locations/fukuoka.html" 
    },
    { 
        name: "Kyoto", 
        lat: 35.011564, 
        lng: 135.768149, 
        url: "locations/kyoto.html" 
    },
    { 
        name: "Hiroshima", 
        lat: 34.385203, 
        lng: 132.455293, 
        url: "locations/hiroshima.html" 
    }
];



locations.forEach(location => {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    
    const popupContent = `
        <b>${location.name}</b><br>
        <a href="${location.url}" target="_parent">詳しく見る</a>
    `;
    marker.bindPopup(popupContent);

    marker.on("click", () => {
        map.setView([location.lat, location.lng], 13);
    });
});

const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");


searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    suggestions.innerHTML = "";

    if(query){
        const filtered= locations.filter(location => 
            location.name.toLowerCase().includes(query));

            if(filtered.length >0){
                filtered.forEach(location => {
                    const item = document.createElement("a");
                   item.classList = "dropdown-item";
                   item.textContent = location.name;
                   item.dataset.lat = location.lat;
                   item.dataset.lng = location.lng;
                   suggestions.appendChild(item);
                });
                suggestions.style.display = "block";
            }else{
                suggestions.style.display = "none";
            }
    }else{
        suggestions.style.display = "none";
    }
});

suggestions.addEventListener("click", (event) => {
    if(event.target.classList.contains("dropdown-item")){
        const lat = parseFloat(event.target.dataset.lat);
        const lng = parseFloat(event.target.dataset.lng);

        map.setView([lat, lng], 13);
        suggestions.style.display = "none";
        searchInput.value = "";
    }
});

document.getElementById("resetMap").onclick = () => {
    map.setView([35.6895, 139.6917], 5);
};

/* document.addEventListener("DOMContentLoaded", async function () {
    if (!sessionStorage.getItem("locationPermission")) {
        try {
            const permission = await navigator.permissions.query({ name: "geolocation" });

            if (permission.state === "granted") {
                console.log("Location already granted.");
                sessionStorage.setItem("locationPermission", "granted");
            } else if (permission.state === "prompt") {
                requestLocation();
            } else {
                console.log("Location denied previously.");
                sessionStorage.setItem("locationPermission", "denied");
            }
        } catch (error) {
            console.error("Error checking location permission:", error);
        }
    }
});

function requestLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Location accessed:", position);
            sessionStorage.setItem("locationPermission", "granted");
        },
        (error) => {
            console.warn("Location access denied:", error);
            sessionStorage.setItem("locationPermission", "denied");
        }
    );
} */


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        locations.sort((a, b) => {
            const distanceA = Math.hypot(a.lat - userLat, a.lng - userLng);
            const distanceB = Math.hypot(b.lat - userLat, b.lng - userLng);
            return distanceA - distanceB;
        });
    });
}
