
mapboxgl.accessToken = mt;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: campground.geometry.coordinates,
    zoom: 8

});
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset:25 })
            .setHTML(`<br><h4>${campground.title}</h4><p>${campground.location}</p>`)
    )
    .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());

    

    