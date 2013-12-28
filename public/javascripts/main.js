var size1= function(){
    $('#bigWarpper,.propertiesListContainer,#mainAside,#MapDiv').height(
        $(window).height()-53
    );
};

$(document).ready(size1);
$(window).resize(size1);
/*
var size2= function(){
    $('#mainSection').height(
        $(window).height()-90
    );
};

$(document).ready(size2);
$(window).resize(size2);

var size3= function(){
    $('.propertiesListContainer').css('margin','0 auto')
};

$(document).ready(size3);
$(window).resize(size3);

var size4= function(){
    $('.lastchild').width(
        $(window).width()-281
    )
};

$(document).ready(size4);
$(window).resize(size4);

var size5= function(){
    $('.propertiesListScroll').width(
        $(window).width()-953
    )
};

$(document).ready(size5);
$(window).resize(size5);

var size6= function(){
    $('.zoomedDetails').width(
        $(window).width()-595
    )
};

$(document).ready(size6);
$(window).resize(size6);


*/

var size6= function(){
    $('#mapidHide').css('top',-($(window).height()-81));
        
    
};

$(document).ready(size6);
$(window).resize(size6);

