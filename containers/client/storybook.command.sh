#!/bin/sh
rm -f ./node_modules/*
rm -f ./node_modules/.bin
ln -s /save/node_modules/* ./node_modules
ln -s /save/node_modules/.bin ./node_modules/.bin
npm run storybook