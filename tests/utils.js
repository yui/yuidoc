var YUITest = require('yuitest'),
  Assert = YUITest.Assert,
  path = require('path')
  Y = require(path.join(__dirname, '../', 'lib', 'index'))
  ;

var suite = new YUITest.TestSuite({
  name: 'Utils Test Suite'
});

suite.add(new YUITest.TestCase({
  name: 'getProjectData Folder Priority', 
  'test: Nearest Folder Priority': function() {
    var d = Y.getProjectData('input/folders1');
    Assert.areEqual('yuidoc-root', d.name, 'must use nearest yuidoc.json first');
  },
  'test: Finds package.json': function() {
    var d = Y.getProjectData('input/folders2');
    Assert.areEqual('yuidoc-two', d.name, 'used deep yuidoc.json');
    Assert.areEqual('package-root', d.description, 'used shallow package.json');
  },
  'test: Finds package.json in same folder as yuidoc.json': function() {
    var d = Y.getProjectData('input/folders3');
    Assert.areEqual('yuidoc-root', d.name, 'used deep yuidoc.json');
    Assert.areEqual('package-root', d.description, 'used deep package.json');
  },
  'test: Ignores package.json in deeper folder than yuidoc.json': function() {
    var d = Y.getProjectData('input/folders4');
    Assert.areEqual('yuidoc-one', d.name, 'used deep yuidoc.json');
    Assert.isUndefined(d.description, 'used deep package.json');
  },
  'test: Must be breadth-first': function() {
    var d = Y.getProjectData('input/folders5');
    Assert.areEqual('yuidoc-two', d.name, 'used wrong yuidoc.json');
    Assert.areEqual('package-two', d.description, 'used wrong package.json');
  }
}));

YUITest.TestRunner.add(suite);