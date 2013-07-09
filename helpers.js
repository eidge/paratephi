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

$("#sub_place").text("");



