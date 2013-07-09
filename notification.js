update_title = "Tephigram Finder was updated"

update_text  = "The time for the tephigram is now chooseable in the tephigram view."

function make_notification(title, text){
	var notification = webkitNotifications.createNotification(
														  'icon.png',
														  title,
														  text
														).show();
}