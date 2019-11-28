const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/search', (req, res) => {
    //console.log(req.query);
    const { location, radius } = req.query;
    const meterRadius = Math.floor(Number(radius) * 1609.34);
    if (radius > 24) {
        res.status(400).send("Sorry, the radius number can not be bigger than 24 miles")
    } else {
        let url = `https://api.yelp.com/v3/businesses/search?location=${location}&radius=${meterRadius}&term="bars"&limit=50`
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.KEY}`
            },
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                //res.setHeader('Access-Control-Allow-Origin',"*");
                if (data.error) {
                    res.status(400).send(data.error.code + "," + data.error.description)
                } else {
                    res.json(data)
                }
            })
    }

})

module.exports = router;