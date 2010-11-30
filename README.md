# YUIDoc Doc parser

Updated yuidoc parser, written in js -- *early work in progress*

## Usage
    
Clone this repo, then:

    cd yuidocjs
    npm install .

    yuidoc /path/to/yui3/src/
    yuidoc /path/to/yui2/src/
    yuidoc ./test/

This will produce a data structure in `out/data.json` by default.


## Dav's Thoughts:


### Out dir formatting

Setting up the directory structure like this will help us build a nice templating system on
top of this data. It will give us the ability to include just part of the structure. It will
also help up when building the new YUILibrary.com site and importing all this data into MongoDB.

`./out` needs to look like this instead:
    ./out/
        data.json //Rollup of all metadata
        module1/
            data.json //metadata for only this module
        module2/
            data.json

### Parse only what we need to parse.

Keep a *state* file somewhere that shows the last time this doc tree was parsed
This way, we can do a stat on the file to see if it's mtime is greater than the
last parse time and only parse it if it is. This will allow us, in the future, to not reparse files
that have not changed. It should speed up the parse process for a large file set.

### Module Structure

I moved docparser into a module of it's own. The YUIDoc module should also be a standalone module.
We should make `cli.js` instantiate that class and run it. We also need to add a way to `export` 
these modules so they can be *required* in a script and coded against.
