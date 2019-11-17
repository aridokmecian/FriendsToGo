var express = require('express')
var prettyjson = require('prettyjson');
const router = express.Router();


const googleMapsClientGeocode = require('@google/maps').createClient({
    key: 'AIzaSyDu8YWr2AnovjthlMPaJ-RfrXeghCt1Ukg',
    Promise: Promise
  });

  const googleMapsClientPlaces = require('@google/maps').createClient({
    key: 'AIzaSyBDt1MrMe8V_FVK3sEjIDdgs2PDkvVvnW0',
    Promise: Promise
  });

const getGeocode = async (addr) => {
  try {
    const response = await googleMapsClientGeocode.geocode({address: addr}).asPromise();
    return (response.json.results[0]["geometry"]["location"]);
  } catch (error) {
    console.error(error);
  }
}

router.get("/", async (req, res) => {
  var addone
  var addtwo
     var addone = await getGeocode(req.query.addrone);
     var addtwo = await getGeocode(req.query.addrtwo);

  var x = (addone.lat + addtwo.lat) / 2;
  var y = (addone.lng + addtwo.lng) / 2;

  var obj = await getPlaces(req.query.poi, x, y);

  i = 0 
  var out = ""
  while (i < 4 )
   res.write(obj[i]['name'] + " | " + obj[i++]['formatted_address']  + '\n')
  res.end()
});


router.get('/geocode', async (req, res) => {
  res.send(await getGeocode(req.addr));
});

const getPlaces = async (categorie, lat, lng) => {
  try {
    const response = await googleMapsClientPlaces.places({query: categorie, location : [lat, lng]}).asPromise();
    return (response.json.results);
  } catch (error) {
    console.error(error);
  }
}

router.get("/places", async (req, res) =>{
  res.send(await getPlaces("points of interest", 37.4220, -122.0841));
})

router.get("/coordinate", (req, res) => {
  var x = (req.query.xone + req.query.xtwo) / 2
  var y = (req.query.yone + req.query.ytwo) / 2
  res.send({x,y})
});

module.exports = router;