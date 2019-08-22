const mongoose = require('mongoose');

/**
 * Represents a Bee's Schema.
 * @constructor
 */
const beeShema = mongoose.Schema({
	userId: { type: String, unique: true, required: true, trim: true },
	displayName: { type: String, trim: true },
	phone: { type: String },
	email: { type: String, unique: true },
	earnedRatings: { type: Number },
	totalRatings: { type: Number },
	location: {
		type: {
			type: String,
			required: true,
			default: "Point"
		},
		address: { type: String },
		coordinates: [ Number ],
	}
});

beeShema.index({"location": "2dsphere", userId: 1});

/**
 * Represents a Bee.
 * @constructor
 */
const Bee = mongoose.model('Bee', beeShema);

/**
 * Represents a request Schema.
 * @constructor
 */
const requestSchema = mongoose.Schema({
	requestTime: { type: Date },
	location: {
		coordinates: [ Number ],
		adress: { type: String }
	},
	flowerId: { type: String },
	beeId: { type: String },
	status: { type: String }
});

/**
 * Represents a Request.
 * @constructor
 */
const Request = mongoose.model('Request', requestSchema);

exports.Bee = Bee;
exports.Request = Request;