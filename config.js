/**
 * Created with IntelliJ IDEA.
 * User: user
 * Date: 9/12/13
 * Time: 12:02 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = {
    development: {
        fb:{
            appId: '548996441845195',
            appSecret: '3efa0ea33ba00a484830c28626b1259e',
            url: 'https://206.72.207.4:3030'
        },
        twitter:{
            TWITTER_CONSUMER_KEY: "aX5yhKcQU5YHQLKS08vRgg",
            TWITTER_CONSUMER_SECRET: "cX37DlsPLeW55zXAmrs1douL4B87Yd536EutZ2QqpA",
            url: "http://206.72.207.4:3000/auth/twitter/callback"
        },
        linkedin:{
            LINKEDIN_API_KEY: "77970wh9b8os92",
            LINKEDIN_SECRET_KEY: "XTj0TNj0eTbnU5cS",
            url: "http://206.72.207.4:3000/auth/linkedin/callback"
        },
        dbUrl: 'mongodb://localhost/LSR',
        serverUrl: 'https://206.72.207.4:3030'
    }
};
