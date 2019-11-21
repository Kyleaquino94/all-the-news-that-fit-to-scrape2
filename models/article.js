var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId, //this is a foreign key to the note collection
        ref: "Note"
    }
});

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;
