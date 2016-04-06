# CLI


Using request, grab an RSS feed from a news site and save it as a JSON.

Currently allowed: google, reddit, arstechnica.

```
node cli.js -r "https://news.google.com/news?q=node.js&output=rss"
Saved feeds/google.json

node cli.js --rss https://www.reddit.com/r/node/.rss
Saved feeds/reddit.json

node cli.js -r http://feeds.arstechnica.com/arstechnica/index/
Saved feeds/arstechnica.json

Multiple links at once
node cli.js -r https://www.reddit.com/r/node/.rss http://doesnt.work/example http://feeds.arstechnica.com/arstechnica/index/
```

# Server

Once the files have been downloaded, display the JSON files.

## Start the server

```
node server.js
```

## Individual Feed
If the file has been created by the CLI, then displaying is possible using `/feeds/:name`.

Ex: google

http://localhost:8080/feeds/google


## Combined Feed

The `/json` route will request all the saved feeds and combine them.


http://localhost:8080/json
