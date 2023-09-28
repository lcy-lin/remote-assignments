const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";
const syncRequest = require('sync-request');
function requestSync(url) {
    // write code to request url synchronously
    let request = syncRequest('GET', url);
    let response = JSON.parse(request.getBody());
    console.log(response.data);
}
requestSync(url) // would print out the execution time
requestSync(url)
requestSync(url)

