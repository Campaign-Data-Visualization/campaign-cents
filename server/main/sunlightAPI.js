var api = require("sunlight-congress-api");

api.init({
  key: '49e2cbc00fdd496bbd036a26d1858d33',
  url: "https://congress.api.sunlightfoundation.com/"
});

var success = function(data){
    console.log("This was a successful Open Congress API call", data);
}

//api.votes().filter("year", "2012").call(success);

api.legislators().filter("first_name", "John").call(success);