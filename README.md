# Informative Website

A quick map.

## /

Root directory is where the NodeJS server would already live.

## /node_modules/

You'll again find node_modules after you've done `npm install`, though we
shouldn't need that many at all.

## /public/

Public-facing directory. This is where the client-side of our main app would
already be sitting.

### /public/info

The root directory of the client side of our informative website. We can avoid
clashes with the rest of the app if we keep everything here. Let's use it as
what `/public/` is for the main app. I.e., this directory will store a landing
`index.html` etc.

#### /public/info/css

All stylesheets for the informative website go here.

#### /public/info/fonts

All Font Awesome fonts used go here.

#### /public/info/img

All custom site images.

#### /public/info/js

Stores 3rd-party scripts used in the site.

#### /public/info/scripts

All self-written Javascript files go here.

##### /public/info/scripts/externals

All 3rd-party Javascript etc. files go here.

#### /public/info/skin

3rd-party CSS styling.

Feel free to add / change to this document