var Behavior = require('../models/behavior');
var mongoose = require('mongoose');

mongoose.plugin(schema => { schema.options.usePushEach = true });
module.exports = {
    addLog: function(userId, type, dateTime, data, time_taken) {
        let newBehavior = new Behavior();
        newBehavior.userId = userId;
        newBehavior.type = type;
        newBehavior.dateTime = dateTime;
        newBehavior.data = data;
        newBehavior.time_taken = time_taken;

        newBehavior.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
        });
    },
}
