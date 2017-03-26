// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

var docSchema = mongoose.Schema({
    name: String,
    revisions: [{
        id: Number,
        doc: String,
        operations: [{
            start: Number,
            end: Number
        }]
    }],
    docId: Number,
    authorId: Number,
    sharedWith: [String],
    comments: [{
        commentId: Number,
        author: String,
        content: String,
        created_at: { type: Date, default: Date.now },
        authorId: Number,
        author: String,
        picture: String,
        index: Number
    }]
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Doc', docSchema);