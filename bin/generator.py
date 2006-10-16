#!/usr/bin/env python
''' Prints documentation with htmltmpl from the json data outputted by parser.py  ''' 
import os, re, simplejson, shutil
from cStringIO import StringIO 
from Cheetah.Template import Template

class YUIDocGen(object):

    def __init__(self, inpath, datafile, outpath, templatepath, showprivate=False):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

        def cleanseStr(str):
            cleanregex= re.compile(r"[^\w]")
            return cleanregex.sub('', str)

        self.inpath       = os.path.abspath(inpath)

        # set and output path, create if needed
        self.outpath      = os.path.abspath(outpath)
        _mkdir(self.outpath)

        self.templatepath = os.path.abspath(templatepath)

        # copy all of the directories from the template directory to the
        # destination directory.
        for i in os.listdir(self.templatepath):
            fullname = os.path.join(self.templatepath, i)
            if os.path.isdir(fullname):
                targetdir = os.path.join(self.outpath, i)
                try:
                    shutil.rmtree(targetdir)
                except: pass
                shutil.copytree(fullname, targetdir)


        self.showprivate  = showprivate

        f=open(os.path.join(inpath, datafile))
        self.rawdata = StringIO(f.read()).getvalue()
        d = self.data = simplejson.loads(self.rawdata)

        self.projectname = "Yahoo! UI Library"
        self.modulename  = "Unknown"
        self.moduledesc  = "Please supply a module block somewhere in your code"
        self.requires    = None
        if d["modules"]:
            for i in d["modules"]:
                module = d["modules"][i]
                self.modulename = i
                self.moduledesc = str(module["description"])
                if "requires" in module:
                    # self.requires = module["requires"].split(",")
                    self.requires = module["requires"]
                    

        self.cleansedmodulename = "module_" + cleanseStr(self.modulename)
    
        self.classname   = ""
        self.filename    = ""
        self.pagetype    = ""
        self.classmap    = d["classmap"]
        self.classnames  = d["classmap"].keys()
        self.classnames.sort()
        self.filemap     = d["filemap"]
        self.filenames   = d["filemap"].keys()
        self.filenames.sort()



    def write(self, filename, data):
        out = open(os.path.join(self.outpath, filename), "w")
        out.writelines(str(data))
        out.close()

    def process(self):

        def assignGlobalProperties(template):
            template.projectname  = self.projectname
            template.modulename   = self.modulename
            template.cleansedmodulename = self.cleansedmodulename 
            template.moduledesc   = self.moduledesc

            template.filename     = self.filename
            if self.filename:
                template.filepath = os.path.join(self.inpath, self.filename)

            template.pagetype     = self.pagetype
            template.classmap     = self.classmap
            template.classnames   = self.classnames
            template.filemap      = self.filemap
            template.filenames    = self.filenames
            template.classname    = self.classname
            template.requires     = self.requires
            template.properties = ""
            template.methods = ""
            template.events  = ""
            template.configs = ""
            template.extends = ""

        def transferToTemplate(prop, dict, template):
            val = ""
            if prop in dict:
                val = str(dict[prop])
            setattr(template, prop, val)

        def transferToDict(prop, dict1, dict2, default="", skipOverrideIfNoMatch=False):
            val = "" 
            if prop in dict1:
                val = str(dict1[prop])
                if not val: 
                    val = default
            else:
                if skipOverrideIfNoMatch:
                    pass
                else:
                    val = default

            dict2[prop] = val

        def getPropsFromSuperclass(superc, classes, dict):
            # get inherited data
            supercname = superc["name"]
            if "properties" in superc:
                inhdef = inherited["properties"][supercname] = []
                keys = superc["properties"].keys()
                keys.sort()
                for prop in keys:
                    superprop = superc["properties"][prop]
                    if self.showprivate or "private" not in superprop:
                        inhdef.append(prop)
            if "methods" in superc:
                inhdef = inherited["methods"][supercname] = []
                keys = superc["methods"].keys()
                keys.sort()
                for method in keys:
                    supermethod = superc["methods"][method]
                    if self.showprivate or "private" not in supermethod:
                        inhdef.append(method)
            if "events" in superc:
                inhdef = inherited["events"][supercname] = []
                keys = superc["events"].keys()
                keys.sort()
                for event in keys:
                    superevent = superc["events"][event]
                    if self.showprivate or "private" not in superevent:
                        inhdef.append(event)
            if "configs" in superc:
                inhdef = inherited["configs"][supercname] = []
                keys = superc["configs"].keys()
                keys.sort()
                for config in keys:
                    superconfig = superc["configs"][config]
                    if self.showprivate or "private" not in superconfig:
                        inhdef.append(config)

            if "extends" in superc:
                supercname = superc["extends"]
                if supercname in classes:
                    getPropsFromSuperclass(classes[supercname], classes, dict)

        # copy the json file
        jsonname = self.cleansedmodulename + ".json"
        print "Writing " + jsonname
        self.write(jsonname, self.rawdata)

        # index
        print "Generating index"
        t = Template(file=os.path.join(self.templatepath, "index.tmpl"))
        assignGlobalProperties(t)
        self.write("index.html", t)

        # module page
        print "Generating module splash"
        t = Template(file=os.path.join(self.templatepath, "main.tmpl"))
        assignGlobalProperties(t)
        self.write(self.cleansedmodulename + ".html", t)


        # class API view
        classes = self.data["classmap"]
        for i in classes:
            print "Generating API page for " + i
            self.classname = str(i)
            c = classes[i]

            # template items that need default vaules even if not included
            transferToTemplate( "see", c, t, )
            transferToTemplate( "deprecated", c, t, )
            transferToTemplate( "description", c, t, )
            transferToTemplate( "static", c, t, )
            if "static" in c: t.static = "static"
            transferToTemplate( "access", c, t, )
            if "private" in c: t.access = "private"
            elif "protected" in c: t.access = "protected"


            #subclasses
            subclasses = self.subclasses = []
            assignGlobalProperties(t)
            for j in classes:
                if "superclass" in classes[j] and classes[j]["superclass"] == i:
                    subclasses.append(j)
            t.subclasses = subclasses

            # Properties/fields
            props = t.properties = []
            if "properties" in c:
                keys = c["properties"].keys()
                keys.sort()
                for propertykey in keys:
                    prop     = c["properties"][propertykey]
                    if self.showprivate or "private" not in prop:
                        propdata = {"name": propertykey}
                        transferToDict( "type",        prop, propdata, "Object" )
                        transferToDict( "description", prop, propdata           )
                        transferToDict( "deprecated",  prop, propdata, "&nbsp;", True )
                        transferToDict( "see",         prop, propdata           )
                        transferToDict( "static",      prop, propdata           )
                        if "static" in prop: propdata["static"] = "static"
                        transferToDict( "access",   prop, propdata           )
                        if "private" in prop: propdata["access"] = "private"
                        elif "protected" in prop: propdata["access"] = "protected"
                        props.append(propdata)

            # configs
            configs = t.configs = []
            if "configs" in c:
                keys = c["configs"].keys()
                keys.sort()
                for configkey in keys:
                    config = c["configs"][configkey]
                    if self.showprivate or "private" not in config:
                        configdata = {"name": configkey}
                        transferToDict( "type",        config, configdata, "Object" )
                        transferToDict( "description", config, configdata           )
                        transferToDict( "deprecated",  config, configdata, "&nbsp;", True )
                        transferToDict( "see",         config, configdata           )
                        transferToDict( "static",      config, configdata           )
                        if "static" in config: configdata["static"] = "static"
                        transferToDict( "access",   config, configdata           )
                        if "private" in config: configdata["access"] = "private"
                        elif "protected" in config: configdata["access"] = "protected"
                        configs.append(configdata)

            # Methods
            methods = t.methods = []
            if "methods" in c:
                keys = c["methods"].keys()
                keys.sort()
                for methodkey in keys:
                    method = c["methods"][methodkey]
                    if self.showprivate or "private" not in method:
                        methoddata = {"name": methodkey}
                        transferToDict( "description", method, methoddata )
                        transferToDict( "deprecated",  method, methoddata, "&nbsp;", True )
                        transferToDict( "see",         method, methoddata )
                        transferToDict( "static",      method, methoddata )
                        if "static" in method: methoddata["static"] = "static"
                        transferToDict( "access",      method, methoddata )
                        if "private" in method: methoddata["access"] = "private"
                        elif "protected" in method: methoddata["access"] = "protected"

                        ret = methoddata["return"] = {"name":"", "description":"", "type":"void"}
                        if "return" in method:
                            transferToDict( "type",        method["return"], ret, "void" )
                            transferToDict( "description", method["return"], ret )
                            
                        params = methoddata["params"] = []
                        if "params" in method:
                            mp = method["params"]
                            for p in mp:
                                param = {}
                                transferToDict( "name",        p, param, "Unknown" )
                                transferToDict( "type",        p, param, "Object" )
                                transferToDict( "description", p, param )
                                params.append(param)

                        methods.append(methoddata)

            # Events
            events = t.events = []
            if "events" in c:
                keys = c["events"].keys()
                keys.sort()
                for eventkey in keys:
                    event = c["events"][eventkey]
                    if self.showprivate or "private" not in event:
                        eventdata = {"name": eventkey}
                        transferToDict( "description", event, eventdata )
                        transferToDict( "deprecated",  event, eventdata, "&nbsp;", True )
                        transferToDict( "see",         event, eventdata )
                        transferToDict( "static",      event, eventdata )
                        if "static" in event: eventdata["static"] = "static"
                        transferToDict( "access",      event, eventdata )
                        if "private" in event: eventdata["access"] = "private"
                        elif "protected" in event: eventdata["access"] = "protected"

                        params = eventdata["params"] = []
                        if "params" in event:
                            mp = event["params"]
                            for p in mp:
                                param = {}
                                transferToDict( "name",        p, param, "Unknown" )
                                transferToDict( "type",        p, param, "Object" )
                                transferToDict( "description", p, param )
                                params.append(param)

                        events.append(eventdata)


            # get inherited data
            inherited = t.inherited = {"properties":{}, "methods":{}, "events":{}, "configs":{}}
            if "extends" in c:
                supercname = t.extends = str(c["extends"])
                if supercname in classes:
                    superc = classes[supercname]
                    getPropsFromSuperclass(superc, classes, inherited)
                

            # Constructor -- technically the parser can take multiple constructors
            # but that does't help here
            constructordata = t.constructor = {}
            if "constructors" in c:
                constructor = c["constructors"][0]
                transferToDict( "description", constructor, constructordata )
                ret = constructordata["return"] = {}
                if "return" in constructor:
                    transferToDict( "type",        constructor["return"], ret, "void" )
                    transferToDict( "description", constructor["return"], ret )
                    
                params = constructordata["params"] = []
                if "params" in constructor:
                    cp = constructor["params"]
                    for p in cp:
                        param = {}
                        transferToDict( "name",        p, param, "Unknown" )
                        transferToDict( "type",        p, param, "Object" )
                        transferToDict( "description", p, param )
                        params.append(param)


            self.write("%s.html" %(self.classname), t)
        
        # clear out class name
        self.classname   = ""

        # class source view
        for i in self.data["filemap"]:
            print "Generating source view for " + i
            self.filename = str(i)
            assignGlobalProperties(t)
            self.write("%s.html" %(self.filename), t)



def main():
    from optparse import OptionParser
    optparser = OptionParser("usage: %prog inputdir [options] inputdir")
    optparser.set_defaults(outputdir="docs", inputfile="parsed.json")
    optparser.add_option( "-o", "--outputdir",
                          action="store", dest="outputdir", type="string",
                          help="Directory to write the html documentation" )
    optparser.add_option( "-f", "--file",
                          action="store", dest="inputfile", type="string",
                          help="The name of the file that contains the JSON doc info" )
    optparser.add_option( "-t", "--temlate",
                          action="store", dest="templatedir", type="string",
                          help="The directory containing the html tmplate" )
    (options, inputdirs) = optparser.parse_args()
    if len(inputdirs) > 0:
        generator = YUIDocGen( inputdirs[0], 
                               options.inputfile, 
                               options.outputdir,
                               options.templatedir )
        generator.process()
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()

