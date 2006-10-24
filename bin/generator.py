#!/usr/bin/env python
''' Prints documentation with htmltmpl from the json data outputted by parser.py  ''' 
import os, re, simplejson, shutil
from cStringIO import StringIO 
from Cheetah.Template import Template

class YUIDocGen(object):

    def __init__(self, inpath, datafile, outpath, templatepath, crosslinkpath, showprivate=False):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

       
        self.moduleprefix = "module_"
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
        self.modulename  = ""
        self.moduletitle  = ""
        self.moduledesc  = "Please supply a module block somewhere in your code"
        # self.requires    = None
        self.modules = d["modules"]
        self.modulenames = self.modules.keys()
        self.modulenames.sort()
        #if d["modules"]:
            #for i in d["modules"]:
                #module = d["modules"][i]
                #self.modulename = i
                #self.moduledesc = str(module["description"])
                #if "requires" in module:
                    ## self.requires = module["requires"].split(",")
                    #self.requires = module["requires"]
                    

        self.cleansedmodulename = self.cleanseStr(self.modulename)
    
        self.classname   = ""
        self.filename    = ""
        self.pagetype    = ""
        self.classmap    = d["classmap"]
        self.classnames  = ""
        self.filenames   = ""

    def cleanseStr(self, str):
            cleanregex= re.compile(r"[^\w]")
            return self.moduleprefix + cleanregex.sub('', str)

    def write(self, filename, data):
        out = open(os.path.join(self.outpath, filename), "w")
        out.writelines(str(data))
        out.close()

    def process(self):

        def assignGlobalProperties(template):
            template.projectname  = self.projectname
            template.modules      = self.modules
            template.modulenames  = self.modulenames
            template.modulename   = self.modulename
            template.moduletitle = self.moduletitle
            template.cleansedmodulename = self.cleansedmodulename 
            template.moduledesc   = self.moduledesc

            template.filename     = self.filename
            if self.filename:
                template.filepath = os.path.join(self.inpath, self.filename)

            template.pagetype     = self.pagetype
            template.classmap     = self.classmap
            template.classnames   = self.classnames
            template.filenames    = self.filenames
            template.classname    = self.classname
            template.requires     = ""
            template.properties = ""
            template.methods = ""
            template.events  = ""
            template.configs = ""
            template.extends = ""
            template.uses   = ""
            template.index = False # is this the index page

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

        def shouldShow(item):
            if "static" not in item and \
                    (self.showprivate or "private" not in item):
                return True
            else:
                 return False


        def getPropsFromSuperclass(superc, classes, dict):
            # get inherited data
            supercname = superc["name"]
            if "properties" in superc:
                inhdef = dict["properties"][supercname] = []
                keys = superc["properties"].keys()
                keys.sort()
                for prop in keys:
                    superprop = superc["properties"][prop]
                    if shouldShow(superprop):
                        inhdef.append(prop)
            if "methods" in superc:
                inhdef = dict["methods"][supercname] = []
                keys = superc["methods"].keys()
                keys.sort()
                for method in keys:
                    supermethod = superc["methods"][method]
                    if shouldShow(supermethod):
                        inhdef.append(method)
            if "events" in superc:
                inhdef = dict["events"][supercname] = []
                keys = superc["events"].keys()
                keys.sort()
                for event in keys:
                    superevent = superc["events"][event]
                    if shouldShow(superevent):
                        inhdef.append(event)
            if "configs" in superc:
                inhdef = dict["configs"][supercname] = []
                keys = superc["configs"].keys()
                keys.sort()
                for config in keys:
                    superconfig = superc["configs"][config]
                    if shouldShow(superconfig):
                        inhdef.append(config)

            if "extends" in superc:
                supercname = superc["extends"]
                if supercname in classes:
                    getPropsFromSuperclass(classes[supercname], classes, dict)

            if "uses" in superc:
                for supercname in superc["uses"]:
                    if supercname in classes:
                        getPropsFromSuperclass(classes[supercname], classes, dict)

        print "-------------------------------------------------------"

        # index
        print "Generating index"
        t = Template(file=os.path.join(self.templatepath, "main.tmpl"))
        assignGlobalProperties(t)
        t.index = True
        self.write("index.html", t)
 
        # copy the json file
        # jsonname = self.cleansedmodulename + ".json"
        jsonname = "raw.json"
        print "Writing " + jsonname
        self.write(jsonname, self.rawdata)

        for mname in self.modules:
            print "Generating module splash"

            m = self.modules[mname]
            self.filename   = ""
            self.classname   = ""
            self.classnames = m["classlist"]
            self.classnames.sort()

            t = Template(file=os.path.join(self.templatepath, "main.tmpl"))

            self.modulename   = mname
            self.moduletitle = mname
            if "title" in m:
                self.moduletitle = m["title"]
            self.cleansedmodulename = self.cleanseStr(mname)
            self.moduledesc   = m["description"]

            self.filenames = m["filelist"]
            self.filenames.sort()

            assignGlobalProperties(t)

            transferToTemplate("requires", m, t)

            self.write( t.cleansedmodulename + ".html", t)


            # class API view
            classes = self.data["classmap"]
            #for i in classes:
            for i in m["classlist"]:
                print "Generating API page for " + i
                self.classname = str(i)
                c = classes[i]
                assignGlobalProperties(t)

                # if "module" in c:
                    # mname =  c["module"]
                    # m = self.modules[mname]
                    # t.modulename   = mname
                    # t.cleansedmodulename = self.cleanseStr(mname)
                    # t.moduledesc   = m["description"]

                # template items that need default vaules even if not included
                transferToTemplate( "see", c, t )
                transferToTemplate( "deprecated", c, t )
                transferToTemplate( "description", c, t )
                transferToTemplate( "static", c, t )
                if "static" in c: t.static = "static"
                transferToTemplate( "final", c, t )
                if "final" in c: t.final = "final"
                transferToTemplate( "access", c, t )
                if "private" in c: t.access = "private"
                elif "protected" in c: t.access = "protected"


                #subclasses
                subclasses = self.subclasses = []
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
                            transferToDict( "default",     prop, propdata           )
                            transferToDict( "deprecated",  prop, propdata, "&nbsp;", True )
                            transferToDict( "deprecated",  prop, propdata, "&nbsp;", True )
                            transferToDict( "see",         prop, propdata           )
                            transferToDict( "static",      prop, propdata           )
                            if "static" in prop: propdata["static"] = "static"
                            transferToDict( "final",      prop, propdata           )
                            if "final" in prop: propdata["final"] = "final"
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
                            transferToDict( "default", config, configdata           )
                            transferToDict( "deprecated",  config, configdata, "&nbsp;", True )
                            transferToDict( "see",         config, configdata           )
                            transferToDict( "static",      config, configdata           )
                            if "static" in config: configdata["static"] = "static"
                            transferToDict( "final",      config, configdata           )
                            if "final" in config: configdata["final"] = "readonly"
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
                            transferToDict( "final",      method, methoddata )
                            if "final" in method: methoddata["final"] = "final"
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
                            transferToDict( "final",      event, eventdata )
                            if "final" in event: eventdata["final"] = "final"
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

                if "uses" in c:
                    for supercname in c["uses"]:
                        t.uses = c["uses"]
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
            for i in m["filelist"]:
                print "Generating source view for " + i
                self.filename = str(i)
                assignGlobalProperties(t)
                self.write("%s.html" %(self.filename), t)



def main():
    from optparse import OptionParser
    optparser = OptionParser("usage: %prog inputdir [options] inputdir")
    optparser.set_defaults(outputdir="docs", inputfile="parsed.json", showprivate=False)
    optparser.add_option( "-o", "--outputdir",
        action="store", dest="outputdir", type="string",
        help="Directory to write the html documentation" )
    optparser.add_option( "-f", "--file",
        action="store", dest="inputfile", type="string",
        help="The name of the file that contains the JSON doc info" )
    optparser.add_option( "-t", "--temlate",
        action="store", dest="templatedir", type="string",
        help="The directory containing the html tmplate" )
    optparser.add_option( "-c", "--crosslink",
        action="store", dest="crosslinkdir", type="string",
        help="The directory containing json data for other modules to crosslink" )
    optparser.add_option( "-s", "--showprivate",
        action="store_true", dest="showprivate",
        help="Should private properties/methods be in the docs?" )

    (options, inputdirs) = optparser.parse_args()

    if len(inputdirs) > 0:
        generator = YUIDocGen( inputdirs[0], 
                               options.inputfile, 
                               options.outputdir,
                               options.templatedir,
                               options.crosslinkdir,
                               options.showprivate )
        generator.process()
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()

