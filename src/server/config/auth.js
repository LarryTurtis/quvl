// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1172072612858943', // your App ID
        'clientSecret'  : '7275f7b2d137eace05968897b427d10b', // your App Secret
        'callbackURL'   : 'http://quvl.io/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://quvl.io/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '344130109996-epam45tq45so016d5knbar0insv8qvfv.apps.googleusercontent.com',
        'clientSecret'  : '-Xc4ufVOs5-cD6j2s5PVY9bV',
        'callbackURL'   : 'http://quvl.io/auth/google/callback'
    }

};