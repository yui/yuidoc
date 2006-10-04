#!/bin/sh

##############################################################################

# The location of your yuidoc install
yuidoc_home=~/www/yuidoc/yuidoc

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.
parser_in=~/www/yahoo.dev/src/js

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=~/www/docs/parser

# The directory to put the html file outputted by the generator
generator_out=~/www/docs/generator

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=$yuidoc_home/template

##############################################################################

$yuidoc_home/bin/parser.py $parser_in -o $parser_out

$yuidoc_home/bin/generator.py $parser_out -o $generator_out -t $template

