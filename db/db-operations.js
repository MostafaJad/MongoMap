const dataModel = require('./data-model');

const Bee = dataModel.Bee;
const Request = dataModel.Request;

function fetchNearestBees(coordinates, maxDistance) {
    return Bee.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    })
    .exec()
    .catch(error => {
        console.log(error);
    });
}

function fetchBeeDetails(userId) {
    return Bee.findOne({
        userId: userId
    }, {
        beeId: 1,
        displayName: 1,
        phone: 1,
        location: 1
    })
    .exec()
    .catch(error => {
        console.log(error);
    });
}

function saveRequest(requestId, requestTime, location, flowerId, status){
    const request = new Request({
        "_id": requestId,
        requestTime: requestTime,
        location: location,
        flowerId: flowerId,
        status: status
    });

    return request.save()
        .catch(error => {
            console.log(error)
        });
}

function updateRequest(issueId, beeId, status) {
    return Request.findOneAndUpdate({
        "_id": issueId
    }, {
        status: status,
        beeId: beeId
    }).catch(error => {
        console.log(error);
    });
}

function fetchRequests() {
    return new Promise( (resolve, reject) => {
        try {
            const requestsData = [];

            const stream = Request.find({}, {
                requestTime: 1,
                status: 1,
                location: 1,
                _id: 0
            }).stream();

            stream.on("data", function (request) {
                requestsData.push(request);
            });

            stream.on("end", function () {
                resolve(requestsData);
            });

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.fetchNearestBees = fetchNearestBees;
exports.fetchBeeDetails = fetchBeeDetails;
exports.saveRequest = saveRequest;
exports.updateRequest = updateRequest;
exports.fetchRequests = fetchRequests;