var form_bckup = $("<div>");
function get_tephi(lat,lon){

	var url          = "http://ready.arl.noaa.gov"
	var place_path   = "/ready2-bin/main.pl?Lat=" + lat + "&Lon=" + lon

	var form;

	//Get forecast type form
	$.ajax({
		type: "GET",
		url: url + place_path,
		success: function(data){
			form = data;
		},
		async: false
	});

	//Choose tephigram forecast
	var new_path = $($("option",form)[10]).val();

	//Get cycle form
	$.ajax({
		type: "GET",
		url: url + new_path,
		success: function(data){
			form = data;
		},
		async: false
	});

	//Choose the newest cycle available
	var form_data   = $("form", form).serialize();
	var form_action = $("form", form).attr("action");

	//Get date and captcha form and display it to the user
	$.ajax({
    type: "POST",
    url: url + form_action,
    data: form_data,
    success: function(data){
      form = data;
    },
    async: false
  });

  $("#content").html($("form",form));

  //Fix relative links
  $("form").find("img").attr("src", "http://ready.arl.noaa.gov" + $("form").find("img").attr("src"));
  $("form").attr("action", "http://ready.arl.noaa.gov" + $("form").attr("action"));


  $("form").submit(function(e) {
    //Prevent the form from submiting
    e.preventDefault();

    form_bckup.append($(this).clone());
    form_data = $(this).serialize();
    new_path  = this.action;

    $.ajax({
	    type: "POST",
	    url: new_path,
	    data: form_data,
	    success: function(data){
	      form = data;
	    },
	    async: false
	  });

    $("#content").html("");
	  var tephi_path = $($("img",form)[4]).attr("src");
	  var text_path  = $($("a",form)[10]).attr("href");


	  //Get tephi's text
		$.ajax({
			type: "GET",
			url: url + text_path,
			success: function(data){
				lines = data.split("\n");

				$("<table>", {id: "text1", class: "tephi-text"}).appendTo("#content");
				for(var i = 5; i < 23; ++i){
					var row = $("<tr>").appendTo("#text1");
					var text = lines[i].split(':');

					row.append("<td>"+text[0]);
					row.append("<td>"+text[1]);
				}

				$("<table>", {id: "text2", class: "tephi-text"}).appendTo("#content");
				for(var i = 24; i < lines.length - 2; ++i){
					if(i == 26 || i == 27){
						continue;
					}
					var row = $("<tr>").appendTo("#text2");
					var text = lines[i].split(/[ ,]+/)

					//row.append("<td>"+text[0]);
					row.append("<td>"+text[1]);
					row.append("<td>"+text[2]);
					row.append("<td>"+text[3]);
					
					

					if(i == 24 || i == 24){
						row.append("<td>"+text[4] + " " + text[5]);
						row.append("<td>"+text[7] + " " + text[8]);
						row.append("<td>"+text[8] + " " + text[9]);
						continue;
					}

					row.append("<td>"+text[4]);
					row.append("<td>"+text[5]);
					row.append("<td>"+text[6]);
				}
			},
			async: true
		});

		

		$("<a>", {href: "www.google.pt", id: "zoom", rel: url + tephi_path}).appendTo("#content");

		$("<img>", {
	    id: 'tephi',
	    src: url + tephi_path,
		}).appendTo("#zoom")
	});
}