[yui-customevents]: http://developer.yahoo.com/yui/event/#customevent
[yui-element]: http://developer.yahoo.com/yui/element/

# YUIDoc Doc parser

Updated yuidoc parser, written in js -- *early work in progress*

## Usage

Clone this repo, then:

    cd yuidocjs
    npm -g install .

    yuidoc /path/to/yui3/src/
    yuidoc /path/to/yui2/src/
    yuidoc ./test/

This will produce a data structure in `out/data.json` by default.

## Code implementation

To log during a build:
`Y.log("message", "console[method]", "module")`

## Command Line flags
- -c, --config, --configfile  
Path to your config file, based on ./package.json
- -e, --extension  
File extension(s) to search for, defaults to ".js"
- -x, --exclude
- -v, --version
- -n, --norecurse
- -o, --outdir  
Directory to output to, defaults to "./out"
- -t, --themedir  
A custom theme directory

## Commenting Markup Guide
YUIDoc original Python build - http://developer.yahoo.com/yui/yuidoc/
(republished here for convenience, if that's ok)

### Primary tags - Each comment block must have one (and only one) of the following tags
- **module**: There must be one module per source tree. By convention, put your module declaration at the top of the file that contains the main class for your module.
- **class**: The string identifying the functional class on its parent object; for example, the class for YAHOO.util.Event would be Event (and its @namespace would be "YAHOO.util").
- **method**: The name of a method on the current class.
- **event**: In YUI, events are [Custom Events][yui-customevents] fired off programmatically at interesting moments in a component's execution. The event tag is similar to method, but there is no return tag and its params are arguments passed to the event listener.
- **property**: The name of a property on the current class.

### Secondary tags - After choosing one of the four primary tags, you can further document a module, class, method, event or property with one or more of the following secondary tags.
- **submodule**: YUI Doc supports the notion that a module is a submodule of a parent module. For example, in YUI 3.x anim-scroll is a submodule of anim. A submodule encompasses a subset of the parent module's functionality. To use submodule designation, provide the parent module's name as the module property and the submodule's name in the submodule property.
- **namespace**: While it is optional to provide a namespace, it is recommended. This lets you describe your class just with the name: For example, YAHOO.util.Event has a namespace of YAHOO.util and a class of Event.
- **extends**: Sets up an inheritance relationship between the current class and a parent class; API docs will show and link to items inherited from the parent class.
- **config**: A config is a managed configuration attribute. In YUI parlance, this is typically an attribute created and managed with the Config class (part of the Container Family).
- **attribute**: An attribute is a managed configuration attribute. In YUI parlance, this is typically an attribute created and managed with AttributeProvider (part of the [YUI Element Utility][[yui-element]]). An attribute is similar to a config, but YUI Doc will autogenerate documentation for the change events associated with the attribute as provided by Element. (Note: Unless you're using YUI and referring to an attribute managed by AttributeProvider, you should avoid using this tag.)
- **constructor**: The presence of this tag (which requires no description) indicates that this class is instantiable.
- **static**: If a class does not have a constructor, then the static tag should be present to signal that it is a static class.
- **final**: For constants and for read-only configs and attributes.
- **param**: Defined as @param {type} name description or @param name {type} description, params can be used with classes, methods and events.
- **return**: Defined as @return {type} description.
- **for**:  

Used to define an inner class:

	/**  
	 * An inner class  
	 * @class foo  
	 * @for OuterClass  
	 */
	
After the class is done, you need to inform the parser to start working on the outer class again:

	/**  
	 * Another method for the outer class  
	 * @method bar  
	 * @for OuterClass  
	 */

- **type**: For properties, configs and attributes.
- **private**: Privates by default are suppressed from the API docs. All methods and properties are assumed to be public unless marked as private.
- **protected**: Used to designate members that should not be modified by implementers unless they are creating a subclass.
- **requires**: Used to identify dependencies in the module declaration.
- **default**: The default value of a property, config or attribute.
- **uses**: For classes that use YAHOO.lang.augmentProto or YAHOO.lang.augmentObject. Optional method/properties (supplied to augmentProto or augmentObject) are not parsed by YUI Doc.

Example:  

	/**
	 * My method description.  Like other pieces of your comment blocks, 
	 * this can span multiple lines.
	 * @method methodName
	 */

## Dav's Thoughts:

### Out dir formatting

Setting up the directory structure like this will help us build a nice templating system on
top of this data. It will give us the ability to include just part of the structure. It will
also help up when building the new YUILibrary.com site and importing all this data into MongoDB.

`./out` needs to look like this instead:
    ./out/
        data.json //Rollup of all metadata
        module1/
            data.json //metadata for only this module
        module2/
            data.json

AM - sounds good -- had in mind a schema system to define different parser outputs, but
that might be overkill.

### Parse only what we need to parse.

Keep a *state* file somewhere that shows the last time this doc tree was parsed
This way, we can do a stat on the file to see if it's mtime is greater than the
last parse time and only parse it if it is. This will allow us, in the future, to not reparse files
that have not changed. It should speed up the parse process for a large file set.

AM - the parse process is super fast.  We may want to do this when rendering
the templates.

### Module Structure

I moved docparser into a module of it's own. The YUIDoc module should also be a standalone module.
We should make `cli.js` instantiate that class and run it. We also need to add a way to `export`
these modules so they can be *required* in a script and coded against.

AM - Yep

### Templates

