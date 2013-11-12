//Google Maps
var _gaq = _gaq || [];
var map;
function initialize() {
  var mapOptions = {
    zoom: 9,
    center: new google.maps.LatLng(40, -8.21),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  //Map Events
  map.addListener('click', function(e) {
    var lat = e.latLng.lat();
    var lon = e.latLng.lng();

    $("#name").val("");
    $("#lat").val(lat);
    $("#lon").val(lon);
    $("#overlay").slideDown();
  });

  //Google Analytics
  _gaq.push(['_setAccount', 'UA-42257282-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}



google.maps.event.addDomListener(window, 'load', initialize);


//Click events
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get("data", function(data){
      var cache = data.data;
      $("#map-canvas").css("display","fixed");
      
      if(data.data.version != chrome.app.getDetails().version){
        make_notification(update_title, update_text);
        data.data.version = chrome.app.getDetails().version;
        chrome.storage.sync.set({data: data.data}, function(){;})
      }

      //Create each place entry
      if(!$.isEmptyObject(cache))
        $(cache.places).each(function(index){
          $("#list4 ul li:last").before("<li class=\"Place\" lat=\"" + this.lat + "\" lon=\"" + this.lon + "\">" + this.name + "</li><span class=\"rmPlace\" name=\"" + this.name + "\">x</span>");
        });

      //Add click handlers
      var link  = $(".Place");
      markers = [];

      
      link.each(function(index){
        this.addEventListener('click', function() {
          get_tephi($(this).attr("lat"),$(this).attr("lon"));
          $("#sub_place").text(" - " + $(this).text());
          $("title").text("TephiFinder" + $("#sub_place").text());
        });

      var rm_buttons = $(".rmPlace");

      chrome.storage.sync.get("data", function(data){
          places = data.data.places;
      });

      rm_buttons.each(function(i,p){
        p.addEventListener('click', function() {
          remove_place(places, $(this).attr("name"));

          chrome.storage.sync.set({data: {places:places}}, function(){;})

          console.log(this)
          $(this).prev().remove();
          $(this).remove();
        });
      });

        //Add gmaps markers
        markers.push(new google.maps.Marker({
            position: new google.maps.LatLng($(this).attr("lat"), $(this).attr("lon")),
            map: map,
            title: $(this).text()
          })
        );
      });

      var bounds = new google.maps.LatLngBounds();
      $(markers).each(function(item,m){
        bounds.extend(m.position);
      });
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });
    


    //Overlay Events
    $(".NewPlace")[0].addEventListener('click', function() {
        $("#name").val("");
        $("#lat").val("");
        $("#lon").val("");
        $("#overlay").slideDown();
      });

    $("#save")[0].addEventListener('click', function() {
        if($("#lat").val() == "" || $("#lon").val() == "" || $("#name").val() == ""){
          alert("Please fill in all the fields.");
          return;
        }

        chrome.storage.sync.get("data", function(data){
          if(data.data === undefined || data.data.places === undefined){
            var data  = {};
            data.data = {};
            data.data.places = [];
          }

          data.data.places.push({name: $("#name").val(),
                            lat:  $("#lat").val().replace(",", "."),
                            lon:  $("#lon").val().replace(",", ".")});

          chrome.storage.sync.set({"data": data.data}, function(){
          $("#list4 ul li:last").before("<li class=\"Place\" lat=\"" + $("#lat").val().replace(",", ".") + "\" lon=\"" + $("#lon").val().replace(",", ".") + "\">" + $("#name").val() + "</li><span class=\"rmPlace\" name=\"" + this.name + "\">x</span>");
          $("#list4 ul span:last")[0].addEventListener('click', function() {
            remove_place(places, $(this).attr("name"));

            chrome.storage.sync.set({data: {places:places}}, function(){;})

            console.log(this)
            $(this).prev().remove();
            $(this).remove();
          });

          $("#list4 ul li").eq(-2)[0].addEventListener('click', function() {
            get_tephi($(this).attr("lat"),$(this).attr("lon"));
          });

          $("#overlay").slideUp();
          });
        });
      });

    $("#get")[0].addEventListener('click', function() {
        if($("#lat").val() == "" || $("#lon").val() == ""){
          alert("Please fill in the coordinates fields.");
          return;
        }

        get_tephi($("#lat").val(),$("#lon").val());
        $("#overlay").slideUp();
      });

    $("#close")[0].addEventListener('click', function() {
        $("#overlay").slideUp();
      });
});







