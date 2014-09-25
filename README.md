YUIDoc Doc parser (Climax Media fork)
=================

YUIDoc is a [Node.js](http://nodejs.org/) application used at build time to
generate API documentation from code or other sources. YUIDoc is comment-driven and supports a wide
range of coding styles. The output of YUI Doc is API documentation formatted as a
set of HTML pages including information about methods, properties, custom events and
inheritance. YUIDoc was orignally written for the YUI Project;
it uses YUI JavaScript and CSS in the generated files and it supports common YUI
conventions like Custom Events. That said, it can be used easily and productively on non-YUI code.

Generating documentation from your code locally (optional)
------------

**Quick Start**

```
$ npm install -g climax-media/yuidoc
$ yuidoc --server -T climax .
```

**Installation and usage**

In general we will build documentation on our build servers so no additional work is required,
however you can preview your documentation locally before committing to the repository with the following steps:

1. Install [Node.js](http://nodejs.org/)
2. Install the Climax fork of YUIDoc

    ```
    $ npm install -g climax-media/yuidoc
    ```

3. Create a [configuration file](http://yui.github.io/yuidoc/args/index.html#json) at the root of the project you are documenting called `yuidoc.json`.  
Insert the appropriate information for your project.  Example:

    ```js
    {
      "name": "My API",
      "description": "An API for working with my data",
      "version": "1.0.0",
      "url": "https://www.mysite.ca/api",
      "logo": "http://www.mysite.com/assets/logo.png",
      "options": {
        "outdir": "./docs"
      }
    }
    ```

4. Run the generator from the root of your project:

  `yuidoc .`

Running a server for live preview
-------------

Optionally, you can start a webserver that refreshes the documentation as you write it:

`yuidoc --server .`

Then browse to `http://localhost:3000` to view the docs and refresh as you make changes.

Using the Climax theme
-------------

To specify a theme, supply the -T parameter.  You can use the custom Climax theme as follows:

  `yuidoc -T climax .`

Local npm installation
-------------

Create a `package.json` file:

```js
{
  "name": "My Project",
  "version": "1.0.0",
  "description": "",  
  "devDependencies": {
    "yuidocjs": "git://github.com/climax-media/yuidoc"
  },
  "scripts": {
    "start": "yuidoc --server -T climax ."
  }
}
```

Then run:

```
npm install
npm start
```

Documentation
-------------

   * [User Guides](http://yui.github.com/yuidoc/)
   * [API Docs](http://yui.github.com/yuidoc/api/)
   * [Support Mailing List](https://groups.google.com/forum/#!forum/yuidoc)

Released under the YUI BSD License
----------------------------------

    Copyright 2012 Yahoo! Inc.
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

       * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
       * Neither the name of the Yahoo! Inc. nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL YAHOO! INC. BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
