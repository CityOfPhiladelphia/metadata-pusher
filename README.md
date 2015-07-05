# Metadata pusher
Extracts metadata records from Knack database and upserts them to CKAN

## Usage

First, install dependencies via:
```bash
$ npm install
```

Then create a `.env` file from `.env.sample` (you can use [demo.ckan.org](http://demo.ckan.org) to test)

To push all the records, use
```bash
$ node push-all.js
```
(There's currently a `.splice()` in place to prevent all 200+ datasets being pushed)

To run a web server that pushes datasets individually, use
```bash
$ node server.js
```
Then send a `POST` request to `http://<IP>:<PORT>/ckan/<Knack Dataset Id>` to push it to CKAN
