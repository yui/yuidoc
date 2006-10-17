#!/usr/bin/env python
''' A class to parse Javadoc style comments out of javascript to document 
    an API. It is designed to parse one module at a time ''' 
import os, re, simplejson, string
import const
from cStringIO import StringIO 
from optparse import OptionParser

class YUIDoc(object):

    def __init__(self, inputdirs, outputdir, outputfile, extension):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

        def parseFile(path, file):
            f=open(os.path.join(path, file))
            fileStr=StringIO(f.read()).getvalue()
            print "parsing " + file
            # add a file marker token so the parser can keep track of what is in what file
            content = "\n/** @%s %s \n*/" % (const.FILE_MARKER, file)

            # copy
            out = open(os.path.join(self.outputdir, file), "w")
            out.writelines(fileStr)
            out.close()

            return content + fileStr

        def parseDir(path):
            subdirs = []
            dircontent = ""
            for i in os.listdir(path):
                fullname = os.path.join(path, i)
                if os.path.isdir(fullname):
                    subdirs.append(fullname)
                elif i.lower().endswith(self.extension):
                    dircontent += parseFile(path, i)

            for i in subdirs:
                dircontent += parseDir(i)

            return dircontent

        # An array containing each comment block
        self.matches = []
        
        # the remainder of the file with the comment blocks removed
        # self.stripped = ""

        # Dictionary of parsed data
        self.data = { const.CLASS_MAP: {}, const.MODULES: {} }

        self.currentNamespace = ""
        self.currentModule    = ""
        self.currentFile      = ""
        self.blocks = []
        self.inputdirs = inputdirs
        self.outputdir = os.path.abspath(outputdir)
        _mkdir(self.outputdir)
        self.extension = extension
        self.script=""

        for i in inputdirs: 
            path = os.path.abspath(i)
            self.script += parseDir(path)

        self.extract()

        for match in self.matches:
            self.parse(self.tokenize(match))
            

        out = open(os.path.join(self.outputdir, outputfile), "w")

        out.writelines(simplejson.dumps(self.data))
        out.close()


    def getClassName(self, classString, namespace):
        shortName = classString.replace(namespace + ".", "")
        longName  = namespace + "." + shortName
        return shortName, longName
        
    # extract string literals in case they contain the documentation pattern
    literals_pat = re.compile(r'(\'.*?(?<=[^\\])\')|(\".*?(?<=[^\\])\")')
    
    # the token we will use to restore the string literals
    replaceToken = '~~~%s~~~'
    
    # the pattern to restore the string literals
    restore_pat  = re.compile('~~~(\d+)~~~')
    
    # the pattern for extracting a documentation block and the next line
    docBlock_pat = re.compile('(/\*\*)(.*?)(\*/)([\s\n]*[^\/\n]*)?|(".*?")', re.S)
    
    # after extracting the comment, fix it up (remove *s and leading spaces)
    # blockFilter_pat = re.compile('^\s*\*', re.M)
    blockFilter_pat = re.compile('^[\s|\*|\n]*', re.M)

    # the pattern used to split a comment block to create our token stream
    # this will currently break if there are ampersands in the comments if there
    # is a space before it
    tokenize_pat = re.compile('^\s?(@\w\w\w*)', re.M);

    # separates compound descriptions: @param foo {int} a foo -> int, foo a foo
    # also:                            @param {int} foo a foo -> int, foo a foo
    compound_pat = re.compile('^\s*?(.*?)\{(.*)\}(.*)|^\s*?(\w+)(.*)', re.S);

    # pulls out the first word of the description parsed by compound_pat: foo, a foo
    param_pat = re.compile('^\s*?(\w+)(.*)', re.S);

    # tags that do not require a description, used by the tokenizer so that these
    # tags can be used above the block description without breaking things
    singleTags = "constructor public private protected static final"

    # guess the name and type of a block based upon the code following it
    guess_pat = re.compile('\s*?(var|function)?\s*?(\w+)\s*?[=:]\s*?(function)?.*', re.S)

    # Extracts all of the documentation comment blocks from the script
    def extract(self):

        # Array to keep track of string literals so they are not tokenized with
        # the rest of the comment block
        literals = []

        # removes string literals and puts in a placeholder
        def insertToken_sub(mo):
            literals.append(mo.group())
            return self.replaceToken % (len(literals) - 1)
    
        # restores string literals
        def restore_sub(mo):
            return literals[int(mo.group(1))]

        # guesses name and type
        def guess_sub(mo):
            type = "property"
            print mo.group(2)
            if mo.group(1) or mo.group(3):
                type = "function"

            self.guessedtype = type
            self.guessedname = mo.group(2) 

        # extracts the comment blocks
        def match_sub(match):
            if match.group(5):
                return match.group(5)
            else:
                # get the block and filter out unwanted chars
                block = self.blockFilter_pat.sub("", match.group(2))

                # restore string literals
                block = self.restore_pat.sub(restore_sub, block)

                # guess the name and type of the property/method based on the line
                # after the comment
                if match.group(4):
                    nextline = match.group(4)
                    mo = self.guess_pat.search(nextline)
                    if mo:
                        type = "property"
                        if string.find(nextline, "function") > 0:
                            type = "function"

                        block += "@guessedtype " + type + "\n"
                        block += "@guessedname " + mo.group(2) + "\n"

                if len(block) > 0:
                    self.matches.append(block)

                return ''

        # remove string literals
        script = self.literals_pat.sub(insertToken_sub, self.script)
    
        # extract comment blocks
        self.docBlock_pat.sub(match_sub, script)
        
        return script

    # Tokenize a single documentation block
    def tokenize(self, block):
        return self.tokenize_pat.split(block)

    # Parse the token stream for a single comment block
    def parse(self, tokens):

        tokensCopy = tokens[:] # shallow copy, we keep the orig for error msgs

        def peek():
            """ take a peek at the next token """
            if len(tokensCopy) > 0:
                return tokensCopy[0].strip()

        def next():
            """ grab the next token and remove it from the stack """
            if len(tokensCopy) > 0:
                return tokensCopy.pop(0).strip()

        def isTag(token):
            """ identify an attribute tag vs a description block """
            return token.strip()[:1] == "@"

        # extracts compound comment blocks .. like {type}
        def compound_sub(match):
            if match.group(4):
                return "", match.group(4) + match.group(5)
            else:
                return match.group(2), (match.group(1) + match.group(3)).strip()

        def parseParams(tokenMap, dict, srctag=const.PARAM, desttag=const.PARAMS):
            if srctag in tokenMap:
                # params must be an array because they need to stay in order
                if not desttag in dict: dict[desttag] = []
                for i in tokenMap[srctag]:
                    try:
                        type, description = self.compound_pat.sub(compound_sub, i)
                    except:
                        print i, tokenMap[i]
                        raise 

                    mo = self.param_pat.match(description)
                    if mo:
                        name = mo.group(1)
                        description = mo.group(2)
                        dict[desttag].append({  
                                const.NAME:        name,
                                const.TYPE:        type, 
                                const.DESCRIPTION: description 
                            })
                    else:
                        print "Error, could not parse param" + parsed

                tokenMap.pop(srctag)
            return dict 
 
        def parseReturn(tokenMap, dict):
            if const.RETURN in tokenMap:
                type, description = self.compound_pat.sub(compound_sub, tokenMap[const.RETURN][0])
                dict[const.RETURN] = { const.TYPE: type , const.DESCRIPTION: description }
                tokenMap.pop(const.RETURN)
            return dict

        token = next()
        tokenMap = {}
        blockInfo = {}
        target = None
        currentFor = ""
        while token != None:
            if isTag(token):
                token = token[1:].lower() # remove the @ and lowercase
                desc = ""

                # most tags require a description after, some do not
                if token not in self.singleTags and not isTag(peek()):
                    desc = next()
                    if not desc or isTag(desc):
                        if desc:
                            msg = "WARNING: expected a description block for tag @%s but \
found another tag @%s" % (token, desc)
                        else:
                            msg = "WARNING: expected a description block for tag @%s but \
it was empty" % token

                        print "\n" + self.currentFile + "\n" + msg + ":\n\n" + str(tokens) + "\n"


                # keep a map of the different tags we have found, with an
                # array to keep track of each occurrance
                if token not in tokenMap:
                    tokenMap[token] = []

                tokenMap[token].append(desc)

                # There are key pieces of info we need to have before we 
                # can properly set up the documemtation for this block
                if token == const.MODULE: self.currentModule    = desc

            else:
                # the first block without a description should be the description
                # for the block
                if token and const.DESCRIPTION not in tokenMap:
                    tokenMap[const.DESCRIPTION] = [token]
                else: pass # I don't think this can happen any longer

            token = next()

        self.blocks.append(tokenMap);
    
        if const.NAMESPACE in tokenMap:
            if not const.NAMESPACES in self.data: self.data[const.NAMESPACES] = []
            ns = tokenMap[const.NAMESPACE][0]
            self.currentNamespace = ns
            if ns not in self.data[const.NAMESPACES]:
                self.data[const.NAMESPACES].append(ns)
            tokenMap.pop(const.NAMESPACE)

        # @for tells the parser either that the class that is being parsed is an inner class
        # or, in the case of it being defined outside of a class definition, that an inner
        # class definition is complete and we need to resume processing the remainder of the
        # outer class
        if const.FOR in tokenMap:
            shortName, longName = self.getClassName(tokenMap[const.FOR][0], self.currentNamespace)
            currentFor = longName
            if const.CLASS not in tokenMap:
                if longName in self.data[const.CLASS_MAP]:
                    self.currentClass = longName
                else:
                    msg = "@for tag references a class that has not been defined"
                    raise ValueError, str(tokens) + " " + msg
                    
                tokenMap.pop(const.FOR)


        # use the guessed name and type if a block type was not found
        if const.CLASS not in tokenMap \
            and const.METHOD not in tokenMap \
            and const.PROPERTY not in tokenMap \
            and const.CONSTRUCTOR not in tokenMap \
            and const.EVENT not in tokenMap \
            and const.CONFIG not in tokenMap \
            and const.MODULE not in tokenMap:
            if "guessedname" in tokenMap:
                if "guessedtype" in tokenMap:
                    if tokenMap["guessedtype"][0] == "function":
                        tokenMap[const.METHOD] = tokenMap["guessedname"]
                    else:
                        tokenMap[const.PROPERTY] = tokenMap["guessedname"]
        
        # The following tokens represent the core type of comment blocks that are
        # supported.  It is possible to have a comment block that does not fall into
        # one of these core categories.  It is assumed that these blocks are supplying
        # global or contextual metadata
  
        if const.FILE_MARKER in tokenMap:
            if not const.FILE_MAP in self.data: self.data[const.FILE_MAP] = {}
            #if not const.FILE_LIST in self.data: self.data[const.FILE_LIST] = []
            self.currentFile = desc
            file_name = tokenMap[const.FILE_MARKER][0]
            target = { "name": file_name, const.CLASS_LIST:[] }
            self.data[const.FILE_MAP][file_name] = target
            # self.data[const.FILE_LIST].append(target)
            tokenMap.pop(const.FILE_MARKER)

        elif const.CLASS in tokenMap:
            name = tokenMap[const.CLASS][0]
            if self.currentNamespace:
                shortName, longName = self.getClassName(name, self.currentNamespace)
            else:
                shortName = longName = name
            c = { "shortname": shortName, "name": longName, const.NAMESPACE: self.currentNamespace }
            self.currentClass = longName
               
            if longName in self.data[const.CLASS_MAP]:
                print "WARNING: %s - Class %s was redefined" %(tokens, longName)
            else:
                self.data[const.CLASS_MAP][longName] = c

            target = self.data[const.CLASS_MAP][longName]

            if currentFor and currentFor != longName: # this is an inner class
                if "innerClasses" not in target:
                    target["innerClasses"] = []

                target["innerClasses"].append(currentFor)
 
            if self.currentModule:
                target[const.MODULE] = self.currentModule
                self.data[const.MODULES][self.currentModule][const.CLASS_LIST].append(longName)

            if self.currentFile:
                target[const.FILE] = self.currentFile
                self.data[const.FILE_MAP][self.currentFile][const.CLASS_LIST].append(longName)

            # if "mixes" in tokenMap:
            if "extends" in tokenMap:
                shortName, longName = self.getClassName(tokenMap["extends"][0], self.currentNamespace)
                target["superclass"] = longName
                
            if "uses" in tokenMap:
                target["uses"] = [];
                for i in tokenMap["uses"]:
                    shortName, longName = self.getClassName(i, self.currentNamespace)
                    target["uses"].append(longName)

            ###############
            # if not const.CLASS_LIST in self.data:
                # self.data[const.CLASS_LIST] = []

            # self.data[const.CLASS_LIST].append(target)
            ############
            
            tokenMap.pop(const.CLASS)
                
        elif const.METHOD in tokenMap:
            c = self.data[const.CLASS_MAP][self.currentClass]
            method = tokenMap[const.METHOD][0]

            if not const.METHODS in c: c[const.METHODS] = {}
            
            if method in c[const.METHODS]:
                print "WARNING: %s - method %s was redefined (method overloading is not supported)" %(tokens, method)
            else:
                c[const.METHODS][method] = parseParams(tokenMap, {})
                c[const.METHODS][method] = parseReturn(tokenMap, c[const.METHODS][method])

            target = c[const.METHODS][method]

            tokenMap.pop(const.METHOD)

        elif const.EVENT in tokenMap:
            c = self.data[const.CLASS_MAP][self.currentClass]
            event = tokenMap[const.EVENT][0]

            if not const.EVENTS in c: c[const.EVENTS] = {}
            
            if event in c[const.EVENTS]:
                print "WARNING: %s - event %s was redefined" %(tokens, event)
            else:
                c[const.EVENTS][event] = parseParams(tokenMap, {})

            target = c[const.EVENTS][event]

            tokenMap.pop(const.EVENT)

        elif const.PROPERTY in tokenMap:
            c = self.data[const.CLASS_MAP][self.currentClass]
            property = tokenMap[const.PROPERTY][0]

            if not const.PROPERTIES in c: c[const.PROPERTIES] = {}
            
            if property in c[const.PROPERTIES]:
                print "WARNING: %s - Property %s was redefined" %(tokens, property)
            else:
                c[const.PROPERTIES][property] = {}

            target = c[const.PROPERTIES][property]

            tokenMap.pop(const.PROPERTY)

        elif const.CONFIG in tokenMap:
            c = self.data[const.CLASS_MAP][self.currentClass]
            config = tokenMap[const.CONFIG][0]

            if not const.CONFIGS in c: c[const.CONFIGS] = {}
            
            if config in c[const.CONFIGS]:
                print "WARNING: %s - Property %s was redefined" %(tokens, config)
            else:
                c[const.CONFIGS][config] = {}

            target = c[const.CONFIGS][config]

            tokenMap.pop(const.CONFIG)

        # module blocks won't be picked up unless they are standalone
        elif const.MODULE in tokenMap:
            module = tokenMap[const.MODULE][0]
            if not const.MODULES in self.data: self.data[const.MODULES] = {}
            target = self.data[const.MODULES][module] = { "name": module, const.CLASS_LIST: []}
            tokenMap.pop(const.MODULE)

        else:
            msg = "WARNING: doc block type ambiguous, no @class, @module, @method, \
or @property tag found.  This block may be skipped"
            print "\n" + self.currentFile + "\n" + msg + ":\n\n" + str(tokens) + "\n"

        # constructors are added as an array to the currentClass.  This makes it so
        # multiple constructors can be supported even though that is out of scope
        # for documenting javascript
        if const.CONSTRUCTOR in tokenMap:
            c = self.data[const.CLASS_MAP][self.currentClass]
            if not const.CONSTRUCTORS in c: c[const.CONSTRUCTORS] = []
            constructor = parseParams(tokenMap, { const.DESCRIPTION: tokenMap[const.DESCRIPTION][0] })
            c[const.CONSTRUCTORS].append(constructor)
            tokenMap.pop(const.CONSTRUCTOR)

        # process the rest of the tags
        if target != None:
            for token in tokenMap:
                if token not in target:
                    target[token] = tokenMap[token][0]
        else:
            msg = "WARNING no target, this block will be skipped"
            # print "\n" + self.currentFile + "\n" + msg + ":\n\n" + str(tokens) + "\n"

def main():
    optparser = OptionParser("usage: %prog [options] inputdir1 inputdir2 etc")
    optparser.set_defaults(outputdir="out",
                           outputfile="parsed.json", 
                           extension=".js")
    optparser.add_option( "-o", "--outputdir",
                          action="store", dest="outputdir", type="string",
                          help="Directory to write the parser results" )
    optparser.add_option( "-f", "--file",
                          action="store", dest="outputfile", type="string",
                          help="The name of the file to write the JSON output" )
    optparser.add_option( "-e", "--extension",
                          action="store", dest="extension", type="string",
                          help="The extension for the files that should be parsed" )
    (opts, inputdirs) = optparser.parse_args()
    if len(inputdirs) > 0:
        docparser = YUIDoc( inputdirs, 
                            opts.outputdir, 
                            opts.outputfile, 
                            opts.extension   )
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()
