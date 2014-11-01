var msgSchema = mongoose.Schema({
    room: String,
    uid: String,
    time: Number,
    name: String,
    text: String,
    success: Boolean
});
msgSchema.index({ room: 1, time: -1 })
var Msg = mongoose.model('Msg', msgSchema);
module.exports = Vacation;
