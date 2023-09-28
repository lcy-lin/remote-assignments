const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";
const axios = require('axios');

function requestCallback(url, callback) {
 // write code to request url asynchronously
    axios(url)
    .then(response => {
            callback(response.data.data);
        })
    .catch(err => console.error(err))
}
function requestPromise(url) {
 // write code to request url asynchronously with Promise
 return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response.data.data);
      })
      .catch(error => {
        reject(error); // Reject with the error if the request fails
      });
  });
}
async function requestAsyncAwait(url) {
 // write code to request url asynchronously
 // you should call requestPromise here and get the result using
 // async/await.
  const result = await requestPromise(url);
  console.log(result);
}
requestCallback(url, console.log); // would print out the execution time
requestPromise(url).then(console.log);
requestAsyncAwait(url);