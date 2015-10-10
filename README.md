# Metadata pusher
Extracts metadata records from Knack database ([example](http://metadata.phila.gov)) and upserts them to CKAN.
Check [the wiki](https://github.com/CityOfPhiladelphia/metadata-pusher/wiki) for documentation on creating a CKAN test environment.

## Usage

First, install dependencies via:
```bash
$ npm install
```

Then create a `.env` file from `.env.sample` (you can use [demo.ckan.org](http://demo.ckan.org) to test)

To extract the records to CKAN format, use
```bash
$ node extract.js
```

To output the records in CKAN format to a file, use
```bash
$ node extract.js > FILENAME.json
```
Check out `sources/metadata.json` for an example file

To extract and push the records at the same time, use
```bash
$ node extract.js | node push.js
```

To run a web server that pushes datasets individually, use
```bash
$ node server.js
```
Then send a `POST` request to `http://<IP>:<PORT>/ckan/<Knack Dataset Id>` to push it to CKAN
