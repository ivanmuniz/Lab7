const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require( 'mongoose' );
const validateToken = require('./middleware/validateToken');
const { Bookmarks } = require( './models/bookmarkModel' );
const { DATABASE_URL, PORT } = require('./config');

const app = express();

app.use(morgan('dev'));
app.use(express.static("public"));
app.use(validateToken);

app.get("/bookmarks", (req, res) => {
    Bookmarks.getAllBookmarks()
        .then( (bookmarks) => {
            return res.status(200).json(bookmarks);
        })
        .catch( (err) => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        });
});

app.get("/bookmark", (req, res) => {
    let title = req.query.title

    if( !title ) {
        res.statusMessage = "The 'title' parameter is required";
        return res.status(406).end();
    }

    Bookmarks.getBookmark(title)
        .then( (bookmarks) => {
            if( bookmarks.length < 1 ) {
                res.statusMessage = `No bookmarks with title=${title} where found`;
                return res.status(404).end();
            }
            return res.status(200).json(bookmarks);
        })
        .catch( (err) => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        });
});

app.post("/bookmarks", express.json(), (req, res) =>{
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !title || !description || !url || !rating ) {
        res.statusMessage = "One of the fields is missing";
        return res.status(406).end();
    }

    let bookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating, rating
    }

    Bookmarks.createBookmark(bookmark)
        .then( (bookmark) => {
            if (bookmark.errmsg) {
                res.statusMessage = "We couldn't save the new bookmark. Please try again.";
                return res.status(409).end();
            }
            return res.status(201).json(bookmark);
        })
        .catch( (err) => {
            res.statusMessage = 'Something is wrong with the Database. Try again later.';
            return res.status(500).end();
        });
});

app.delete("/bookmark/:id", (req, res) => {
    let id = req.params.id;

    Bookmarks.deleteBookmark(id)
        .then( (result) => {
            if(result.deletedCount === 0) {
                res.statusMessage = `There is no bookmark with id=${id}`;
                return res.status(404).end();
            }
            return res.status(200).end();
        })
        .catch( (err) => {
            res.statusMessage = 'Something is wrong with the Database. Try again later.';
            return res.status(500).end();
        });
});

app.patch("/bookmark/:id", express.json(), (req, res) => {
    let routeId = req.params.id;
    let bodyId = req.body.id;
    let updatesInBookmark = req.body.bookmark;

    if ( !bodyId ) {
        res.statusMessage = "The 'id' is missing in the body of the request";
        return res.status(406).end();
    }

    if (routeId !== bodyId) {
        res.statusMessage = "The 'id' send in the body doesn't match with the one in the parameters";
        return res.status(409).end();
    }

    Bookmarks.updateBookmark(bodyId, updatesInBookmark)
        .then( (result) => {
            return res.status(202).json(result);
        })
        .catch( (err) => {
            res.statusMessage = 'Something is wrong with the Database. Try again later.';
            return res.status(500).end();
        });
});


app.listen( PORT, () => {
    console.log("Application running in port 80.");

    const settings = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    };

    new Promise( (resolve, reject) => {
        mongoose.connect( DATABASE_URL, settings, (err) => {
            if( err ) {
                return reject(err);
            }
            else {
                console.log("Database connected successfully.");
                return resolve();
            }
        });
    })
    .catch( (err) => {
        console.log( err );
    });
});