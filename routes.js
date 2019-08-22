const express = require('express');
const router = express.Router();

const dbOperations = require('./db/db-operations');

// request to /flower.html?userId=ashwin will render our flower.html page
router.get('/flower.html', (req, res) => {
    res.render('flower.html', {
        userId: req.query.userId
    });
});
 
router.get('/bee.html', (req, res) => {
    res.render('bee.html', {
        userId: req.query.userId
    });
});

router.get('/data.html', (req, res) => {
    res.render('data.html');
});

router.get('/bees', async (req, res) => {
    /*
        extract the latitude and longitude info from the request query params.
        Then, fetch the nearest cops using MongoDB's geospatial queries and return it back to the client.
    */
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const nearestBees = await dbOperations.fetchNearestbees([longitude, latitude], 2000);

    res.json({
        bees: nearestBees
    });
});

router.get('/bees/info', async (req, res) => {
    const userId = req.query.userId // xtract userId from query params
    const beeDetails = await dbOperations.fetchBeeDetails(userId);

    res.json({
        beeDetails: beeDetails
    });
});

// fetch all requests
router.get('/requests/info', async (req, res) => {
    const results = await dbOperations.fetchRequests();
    const features = [];

    for (let i = 0; i < results.length; i++) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: results[i].location.coordinates
            },
            properties: {
                status: results[i].status,
                requestTime: results[i].requestTime,
                address: results[i].location.address
            }
        });
    }

    const geoJsonData = {
        type: 'FeatureCollection',
        features: features
    }

    res.json(geoJsonData);
});

module.exports = router;