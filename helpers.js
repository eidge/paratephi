function remove_place(array, place_name){
	var rm_index = -1;

	$.each(array, function(i, p){
		if(p.name == place_name)
			rm_index = i;
	});

	if(rm_index != -1)
		array.splice(rm_index,1);
}

function make_notification(title, text){
	var notification = webkitNotifications.createNotification(
																										  'icon.png',
																										  title,
																										  text
																											).show();
}

function calc_gradient(text_sounding){
	var gradient = [];

	for(var i = 29; i < text_sounding.length - 2; ++i){
		var val1 = text_sounding[i-1].split(/[ ,]+/);
		var val2 = text_sounding[i].split(/[ ,]+/);

		gradient.push( (parseFloat(val2[3])-parseFloat(val1[3]))/(parseFloat(val2[2])-parseFloat(val1[2]))*100 );			
	}
	
	return gradient;	
}

$("#sub_place").text("");



