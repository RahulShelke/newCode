var size1= function(){
    $('#bigWarpper,.propertiesListContainer').height(
        $(window).height()-43
    );
};

$(document).ready(size1);
$(window).resize(size1);

var size2= function(){
    $('#mainSection').height(
        $(window).height()-90
    );
};

$(document).ready(size2);
$(window).resize(size2);

var size3= function(){
    $('#mainAside,#MapDiv').height(
        $(window).height()-90
    );
};

$(document).ready(size3);
$(window).resize(size3);


