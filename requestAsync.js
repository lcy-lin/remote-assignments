const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";
const axios = require('axios');

function requestCallback(url, callback) {
  const startTime = process.hrtime();
 // write code to request url asynchronously
    axios(url)
    .then(response => {
            const endTime = process.hrtime(startTime);
            callback(endTime[0] * 1000 + endTime[1] / 1000000);
        })
    .catch(err => console.error(err))
}
function requestPromise(url) {
  const startTime = process.hrtime();
 // write code to request url asynchronously with Promise
 return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        const endTime = process.hrtime(startTime);
        resolve(endTime[0] * 1000 + endTime[1] / 1000000);
      })
      .catch(error => {
        reject(error);
      });
  });
}
async function requestAsyncAwait(url) {
 // write code to request url asynchronously
 // you should call requestPromise here and get the result using
 // async/await.
 const startTime = process.hrtime();
  const result = await requestPromise(url);
  const endTime = process.hrtime(startTime);
  console.log(endTime[0] * 1000 + endTime[1] / 1000000);
}
requestCallback(url, console.log); // would print out the execution time
requestPromise(url).then(console.log);
requestAsyncAwait(url);