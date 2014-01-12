function showListView(){
    $('#MapDiv2').remove();
    var selectedImage;
    document.getElementById('mainAside').innerHTML='<div id=MapDiv>' +
                                                        '<ul id="searchList">'+
                                                            "<li class=zoomedDetails style=width:100%><div id=propertyZoomedDetails><br />" +
                                                            "<div class=slider> <div class=bxslider>"
                                                            +"<img src="+propertyList[0].picture.linkFront+" width=580 height=270/>"
                                                            +"<img src="+propertyList[0].picture.linkBack+" width=580 height=270/>"
                                                            +"<img src="+propertyList[0].picture.linkLeft+" width=580 height=270/>"
                                                            +"<img src="+propertyList[0].picture.linkRight+" width=580 height=270/>"
                                                            +"</div></div>"+
                                                            "<div id=description style=width:100%>"+
                                                                    "<div id=tabs><br>" +
                                                                    "<img  id='mapimg' src=/images/maps_button.png  style='cursor:pointer' class='0' title='Go To Location In Map'/>&nbsp;&nbsp;" +
                                                                    "<img id='messageimg' src=/images/messgae.png   style='cursor:pointer' class='0' title='Email Selected Image'/>&nbsp;&nbsp;" +
                                                                    "<img id='saveimg' src=/images/save_button.png    style='cursor:pointer' class='0' title='Save Selected Image'/>&nbsp;&nbsp;" +
                                                                    "<img id='printimg' src=/images/print.png   style='cursor:pointer' class='0' title='Print Selected Image'/>&nbsp;&nbsp;" +
                                                                    "<img id='facebookimg' src=/images/facebook-variation.png  style='cursor:pointer' class='0' title='Share on FaceBook'/>&nbsp;&nbsp;" +
                                                                    "<img id='twitterimg' src=/images/twitter-variation.png  style='cursor:pointer' class='0' title='Share on Twitter'/>&nbsp;&nbsp;" +
                                                                    "<img id='linkedinimg' src=/images/linkedin-variation.png  style='cursor:pointer' class='0' title='Share on LinkedIn'/>" +
                                                                    "</div>"+
                                                                    "<div id=price><p style=padding-left:0>Price: $"+propertyList[0].price+"</p>" +
                                                            "</div><div id=property><div id=property_details><h4>Property Details</h4></div> " +
                                                            "<div id=property_types><ul><li id=beds>Beds: "+propertyList[0].bedrooms+"</li>" +
                                                            "<li id=area>Area: "+propertyList[0].area+"</li>" +
                                                            "<li>Built: 2005</li>" +
                                                            "<li id=baths>Baths: "+propertyList[0].bathrooms+"</li>" +
                                                            "<li id=type>Type: "+propertyList[0].productType+"</li>" +
                                                            "<li>MLS ID</li>" +
                                                            "</ul></div> </div>" +
                                                            "<div id=description_prop><h4>Descriptions</h4>" +
                                                            "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.</p></div>" +
                                                            "</div></div></li>";
                                                            /*'<li class=propertiesListScroll>' +
                                                                '<a id=result>'+propertyList.length+ ' results</a>'+
                                                                '<div id=sort> ' +
                                                                    'Sort:' +
                                                                    '<select id=mySelect onchange=priceRange()>' +
                                                                        '<option value=Priceh> Price High-Low</option>' +
                                                                        '<option value=Pricel> Price Low-High</option>' +
                                                                        '<option value=Timen> Time - Newest-Oldest</option>' +
                                                                        '<option value=Timeo> Time - Oldest-Newest</option>' +
                                                                        '<option value=Bedl> Bedrooms Low-High</option>' +
                                                                        '<option value=Batl> Bathrooms Low-High</option>' +
                                                                    '</select>' +
                                                                '</div>' +
                                                                '<script>'+
                                                                     function priceRange(){
                                                                        var mylist=document.getElementById("mySelect");
                                                                        var answer = mylist.options[mylist.selectedIndex].value;
                                                                        if(answer == "Priceh"){
                                                                            sortDescendingByPrice();
                                                                        }
                                                                        else if(answer == "Pricel"){
                                                                            sortAscendingByPrice();
                                                                        }
                                                                        else if(answer == "Bedl"){
                                                                            sortAscendingBybed();
                                                                        }
                                                                        else if(answer == "Batl"){
                                                                            sortAscendingBybath();
                                                                        }
                                                                     }
                                                                +'</script>'+
                                                                '<div id=compare><a href=#>Compare</a></div>'+
                                                                '<div id=scroll>' ;
                                                                    document.getElementById("scroll").innerHTML = '<div id="list1">';
                                                                        for(var i=0; i < propertyList.length ; i++){
                                                                            console.log(propertyList[i]);
                                                                            document.getElementById("list1").innerHTML += "<br/> <div class=propertiesList style=background:url("+propertyList[i].picture.linkFront+")no-repeat;background-size:300px 175px>"
                                                                                +"<div id=propertyName>"+propertyList[i].productName+"<a style=float:right;margin-top:-2px;margin-right:20px><input type=checkbox name=property value="+i+"></a></div>"
                                                                                +"<div id=propertyPrice class="+i+">$"+propertyList[i].price+"<br /><a> Bed:"+propertyList[i].bedrooms+" Bath:"+propertyList[i].bathrooms+" Sqft:"+propertyList[i].area+"</a><a style=float:right;margin-top:-2px;margin-right:20px><img src=/images/green_arrow.png></div>"
                                                                                //+"<div id=arrowKey></div>"
                                                                                +"</div></a>"
                                                                        }  */
                                                                    //document.getElementById("scroll").innerHTML = '</div>';
                                                                //'</div>'

                                                            //'</li>'
                                                            //var mainDiv = document.getElementById('MapDiv');
                                                            //var div = mainDiv.getElementsByTagName('ul');
                                                                //[1].style.display='none';
                                                            //var ul = document.getElementById("searchList");
                                                            /*var li = $("<li class=zoomedDetails><div id=propertyZoomedDetails><br />" +
                                                                "<div class=slider> <div class=bxslider>"
                                                                +"<img src="+propertyList[0].picture.linkFront+" width=580 height=270/>"
                                                                +"<img src="+propertyList[0].picture.linkBack+" width=580 height=270/>"
                                                                +"<img src="+propertyList[0].picture.linkLeft+" width=580 height=270/>"
                                                                +"<img src="+propertyList[0].picture.linkRight+" width=580 height=270/>"
                                                                +"</div></div>"+
                                                                "<div id=description style=width:102.5%><div id=tabs>" +
                                                                "<ul><li><img src=/images/maps_button.png >" +
                                                                "</li><li><img src=/images/messgae.png >" +
                                                                "</li><li><img src=/images/save_button.png >" +
                                                                "</li><li><img src=/images/some_button.png >" +
                                                                "</li><li><img src=/images/print.png >" +
                                                                "</li></ul>" +
                                                                "</div><div id=price><p style=padding-left:0>Price: $"+propertyList[0].price+"</p>" +
                                                                "</div><div id=property><div id=property_details><h4>Property Details</h4></div> " +
                                                                "<div id=property_types><ul><li id=beds>Beds: "+propertyList[0].bedrooms+"</li>" +
                                                                "<li id=area>Sqft: "+propertyList[0].area+"</li>" +
                                                                "<li>Built: 2005</li>" +
                                                                "<li id=baths>Bath: "+propertyList[0].bathrooms+"</li>" +
                                                                "<li id=type>Type: "+propertyList[0].productType+"</li>" +
                                                                "<li>MLS ID</li>" +
                                                                "</ul></div> </div>" +
                                                                "<div id=description_prop><h4>Descriptions</h4>" +
                                                                "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.</p></div>" +
                                                                "</div></div></li>");   */
                                                            //li.insertAfter($("ul#searchList li:first"));
    
        var url = $(location).attr('href');
        url = url.substring(0, url.indexOf('/search'));

        $('#facebookimg').click(function(){
            var index = $(this).attr('class')
                       , price = propertyList[index].price
                       , beds = propertyList[index].bedrooms
                       , area = propertyList[index].area
                       , built = 2005 //TODO: propertyList[index].price
                       , bath = propertyList[index].bathrooms
                       , type = propertyList[index].productType;
            selectedImage = selectedImage.substring(selectedImage.lastIndexOf('/'));
            var a = $('<a>').attr('href', url+'/sharefacebook'+selectedImage+'/'+price+'/'+beds+'/'+area+'/'+built+'/'+bath+'/'+type).attr('target', '_blank').appendTo('body');
                       a[0].click();
                       a.remove();
        });

        $('#twitterimg').click(function(){
            selectedImage = selectedImage.substring(selectedImage.lastIndexOf('/'));
            url = url.replace('localhost','www.mysite.com');
            var a = $('<a>').attr('href', url+'/sharetwitter'+selectedImage).attr('target', '_blank').appendTo('body');
            a[0].click();
            a.remove();
        });

         $('#linkedinimg').click(function(){
            var index = $(this).attr('class')
                       , price = propertyList[index].price
                       , beds = propertyList[index].bedrooms
                       , area = propertyList[index].area
                       , built = 2005 //TODO: propertyList[index].price
                       , bath = propertyList[index].bathrooms
                       , type = propertyList[index].productType;
            var a = $("<a>").attr("href", url+'/sharelinkedin'+selectedImage+'/'+price+'/'+beds+'/'+area+'/'+built+'/'+bath+'/'+type).appendTo("body");
            a[0].click();
            a.remove();
            // selectedImage = selectedImage.substring(selectedImage.lastIndexOf('/'));
            // url = url.replace('localhost','www.mysite.com');
            // //var a = $('<a>').attr('href', url+'/sharelinkedin'+selectedImage).attr('target', '_blank').appendTo('body');
            // var a = $('<a>').attr('href', url+'/message').attr('target', '_blank').appendTo('body');
            // a[0].click();
            // a.remove();
        });
        
        $('#mapimg').click(function(){
            var propid = $(this).attr('class');
            var a = $('<a>').attr('href', url+'/search/'+propid).appendTo('body');
            a[0].click();
            a.remove();
        }); 
        
        //$('#socialimg').click(function(){
        //var a = $('<a>').attr('href', url+'/fbauth').attr('target', '_blank').appendTo('body');
        //var a = $('<a>').attr('href', url+'/auth/twitter').attr('target', '_blank').appendTo('body');
        //a[0].click();
        //a.remove();
        //});


        $('#messageimg').click(function(){
            var index = $(this).attr('class')
                , price = propertyList[index].price
                , beds = propertyList[index].bedrooms
                , area = propertyList[index].area
                , built = 2005 //TODO: propertyList[index].price
                , bath = propertyList[index].bathrooms
                , type = propertyList[index].productType;

                var a = $("<a>").attr("href", url+'/sendmail'+selectedImage+'/'+price+'/'+beds+'/'+area+'/'+built+'/'+bath+'/'+type).appendTo("body");
            a[0].click();
            a.remove();
          });                                    
        $('#printimg').click(function(){
            var propDtlHtml = document.getElementById('mainAside').innerHTML.substring(document.getElementById('mainAside').innerHTML.indexOf('<div id="price">'));
             var html = '<html><head><meta name="viewport" content="width=device-width"><title>'
                +selectedImage+' (1200×800)</title></head><body style="margin: 0px;">'
                +'<img style="-webkit-user-select: none; cursor: -webkit-zoom-in;" src="'
                +url+selectedImage+'" width="705" height="469">'
                // +'<div id=MapDiv><ul id="searchList"><li><div><div>'
                +propDtlHtml+'</body></html>';
            var printMe = window.open('', 'Print');
            printMe.document.write(html);
            printMe.print();
          });

        $('#saveimg').click( function() {
            /*var a = $("<a>").attr("href", url+selectedImage).attr("download", selectedImage).appendTo("body");
            a[0].click();
            a.remove();*/
                        var propDtlHtml =  document.getElementById('mainAside').innerHTML.substring(document.getElementById('mainAside').innerHTML.indexOf('<div id="price">'));
             var html = '<html><head><meta name="viewport" content="width=device-width"><title>'
                        +selectedImage+' (1200×800)</title></head><body style="margin: 0px;">'
                        +'<img style="-webkit-user-select: none; cursor: -webkit-zoom-in;" src="'
                        +url+selectedImage+'" width="705" height="469">'
                        +propDtlHtml+'</body></html>';
            var textFileAsBlob = new Blob([html], {type:'text/html'});
            var fileNameToSaveAs = 'propertdetails.html';

            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);

            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }

            downloadLink.click();

        });

        function setSelectedProp(i) {
            $("#mapimg").removeClass().addClass(i);
            $("#messageimg").removeClass().addClass(i);
            $("#saveimg").removeClass().addClass(i);
            $("#socialimg").removeClass().addClass(i);
            $("#printimg").removeClass().addClass(i);
            $("#price p").html("Price: $"+propertyList[i].price);
            $("#beds").html("Beds: "+propertyList[i].bedrooms);
            $("#baths").html("Baths: "+propertyList[i].bathrooms);
            $("#area").html("Area: "+propertyList[i].area);
            $("#type").html("Type: "+propertyList[i].productType);
            $('.slider').empty();
            $('.slider').append(
                "<div class=\"bxslider\"> <img src="+propertyList[i].picture.linkFront+" width=100% height=270/>"
                    +"<img src="+propertyList[i].picture.linkBack+" width=102.5% height=270/>"
                    +"<img src="+propertyList[i].picture.linkLeft+" width=102.5% height=270/>"
                    +"<img src="+propertyList[i].picture.linkRight+" width=102.5% height=270/> </div>"
            );
            $('.bxslider').bxSlider({
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
                },
                 onSlideAfter: function($slideElement, oldIndex, newIndex){
                    switch(newIndex){
                        case 0:
                            selectedImage = propertyList[i].picture.linkFront;
                            break;
                        case 1:
                            selectedImage = propertyList[i].picture.linkBack;
                            break;
                        case 2:
                            selectedImage = propertyList[i].picture.linkLeft;
                            break;
                        case 3:
                            selectedImage = propertyList[i].picture.linkRight;
                            break;
                    }
                }

            });

            return false;
        };
        $("#propertyPriceSearch").live('click',function() {
            var i = $(this).attr('class');
            setSelectedProp(i);
        });
        
        $(document).ready(function(){
            console.log("Document Ready...");
            $('.bxslider').bxSlider({
                mode: 'horizontal',
                auto: true,
                pause: 2000,
                speed:1000,
                infiniteLoop:true,
                buildPager: function(slideIndex){
                    console.log("Document Ready..."+slideIndex);
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
                },
                 onSliderLoad: function(currentIndex){
                  console.log('Slider has finished loading. Click OK to continue!');
          },
          onSlideAfter: function($slideElement, oldIndex, newIndex){
                    switch(newIndex){
                        case 0:
                            selectedImage = propertyList[0].picture.linkFront;
                            break;
                        case 1:
                            selectedImage = propertyList[0].picture.linkBack;
                            break;
                        case 2:
                            selectedImage = propertyList[0].picture.linkLeft;
                            break;
                        case 3:
                            selectedImage = propertyList[0].picture.linkRight;
                            break;
                    }
          }
            });
        })


}



