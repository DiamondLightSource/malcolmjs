Fork of The Graph Editor for Zebra2 prototype
================

This project provides a set of [Web Components](http://www.polymer-project.org/) for viewing and editing flow-based programming graphs. The focus is on performance, usage of modern web technologies, and touchscreen friendliness.

The graph widgets have the following dependencies:

* [Polymer](http://www.polymer-project.org/) for providing various polyfills for emerging web technologies like custom elements and pointer events
* [React](http://facebook.github.io/react/) for the "virtual DOM" to make SVG fast
* [KLay Layered](http://rtsys.informatik.uni-kiel.de/confluence/display/KIELER/KLay+Layered) graph autolayout via [KLayJS](https://github.com/automata/klay-js)

## Installation

Get dependencies using [Bower](http://bower.io/) and Browserify (via npm and grunt). Note that we need to set the proxy beforehand, and can't install anything globally:
    
    npm install bower grunt-cli http-server
    ./node_modules/.bin/bower install
    npm install
    ./node_modules/.bin/grunt build

## Running

    ./node_modules/.bin/http-server -c-1 .
    firefox http://localhost:8080/the-graph-editor/2dirpcomp.html

## Screenshot

[2 direction position compare screenshot](https://github.com/thomascobb/the-graph/raw/master/2dirposcomp.gif)

## License

The MIT License (MIT)

Copyright (c) 2014 the-grid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
