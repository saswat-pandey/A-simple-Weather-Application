const yargs=require('yargs');
const request=require('request');
const axios=require('axios');


const argv=yargs
.options({
  a:{
    describe:"Address for the Fetching of the weather",
    demand:true,
    alias:'address',
    string:true//takes boolean value and parses the returned value as string when set to true
  }
})
.help()
.alias('help','h')
.argv;

const encodedAddress=encodeURIComponent(argv.address);
const geoCodeUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=Your key`;

axios.get(geoCodeUrl).then((response)=>{

  if(response.data.status==='ZERO_RESULTS'){
    throw new Error("Unable to find that address");
  }
  const address=response.data.results[0].formatted_address;
  const long=response.data.results[0].geometry.location.lng;
  const lat=response.data.results[0].geometry.location.lat;
  const weatherCodeUrl=`https://api.darksky.net/forecast/yourkey/${lat},${long}`;
  return axios.get(weatherCodeUrl);
}).then((response)=>{
var temperature=response.data.currently.temperature;
var humidity=response.data.currently.humidity;
var summary=response.data.currently.summary;

console.log(`The weather of :is as follows:
  temperature:${temperature}
  humidity:${humidity}
  summary:${summary}`);
}).catch((error)=>{
  if(error.code==='ENOTFOUND'){
    console.log("Unable to connect to the APIs server ");
  }else{
    console.log(error.message);
  }
});//Allows us to make the http get request.ans returns a promisse
