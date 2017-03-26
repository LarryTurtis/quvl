var request = require("request");

const GOOGLE_DEV_APP_ID = "344130109996-epam45tq45so016d5knbar0insv8qvfv.apps.googleusercontent.com";
const GOOGLE_PROD_APP_ID = "992044479616-52edhu43vtani4hia842mgot4h5ha14o.apps.googleusercontent.com";

exports.verifyFB = function(req, res, next) {
    request.get('https://graph.facebook.com/me?fields=name,email&access_token=' + req.body.token, function(err, response, body) {
        body = JSON.parse(body);
        if (req.body.id === body.id) {
            req.user = body;
            next();
        } else {
            res.status(401).send('Unauthorized')
        }
    });
}

exports.verifyGoogle = function(req, res, next) {
    request.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.token, function(err, response, body) {
        body = JSON.parse(body);
        if ((body.aud === GOOGLE_PROD_APP_ID || body.aud === GOOGLE_DEV_APP_ID) && body.sub === req.body.id) {
            req.user = body;
            next();
        } else {
            res.status(401).send('Unauthorized')
        }
    });
}
