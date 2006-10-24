#!/bin/sh

##############################################################################

# The location of your yuidoc install
yuidoc_home=~/www/yuidoc/yuidoc

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
#     parser_in="%HOME/www/yahoo.dev/src/js %HOME/www/Event.dev/src"
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
# usage: parser.py [options] inputdir1 inputdir2 etc
#
# options:
# -oOUTPUTDIR, --outputdir=OUTPUTDIR
#       Directory to write the parser results
# -fOUTPUTFILE, --file=OUTPUTFILE
#       The name of the file to write the JSON output
# -eEXTENSION, --extension=EXTENSION
#       The extension for the files that should be parsed
##############################################################################

$yuidoc_home/bin/parser.py $parser_in -o $parser_out

##############################################################################
# usage: generator.py inputdir [options]
# 
# options:
# -oOUTPUTDIR, --outputdir=OUTPUTDIR
#       Directory to write the html documentation
# -fINPUTFILE, --file=INPUTFILE
#       The name of the file that contains the JSON doc info
# -tTEMPLATEDIR, --temlate=TEMPLATEDIR
#       The directory containing the html tmplate
# -s, --showprivate     
#       Should private properties/methods be in the docs?
##############################################################################

if [ $? -eq 0 ]; then
    $yuidoc_home/bin/generator.py $parser_out -o $generator_out -t $template
fi


