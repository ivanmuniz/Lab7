const API_KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateToken( req, res, next) {
    let apiKey = req.query.apiKey;
    let tokenBearer = req.headers.authorization;
    let bookApiKey = req.headers["book-api-key"];

    if(!tokenBearer && !apiKey && !bookApiKey) {
        res.statusMessage = "Unauthorized";
        return res.status(401).end();
    }
    
    if(apiKey) {
        if(apiKey !== API_KEY) {
            res.statusMessage = "The 'apiKey' token is invalid";
            return res.status(401).end();
        }
    } else if (tokenBearer) {
        if(tokenBearer !== `Bearer ${API_KEY}`) {
            res.statusMessage = "The 'authorization' token is invalid";
            return res.status(401).end();
        }
    } else {
        if(bookApiKey !== API_KEY) {
            res.statusMessage = "The 'book-api-key' token is invalid";
            return res.status(401).end();
        }
    }
    next();
}

module.exports = validateToken;
