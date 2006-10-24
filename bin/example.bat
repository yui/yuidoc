@ECHO OFF

REM ##########################################################################

REM The location of your yuidoc install
SET yuidoc_home="c:\home\www\yuidoc\yuidoc"

REM The location of the files to parse.  Parses subdirectories, but will fail if
REM there are duplicate file names in these directories.  You can specify multiple
REM source trees:
REM      SET parser_in="c:\home\www\yahoo.dev\src\js c:\home\www\Event.dev\src"
SET parser_in="c:\home\www\yahoo.dev\src\js"

REM The location to output the parser data.  This output is a file containing a 
REM json string, and copies of the parsed files.
SET parser_out="c:\home\www\docs\parser"

REM The directory to put the html file outputted by the generator
SET generator_out="c:\home\www\docs\generator"

REM The location of the template files.  Any subdirectories here will be copied
REM verbatim to the destination directory.
SET template="%yuidoc_home%\template"

REM The location of the crosslink data (not currently used)
SET crosslink="%yuidoc_home%\crosslink"

REM ##########################################################################
REM # usage: parser.py [options] inputdir1 inputdir2 etc
REM #
REM # options:
REM # -oOUTPUTDIR, --outputdir=OUTPUTDIR
REM #       Directory to write the parser results
REM # -fOUTPUTFILE, --file=OUTPUTFILE
REM #       The name of the file to write the JSON output
REM # -eEXTENSION, --extension=EXTENSION
REM #       The extension for the files that should be parsed
REM ##########################################################################

%yuidoc_home%\bin\parser.py %parser_in% -o %parser_out%

IF ERRORLEVEL 1 GOTO END

REM ##########################################################################
REM # usage: generator.py inputdir [options]
REM # 
REM # options:
REM # -oOUTPUTDIR, --outputdir=OUTPUTDIR
REM #       Directory to write the html documentation
REM # -fINPUTFILE, --file=INPUTFILE
REM #       The name of the file that contains the JSON doc info
REM # -tTEMPLATEDIR, --temlate=TEMPLATEDIR
REM #       The directory containing the html tmplate
REM # -cCROSSLINKDIR, --crosslink=CROSSLINKDIR
REM #       The directory containing json data for other modules to crosslink
REM # -s, --showprivate     
REM #       Should private properties/methods be in the docs?
REM ##########################################################################

%yuidoc_home%\bin\generator.py %parser_out% -o %generator_out% -t %template% -c %crosslink%


:END
