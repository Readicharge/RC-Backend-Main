


const getAddressByLatLong = async () => {
    try {
        const { latitude, longitude } = req.body;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAlr7wiWbiPhgKpWAN7lNSAxgwhujouyc4`
        );
    
        const data = await response.json();
        const address = data.results[0].formatted_address;
        res.json({ address });
      } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


module.exports = {
    getAddressByLatLong
}