/*global Y:true */
var YUITest = require('yuitest'),
    Assert = YUITest.Assert,
    path = require('path'),
    Y = require(path.join(__dirname, '../', 'lib', 'index'));

//Move to the test dir before running the tests.
process.chdir(__dirname);

var suite = new YUITest.TestSuite({
    name: 'Preprocessor Test Suite',
    setUp: function () {
        process.chdir(__dirname);
    }
});

suite.add(new YUITest.TestCase({
    name: "Preprocessor",
    'test: single preprocessor': function () {
        global.testPreprocessorCallCount=0;

        var json = (new Y.YUIDoc({
            quiet: true,
            paths: ['input/preprocessor'],
            outdir: './out',
            preprocessor: 'lib/testpreprocessor.js'
        })).run();

        Assert.isObject(json);
        Assert.areSame(global.testPreprocessorCallCount,1,"the preprocessor was not called");
    },
    'test: single preprocessor with absolute path': function () {
        global.testPreprocessorCallCount=0;

        var json = (new Y.YUIDoc({
            quiet: true,
            paths: ['input/preprocessor'],
            outdir: './out',
            preprocessor: path.join(process.cwd(),'lib/testpreprocessor.js')
        })).run();

        Assert.isObject(json);
        Assert.areSame(global.testPreprocessorCallCount,1,"the preprocessor was not called when an absolute path was used");
    },
    'test: several preprocessors': function () {
        global.testPreprocessorCallCount=0;

        var json = (new Y.YUIDoc({
            quiet: true,
            paths: ['input/preprocessor'],
            outdir: './out',
            preprocessor: ['lib/testpreprocessor.js','./lib/testpreprocessor']
        })).run();

       Assert.isObject(json);
       Assert.areSame(global.testPreprocessorCallCount,2,"the preprocessor was not called twice");
    },
    'test: the test preprocessor does its job': function () {
        var json = (new Y.YUIDoc({
            quiet: true,
            paths: ['input/preprocessor'],
            outdir: './out',
            preprocessor: 'lib/testpreprocessor.js'
        })).run();

        Assert.isObject(json);
        Assert.areSame(json.classes.TestPreprocessor.customtagPlusStar,"hello*","the preprocessor did not modify the data");
    }
}));

YUITest.TestRunner.add(suite);
