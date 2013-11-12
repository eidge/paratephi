update_title = "Tephigram Finder was updated"

update_text  = "Temperature gradients are now calculated and displayed in the right handside table."

function make_notification(title, text){
	var notification = webkitNotifications.createNotification(
														  'icon.png',
														  title,
														  text
														).show();
}