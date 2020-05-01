const mongoose = require( 'mongoose' );

const bookmarksSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true 
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});

const bookmarksCollection = mongoose.model( 'Bookmark', bookmarksSchema );

const Bookmarks = {
    getAllBookmarks : function() {
        return bookmarksCollection
            .find()
            .then( (allBookmarks) => {
                return allBookmarks;
            })
            .catch( (err) => {
                return err;
            });
    },
    getBookmark : function(title) {
        return bookmarksCollection
            .find( { title } )
            .then( (bookmarks) => {
                return bookmarks;
            })
            .catch( (err) => {
                return err;
            });
    },
    createBookmark : function(bookmark) {
        return bookmarksCollection
            .create(bookmark)
            .then( (createdBookmark) => {
                return createdBookmark;
            })
            .catch( (err) => {
                return err;
            });
    },
    deleteBookmark : function(id) {
        return bookmarksCollection
            .remove( { id } )
            .then( (result) => {
                return result;
            })
            .catch( (err) => {
                return err;
            });
    },
    updateBookmark : function(id, bookmark) {
        return bookmarksCollection
            .findOneAndUpdate( { id }, { $set : bookmark },  { new : true } )
            .then( (result) => {
                return result;
            })
            .catch( (err) => {
                return err;
            });
    }
};

module.exports = { Bookmarks };