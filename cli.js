const snoowrap = require("snoowrap");
var dotenv = require("dotenv");
var yargs = require("yargs");

// ..Researching Purpose..
const fs = require("fs");

// Config
dotenv.config();

const Requester = new snoowrap({
    userAgent: process.env.USER_AGENT,
    clientId: process.env.REDDIT_APP_ID,
    clientSecret: process.env.REDDIT_APP_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});

// Sub Reddit

yargs.command({
    command: "sub",
    describe: "Get Subreddit",
    builder: {
        name: {
            describe: "Get Name Of Sub Reddit",
            type: "string",
            demandOption: true
        },
        hot: {
            describe: "Get Hot Sub Reddit Posts",
            type: "boolean",
            default: true,
            alias: "h"
        },
        top: {
            describe: "Get Top Sub Reddit Posts",
            type: "boolean",
            default: false,
            alias: "t"
        }
    },
    handler(argv) {
        // console.log(argv);
        if (argv.t) {
            Requester.getSubreddit(argv.name)
                .getTop()
                .map(post => [post.id, post.title, post.url])
                .then(console.log);
        } else {
            Requester.getSubreddit(argv.name)
                .getHot()
                .map(post => [post.id, post.title, post.url])
                .then(console.log);
        }
    }
});

// Submission

yargs.command({
    command: "submission",
    describe: "Get Details of Submission",
    builder: {
        id: {
            describe: "Search Submission using its ID",
            type: "string",
            demandOption: true
        }
    },
    handler(argv) {
        Requester.getSubmission(argv.id)
            .fetch()
            .then(data => {
                if (data.selftext) {
                    console.log(data.title, "\n", data.selftext);
                } else {
                    console.log(data.title);
                }
            });
    }
});

yargs.parse();
    