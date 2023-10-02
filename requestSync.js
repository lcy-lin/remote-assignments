const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";
const syncRequest = require('sync-request');
function requestSync(url) {
    const startTime = process.hrtime();
    // write code to request url synchronously
    let request = syncRequest('GET', url);
    const endTime = process.hrtime(startTime);
    console.log(endTime[0] * 1000 + endTime[1] / 1000000);
}
requestSync(url) // would print out the execution time
requestSync(url)
requestSync(url)

