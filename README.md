# Experiments in realtime web application development.

The purpose of these projects is to spike on different code concepts to see what works and learn about the implications of design decisions before committing to a particular implementation.

## Build one to throw away.
So, I'm actually building many to throw away.  The best way to figure this stuff out is just to do it over and over in passes, increasing the complexity and throwing stuff out as it starts getting ugly.

All instructions are given relative to the Realtime-Experiments root directory.

### Installation:

1. Clone the repo
2. cd deps/
3. npm link

## Experiments:


### ViewCount
A quick little experiment in sharing the views between client and server, and having the view re-render when the associated object changes (re-render on any update) without having to manually wire the div element to the object.

Open it up in two browsers. When you open the second browser, the viewcount should update in the original browser.  When you cross the threshold of 10 views, you get an inspirational message ;)

`cd ViewCount && node server.js`

### ViewList
Build on the ViewCount to also support the concept of a stream, where updates are items to be prepended to the stream in the browser.

`cd ViewList && node server.js`

### Presence
Builds on the ViewList example to also support a collection with Add/Remove semantics.  There is a setInterval that will Add/Remove people from the `present` collection.  This is also bubbled up to the UI without re-rendering the entire collection.

`cd Presence && node server.js`