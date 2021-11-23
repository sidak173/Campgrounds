const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.FullscreenControl()); // fullscrull mode
map.addControl(new mapboxgl.NavigationControl());  // zoom rotation controls



const marker1 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(geometry.coordinates)
    .addTo(map);

