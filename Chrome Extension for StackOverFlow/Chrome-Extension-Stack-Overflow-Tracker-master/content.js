var loading_time = "";
var tags_of_question = [];
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var tag_div = document.getElementsByTagName('div');

    if(tag_div){
        tag = document.getElementsByClassName('post-tag js-gps-track'),i = tag.length;
        console.log(tag);
        while (i--) {
            var x = tag[i].innerHTML;
            if(tags_of_question.indexOf(x)<0){
                tags_of_question.push(x);
            }
        }
    }
    console.log(tags_of_question);
    var result = new Object();
    result.url = window.pageUrl;
    var now = (new Date()).toJSON();
    result.timestamp = now;
    console.log(target);
    console.log(target.className);
    console.log(target.value);
    if (target.className === "question-hyperlink") {
        result.activity = "ClickOnQuestion!";
        result.question = target.innerText;
        result.url = result.question;
        result.tags = tags_of_question;
    }

    else if (target.className.match(/^vote-up-off.*$/)){
        result.activity = "UpVote!";
        result.tags = tags_of_question;
    }
    else if (target.className.match(/^vote-down-off.*$/)){
        result.activity = "DownVote!";
        result.tags = tags_of_question;
    }
    else if (target.className === "star-off star-on"){
        result.activity = "BookMark!";
        result.tags = tags_of_question;
    }
    if (result.activity) {
        chrome.runtime.sendMessage(result, function(response) {
            console.log(result);
            console.log(response.ack);
        });
    }
}, false);

document.addEventListener('copy', function(e) {

    var highlight = window.getSelection().toString();
    if(highlight) {
        var result = new Object();
        result.url = window.pageUrl;
        result.activity = "Copy!";
        var now = (new Date()).toJSON();
        result.timestamp = now;
        result.data = highlight;
        if (result.activity) {
            chrome.runtime.sendMessage(result, function(response) {
                console.log(response.ack);
            });
        }
    }
});

//TRACKING MOUSE COORDINATES
var pageCoords = [];

document.onmouseleave = function(e) {
    window.mouseX = 0;
    window.mouseY = 0;
};;

document.onmousemove = function(e) {
    var event = e || window.event;
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
    window.pageUrl = window.location.href;
};

function recordCoords() {
    if (window.mouseX && window.mouseY && !(window.mouseX==0) && !(window.mouseY==0)){
        pageCoords.push({
            x: window.mouseX,
            y: window.mouseY
        });

    };

};

window.onload = function() {
    setInterval(recordCoords, 500);
};

window.onbeforeunload = function() {
    loading_time = new Date();
    var result = new Object();
    var now = (new Date()).toJSON();
    console.log("Below is window object");
    console.log(window);
    // var divs = document.getElementsByTagName("div"), i=divs.length;
    //Remove Duplicate Tags!!!!
    var tag_div = document.getElementsByTagName('div');
    if(tag_div){
        tag = document.getElementsByClassName('post-tag js-gps-track'),i = tag.length;
        console.log(tag);
        while (i--) {
            var x = tag[i].innerHTML;
            if(tags_of_question.indexOf(x)<0){
                tags_of_question.push(x);
            }
        }
    }
    // tags_of_question= document.getElementsByClassName('post-tag js-gps-track').constructor;
    console.log(tags_of_question);
    result.tags = tags_of_question;
    result.timestamp = now;
    result.url = window.pageUrl;
    result.activity = "PageBrowse!";
    result.coords = pageCoords;

    chrome.runtime.sendMessage(result, function(response) {

        console.log(result);
        console.log(response.ack);
    });
};
