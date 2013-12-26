var map;
var geocoder = new google.maps.Geocoder();
var min_distance = 0.5; //0.5km 
var max_distance = 5; //5km 
function initialize() {

    function codeAddress() {
        var address =propertyList ;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //map.setCenter(results[0].geometry.location);
                var city = "";
                var state = "";
                var postalCode="";
                var country="";
                for (var i = 0, len = results[0].address_components.length; i < len; i++) {

                    var mapOptions = {
                        zoom: 14,
                        center:results[0].geometry.location,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    map = new google.maps.Map(document.getElementById('MapDiv'), mapOptions);

                    var distanceWidget = new DistanceWidget(map);

                    google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
                        displayInfo(distanceWidget);
                    });

                    google.maps.event.addListener(distanceWidget, 'position_changed', function() {
                        displayInfo(distanceWidget);
                    });

                    var ac = results[0].address_components[i];
                    if (ac.types.indexOf("locality") >= 0) city = ac.long_name;
                    if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
                    if (ac.types.indexOf("postal_code") >= 0) postalCode = ac.long_name;
                    if (ac.types.indexOf("country") >= 0) country = ac.long_name;

                    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
                    var input = document.getElementById('location');
                    var autocomplete = new google.maps.places.Autocomplete(input, {
                        types: ["geocode"]
                    });

                    autocomplete.bindTo('bounds', map);
                    var infowindow = new google.maps.InfoWindow();

                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        infowindow.close();
                        var place = autocomplete.getPlace();
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);
                        } else {
                            map.setCenter(place.geometry.location);
                            map.setZoom(17);
                        }

                        moveMarker(place.name, place.geometry.location);
                    });

                    $("location").focusin(function () {
                        $(document).keypress(function (e) {
                            if (e.which == 13) {
                                infowindow.close();
                                var firstResult = $(".pac-container .pac-item:first").text();

                                var geocoder = new google.maps.Geocoder();
                                geocoder.geocode({"address":firstResult }, function(results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        var lat = results[0].geometry.location.lat(),
                                            lng = results[0].geometry.location.lng(),
                                            placeName = results[0].address_components[0].long_name,
                                            latlng = new google.maps.LatLng(lat, lng);

                                        moveMarker(placeName, latlng);
                                        $("location").val(firstResult);
                                    }
                                });
                            }
                        });
                    });

                    function moveMarker(placeName, latlng){
                        //marker.setIcon(image);
                        //marker.setPosition(latlng);
                        //infowindow.setContent(placeName);
                        //infowindow.open(map, marker);
                    }
                    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

                }
                //only report if we got Good Stuff
                document.getElementById("location").value = city + ',' + state;
                document.getElementById("zipcode").value = postalCode;
                document.getElementById("country").value = country;
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    codeAddress();
}

    /**
     * A distance widget that will display a circle that can be resized and will
     * provide the radius in km.
     *
     * @param {google.maps.Map} map The map on which to attach the distance widget.
     *
     * @constructor
     */
    function DistanceWidget(map) {
        this.set('map', map);
        this.set('position',  map.getCenter());

        var marker = new google.maps.Marker({
            title: 'Move me!',
            icon:'/images/mapCenter.png',
            raiseOnDrag: false
        });

        // Bind the marker map property to the DistanceWidget map property
        marker.bindTo('map', this);

        // Bind the marker position property to the DistanceWidget position
        // property
        marker.bindTo('position', this);

        // Create a new radius widget
        var radiusWidget = new RadiusWidget();

        // Bind the radiusWidget map to the DistanceWidget map
        radiusWidget.bindTo('map', this);

        // Bind the radiusWidget center to the DistanceWidget position
        radiusWidget.bindTo('center', this, 'position');

        // Bind to the radiusWidgets' distance property
        this.bindTo('distance', radiusWidget);

        // Bind to the radiusWidgets' bounds property
        this.bindTo('bounds', radiusWidget);
    }
    DistanceWidget.prototype = new google.maps.MVCObject();

    /**
     * A radius widget that add a circle to a map and centers on a marker.
     *
     * @constructor
     */
    function RadiusWidget() {
        var circle = new google.maps.Circle({
            strokeWeight: 2,
            strokeColor:'#00aeef',
            fillColor:'#e9e5dc'
        });

        // Set the distance property value, default to 50km.
        this.set('distance', 2);

        // Bind the RadiusWidget bounds property to the circle bounds property.
        this.bindTo('bounds', circle);

        // Bind the circle center to the RadiusWidget center property
        circle.bindTo('center', this);

        // Bind the circle map to the RadiusWidget map
        circle.bindTo('map', this);

        // Bind the circle radius property to the RadiusWidget radius property
        circle.bindTo('radius', this);

        this.addSizer_();
    }
    RadiusWidget.prototype = new google.maps.MVCObject();


    /**
     * Update the radius when the distance has changed.
     */
    RadiusWidget.prototype.distance_changed = function() {
        this.set('radius', this.get('distance') * 1000);
    };

  /**
         * Update the center of the circle and position the sizer back on the line.
         *
         * Position is bound to the DistanceWidget so this is expected to change when
         * the position of the distance widget is changed.
         */
    RadiusWidget.prototype.center_changed = function() {
        console.log('CENTRE_CHANGED................');
        var bounds = this.get('bounds');

        // Bounds might not always be set so check that it exists first.
        if (bounds) {
            var lng = bounds.getNorthEast().lng();

            // Put the sizer at center, right on the circle.
            var position = new google.maps.LatLng(this.get('center').lat(), lng);
            this.set('sizer_position', position);
        }
    };

    /**
     * Add the sizer marker to the map.
     *
     * @private
     */
    RadiusWidget.prototype.addSizer_ = function() {
        var sizer = new google.maps.Marker({
            draggable: true,
            title: 'Drag me!',
            icon:'/images/dragger.png',
            raiseOnDrag: false
        });

        sizer.bindTo('map', this);
        sizer.bindTo('position', this, 'sizer_position');

        var me = this;
        google.maps.event.addListener(sizer, 'drag', function() {
            // Set the circle distance (radius)
            me.setDistance();
            me.center_changed();
        });

        var olddist = me.get('distance');
        google.maps.event.addListener(sizer, 'dragend', function() {
            var dist = me.get('distance');
            var currentZoomLevel = map.getZoom();
            //console.log( 'currentZoomLevel :'+currentZoomLevel +', distance :'+dist + ', olddist : '+olddist);
            if(dist > olddist &&  currentZoomLevel != 0){
                map.setZoom(currentZoomLevel - 1);
                olddist = dist;
            }
            if(dist < olddist && currentZoomLevel !=21){
                map.setZoom(currentZoomLevel + 1);
                olddist = dist;
            }  
            if(dist > max_distance){
                this.set('distance', max_distance);
            }
            if(dist < min_distance){
                this.set('distance', min_distance);
            }  
            me.center_changed();
            //console.log('Radius :'+me.radius);
        });

    };

    /**
     * Update the center of the circle and position the sizer back on the line.
     *
     * Position is bound to the DistanceWidget so this is expected to change when
     * the position of the distance widget is changed.
     */
    RadiusWidget.prototype.center_changed = function() {
        var bounds = this.get('bounds');

        // Bounds might not always be set so check that it exists first.
        if (bounds) {
            var lng = bounds.getNorthEast().lng();

            // Put the sizer at center, right on the circle.
            var position = new google.maps.LatLng(this.get('center').lat(), lng);
            this.set('sizer_position', position);
        }
    };

    /**
     * Calculates the distance between two latlng locations in km.
     * @see http://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {google.maps.LatLng} p1 The first lat lng point.
     * @param {google.maps.LatLng} p2 The second lat lng point.
     * @return {number} The distance between the two points in km.
     * @private
     */
    RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
        if (!p1 || !p2) {
            return 0;
        }

        var R = 6371; // Radius of the Earth in km
        var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
        var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };


    /**
     * Set the distance of the circle based on the position of the sizer.
     */
    RadiusWidget.prototype.setDistance = function() {
        // As the sizer is being dragged, its position changes.  Because the
        // RadiusWidget's sizer_position is bound to the sizer's position, it will
        // change as well.
        var pos = this.get('sizer_position');
        var center = this.get('center');
        var distance = this.distanceBetweenPoints_(center, pos);

        // Set the distance property for any objects that are bound to it
        this.set('distance', distance);
    };

    function displayInfo(widget) {
        var info = document.getElementById('info');
        console.log('Position: ' + widget.get('position') + ', distance: ' +
            widget.get('distance'));
    }




google.maps.event.addDomListener(window, 'load', initialize);

