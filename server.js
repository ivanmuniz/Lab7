const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const validateToken = require('./middleware/validateToken');

const app = express();

app.use(morgan('dev'));
app.use(validateToken);

let bookmarks = [
    {
        id: uuid.v4(),
        title: "Bookmark 1",
        description: "Bookmark description 1",
        url: "www.bookmark1.com",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "Bookmark 2",
        description: "Bookmark description 2",
        url: "www.bookmark2.com",
        rating: 7
    },
    {
        id: uuid.v4(),
        title: "Bookmark 3",
        description: "Bookmark description 3",
        url: "www.bookmark3.com",
        rating: 9
    }
];

app.get("/bookmarks", (req, res) => {
    return res.status(200).json(bookmarks);
});

app.get("/bookmark", (req, res) => {
    let title = req.query.title
    if( !title ) {
        res.statusMessage = "The 'title' parameter is required";
        return res.status(406).end();
    }

    let response = [];
    bookmarks.forEach( (bookmark)  => {
        if(bookmark.title === title) {
            response.push(bookmark);
        }
    });

    if (response.length < 1) {
        res.statusMessage = `No bookmarks with title=${title} where found`;
        return res.status(404).end();
    }

    return res.status(200).json(response);
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
    bookmarks.push(bookmark);

    return res.status(201).json(bookmark);
});

app.delete("/bookmark/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);

    let bookmarkToRemove = bookmarks.findIndex( (bookmark) => {
        if(bookmark.id === id) {
            return true;
        }
    });
    
    if(bookmarkToRemove < 0) {
        res.statusMessage = `There is no bookmark with id=${id}`;
        return res.status(404).end();
    }

    bookmarks.splice(bookmarkToRemove, 1);
    return res.status(200).end();
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

    let bookmarkToUpdate = bookmarks.find(bookmark => bookmark.id === bodyId);

    // bookmarkToUpdate = {...bookmarkToUpdate, ...updatesInBookmark};
    Object.assign(bookmarkToUpdate, updatesInBookmark)

    return res.status(202).json(bookmarkToUpdate);
});


app.listen(80, () => {
    console.log("Application running in port 80.");
});