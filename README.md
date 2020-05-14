# Web Applications Development: Laboratory 7– Bookmarks CRUD

## Requirements
- NodeJs v13.12.0
- MongoDB v4.2.6

## Turn on the database server:
Open a new terminal and run:  
`mongod`  
If that fails, run:  
`brew services start mongodb-community`

## To run the code:
```
npm install
npm start
```
## Endpoints

| Method | Link | Description |
| ------- | -------------------------- | ---- |
| GET: | http://localhost:80/bookmarks | Returns all bookmark |
| POST: | http://localhost:80/bookmarks | Creates a new bookmark |
| GET: | http://localhost:80/bookmark?title=BookmarkName | Get all bookmarks with a certain title |
| DELETE: | http://localhost:80/bookmark/:id | Delete a bookmark |
| PATCH: | http://localhost:80/bookmark/:id | Update a bookmark 
