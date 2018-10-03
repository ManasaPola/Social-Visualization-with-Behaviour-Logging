var mongoose = require('mongoose');

mongoose.plugin(schema => { schema.options.usePushEach = true });
var behaviorSchema = mongoose.Schema({
    Link: String,
    dateTime: String,
    activity: String,
    tags: [String],
    data: String,
    userId: String
});
var Behavior = mongoose.model('Behavior', behaviorSchema);
module.exports = Behavior;
