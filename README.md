# To-do List

A small Express application for creating lists and saving tasks in MongoDB. It combines server-rendered pages, form submissions, and persistent data in a single application.

## Tech stack

Node.js · Express · EJS · MongoDB · Mongoose · Lodash

## What it does

- Shows a default list with a date-based heading.
- Creates named lists from their URLs.
- Adds and removes tasks from either type of list.

## Implementation

[app.js](app.js) contains the routes and persistence logic. The default list stores individual items in a collection; named lists embed their items in a list document. EJS templates share the presentation, and MongoDB updates remove items by ID.

## Run locally

The project records Node 14.16.0 as its original runtime. Configure the connection in `app.js` to use your own development MongoDB database.

```sh
npm ci
node app.js
```

Open [localhost:3000](http://localhost:3000). The dependency stack is from the original learning project; no automated test suite is configured.
