function open_in_a_tab(){
  chrome.tabs.create({url: "/main.html"});
}

open_in_a_tab();