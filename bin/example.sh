#!/bin/sh
# The location of your yuidoc install
yuidoc_home=~/www/yuidoc/yuidoc

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
#     parser_in="%HOME/www/yahoo.dev/src/js %HOME/www/Event.dev/src"
parser_in="$HOME/www/Event.dev/src"

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=~/www/docs/parser

# The directory to put the html file outputted by the generator
generator_out=~/www/docs/generator

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=$yuidoc_home/template

##############################################################################
# add -s to the end of the line to show items marked private

$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template

