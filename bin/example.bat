@echo off

REM ##############################################################################

REM # The location of your yuidoc install
set yuidoc_home="c:\home\www\yuidoc\yuidoc"

REM # The location of the files to parse.  Parses subdirectories, but will fail if
REM # there are duplicate file names in these directories.
set parser_in="c:\home\www\yahoo.dev\src\js"

REM # The location to output the parser data.  This output is a file containing a 
REM # json string, and copies of the parsed files.
set parser_out="c:\home\www\docs\parser"

REM # The directory to put the html file outputted by the generator
set generator_out="c:\home\www\docs\generator"

REM # The location of the template files.  Any subdirectories here will be copied
REM # verbatim to the destination directory.
set template="%yuidoc_home%\template"

REM ##############################################################################

%yuidoc_home%\bin\parser.py %parser_in% -o %parser_out%

%yuidoc_home%\bin\generator.py %parser_out% -o %generator_out% -t %template%

