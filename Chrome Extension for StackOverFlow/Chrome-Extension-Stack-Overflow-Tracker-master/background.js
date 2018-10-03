var sendPost = function(request) {
    $.ajax(
        {
            type: "POST",
            url: "http://localhost:8082/behavior",
            data: JSON.stringify({request}),
            contentType: "application/json",
            dataType: "json"
        }
    )
};
function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

//MESSAGE LISTENER FOR MESSAGES FROM CONTENT SCRIPT
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.activity) {
            console.log(typeof request);
            console.log(request);
            sendPost(request);
            sendResponse( {ack: 'Activity noted'} );
        }
        else {
            sendResponse( {ack: 'Empty activity discarded'});
        }
    }
);