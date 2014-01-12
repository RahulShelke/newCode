var min_distance = 0.5
    ,max_distance = 5
    ,markers = []
    ,map
    ,initialDistance = 2;
function init() {
    var mapDiv = document.getElementById('MapDiv');
    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            map = new google.maps.Map(mapDiv, {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 14,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
			

           // var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if(window.location.pathname.indexOf('locationmap') != -1) {
                pos = new google.maps.LatLng(propertyList[mapIndex].LatLng.latitude, propertyList[mapIndex].LatLng.longitude);
            } else {
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            }
            
		map.setCenter(pos);
            var distanceWidget = new DistanceWidget(map),
            	pos;


            google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
                displayInfo(distanceWidget);
            });

            google.maps.event.addListener(distanceWidget, 'position_changed', function() {
                displayInfo(distanceWidget);
            });

            // var markers = [];
            var infoWindows = [];

            var initialRadius = initialDistance * 1000;
            for (var i = 0; i < propertyList.length; i++) {
                var latLng = new google.maps.LatLng(propertyList[i].LatLng.latitude, propertyList[i].LatLng.longitude);
                var marker = new google.maps.Marker({
                    position: latLng,
                    infoWindowIndex : i,
                    icon:'/images/marker.png',
                    map: map
                });

                var propDistance = RadiusWidget.prototype.distanceBetweenPoints_(map.center, marker.position);
                if(initialRadius > (propDistance*1000)){
                    marker.setVisible(true);
                }else{
                    marker.setVisible(false);
                }
                var content ='<div class=propertiesListMap style=background:url('+propertyList[i].picture.linkFront+')no-repeat;background-size:300px 175px>'
                    +'<div id=propertyNameMap>'+propertyList[i].productName+'</div>'
                    +'<div id=propertyPriceMap class='+i+'>$'+propertyList[i].price+'<br /><a> Bed:'+propertyList[i].bedrooms+' Bath:'+propertyList[i].bathrooms+' Sqft:'+propertyList[i].area+'</a><a style=float:right;margin-top:-9px;margin-right:20px><img src=/images/green_arrow.png></div>'
                    +'<div id=arrowKeyMap></div>'
                    +'</div></a><br/>';
                $("#propertyPriceMap").live('click',function() {
                    var i = $(this).attr('class');
                    console.log(i);
                    $('#mapidHide').show();
                    $('#mapidHide').animate({right: "0",top:"30px"},1500);
                    $("#price p").html("Price: $"+propertyList[i].price);
                    $("#beds").html("Beds: "+propertyList[i].bedrooms);
                    $("#baths").html("Baths: "+propertyList[i].bathrooms);
                    $("#area").html("Sqft: "+propertyList[i].area);
                    $("#type").html("Type: "+propertyList[i].productType);
                    $('.slidermap').empty();
                    $('.slidermap').append(
                        "<div class=\"bxslidermap\"> <img src="+propertyList[i].picture.linkFront+" width=100% height=270/>"
                            +"<img src="+propertyList[i].picture.linkBack+" width=100% height=270/>"
                            +"<img src="+propertyList[i].picture.linkLeft+" width=100% height=270/>"
                            +"<img src="+propertyList[i].picture.linkRight+" width=100% height=270/> </div>"
                    );
                    $('.bxslidermap').bxSlider({
                        mode: 'horizontal',
                        auto: true,
                        pause: 2000,
                        speed:1000,
                        infiniteLoop:true,
                        buildPager: function(slideIndex){
                            switch(slideIndex){
                                case 0:
                                    return '<img src='+propertyList[i].picture.linkFront+' width=100 height=50>';
                                case 1:
                                    return '<img src='+propertyList[i].picture.linkBack+' width=100 height=50>';
                                case 2:
                                    return '<img src='+propertyList[i].picture.linkLeft+' width=100 height=50>';
                                case 3:
                                    return '<img src='+propertyList[i].picture.linkRight+' width=100 height=50>';
                            }
                        }
                    });

                    return false;
                });

                $(document).ready(function(){
                    $('.bxslidermap').bxSlider({
                        mode: 'horizontal',
                        auto: true,
                        pause: 2000,
                        speed:1000,
                        infiniteLoop:true,
                        buildPager: function(slideIndex){
                            switch(slideIndex){
                                case 0:
                                    return '<img src='+propertyList[0].picture.linkFront+' width=100 height=50>';
                                case 1:
                                    return '<img src='+propertyList[0].picture.linkBack+' width=100 height=50>';
                                case 2:
                                    return '<img src='+propertyList[0].picture.linkLeft+' width=100 height=50>';
                                case 3:
                                    return '<img src='+propertyList[0].picture.linkRight+' width=100 height=50>';
                            }
                        }
                    });
                });
                $("#moreMap").live('click',function(){
                    $("#mapidHide").hide().animate({right:"-632px"},1);
                    //$("#mapidHide").hide();
                });

                var infoWindow = new google.maps.InfoWindow({
                    content : content
                });
                google.maps.event.addListener(marker, 'click',
                    function(event)
                    {
                        this.setIcon('/images/marker_hover.png');
                        infoWindows[this.infoWindowIndex].open(map, this);
                    }
                );

                 google.maps.event.addListener(infoWindow,'closeclick',
                 function(event)
                 {
                    marker.setIcon('/images/marker.png');
                 //infoWindows[this.infoWindowIndex].close();
                 }
                 );
                infoWindows.push(infoWindow);
                markers.push(marker);
            }


            // Reverse Geocoder function to get location city and state in Readable format
            // Also populate in area search box

            geocoder = new google.maps.Geocoder();
            var location =pos;
            geocoder.geocode({'location': location }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    //Check result 0
                    var result = results[0];
                    //look for locality tag and administrative_area_level_1
                    var city = "";
                    var state = "";
                    var postalCode="";
                    var country="";
                    for (var i = 0, len = result.address_components.length; i < len; i++) {

                        var ac = result.address_components[i];
                        if (ac.types.indexOf("locality") >= 0) city = ac.long_name;
                        if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
                        if (ac.types.indexOf("postal_code") >= 0) postalCode = ac.long_name;
                        if (ac.types.indexOf("country") >= 0) country = ac.long_name;
                        //console.log(postalCode)
                        //console.log("**************************")
                    }
                    //only report if we got Good Stuff
                    if (city != '' && state != '') {
                        document.getElementById("location").value = city + ',' + state;
                        document.getElementById("zipcode").value = postalCode;
                        document.getElementById("country").value = country;
                    } else {
                        console.log('Geocoder failed' + status)
                    }
                }
            });

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
   //             marker.setIcon(image);
   //             marker.setPosition(latlng);
    //            infowindow.setContent(placeName);
    //            infowindow.open(map, marker);
            }
/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


        }, function () {
            handleNoGeolocation(true);
        });
    }
    else {
        handleNoGeolocation(false);
    }
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
        this.set('position', map.getCenter());

        var marker = new google.maps.Marker({
            title: 'Move me!',
            draggable: true,
            icon:'/images/mapCenter.png',
            raiseOnDrag: false
        });

        // Bind the marker map property to the DistanceWidget map property
        marker.bindTo('map', this);

        // Bind the marker position property to the DistanceWidget position
        // property
        marker.bindTo('position', this);

        // Create a new radius widget
        var radiusWidget = new RadiusWidget(map);

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
    function RadiusWidget(map) {
        var circle = new google.maps.Circle({
            strokeWeight: 2,
            strokeColor:'#00aeef',
            fillColor:'#e9e5dc'
        });

        // Set the distance property value, default to 50km.
        this.set('distance', initialDistance);

        this.set('map', map);

        // Bind the RadiusWidget bounds property to the circle bounds property.
        this.bindTo('bounds', circle);

        // Bind the circle center to the RadiusWidget center property
        circle.bindTo('center', this);

        // Bind the circle map to the RadiusWidget map
        circle.bindTo('map', this);

        // Bind the circle radius property to the RadiusWidget radius property
        circle.bindTo('radius', this);
       
        /**
         * Update the center of the circle and position the sizer back on the line.
         *
         * Position is bound to the DistanceWidget so this is expected to change when
         * the position of the distance widget is changed.
         */
        // RadiusWidget.prototype.center_changed = function() {
        //     var bounds = this.get('bounds');

        //     // Bounds might not always be set so check that it exists first.
        //     if (bounds) {
        //         var lng = bounds.getNorthEast().lng();

        //         // Put the sizer at center, right on the circle.
        //         var position = new google.maps.LatLng(this.get('center').lat(), lng);
        //         this.set('sizer_position', position);
        //     }
        // };
       // this.center_changed();
        this.addSizer_();
    }
    RadiusWidget.prototype = new google.maps.MVCObject();


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
     * Update the radius when the distance has changed.
     */
    RadiusWidget.prototype.distance_changed = function() {
        this.set('radius', this.get('distance') * 1000);
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
        var me = this;
        
        sizer.bindTo('map', this);
        sizer.bindTo('position', this, 'sizer_position');
        google.maps.event.addListener(sizer, 'drag', function() {
            // Set the circle distance (radius)
            me.setDistance();
            me.center_changed();
        });
        
        var olddist = me.get('distance');
            
        var map = me.get('map');
        google.maps.event.addListener(sizer, 'dragend', function() {
            var dist = me.get('distance');
            var currentZoomLevel = map.getZoom();

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
            showHideMarker();
        });
        showHideMarker();

        function showHideMarker(){
            var circleCenter = me.get('center');
            for (var i = 0; i < markers.length; i++) {
                var propDistance = me.distanceBetweenPoints_(circleCenter, markers[i].position);
                if (me.radius > (propDistance *1000)){
                 markers[i].setVisible(true);
                }else{
                    markers[i].setVisible(false);
                }
            };
        };
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
        //var info = document.getElementById('info');
        //console.log( 'Position: ' + widget.get('position') + ', distance: ' +
//            widget.get('distance')+ ' Radius :'+widget.get('radius'));
        document.getElementById('areaOfSearch').value= widget.get('distance');
    }



    google.maps.event.addDomListener(window, 'load', init);
