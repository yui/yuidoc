#!/usr/bin/env python
import os, sys, pprint, simplejson
from cStringIO import StringIO 

class YUIDocShow(object):

    def __init__(self, inpath, datafile, outpath, templatepath):
        self.inpath  = os.path.abspath(inpath)
        self.outpath = os.path.abspath(outpath)
        self.templatepath = os.path.abspath(templatepath)
        f=open(os.path.join(inpath, datafile))
        self.rawdata = StringIO(f.read()).getvalue()
        d = self.data = simplejson.loads(self.rawdata)
        print pprint.pformat(d)


if __name__ == '__main__':
    YUIDocShow("../out/parser", "parsed.json", "../out/generator", "../template")
