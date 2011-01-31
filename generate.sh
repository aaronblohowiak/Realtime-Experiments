#!/usr/bin/env bash
echo "Creating new example: " $1
mkdir $1
cd $1
mkdir -p views/ public/ public/javascript/ public/css public/images
curl https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js > public/javascript/jquery.min.js
touch server.js Makefile public/javascript/app.js