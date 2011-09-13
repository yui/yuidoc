[yui-customevents]: http://yuilibrary.com/yui/docs/event-custom/
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
    Usage: yuidoc <options> <input path>

    Common Options:
      -c, --config, --configfile <filename>  A JSON config file to provide configuration data.
               You can also create a yuidoc.json file and place it
               anywhere under your source tree and YUI Doc will find it
               and use it.
      -e, --extension <comma sep list of file extensions> The list of file extensions to parse 
               for api documentation. (defaults to .js)
      -x, --exclude <comma sep list of directorues> Directorys to exclude from parsing 
               (defaults to '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp')
      -v, --version Show the current YUIDoc version
      --project-version Set the doc version for the template
      -N, --no-color Turn off terminal colors (for automation)
      -n, --norecurse Do not recurse directories (default is to recurse)
      -S, --selleck Look for Selleck component data and attach to API meta data
      -V, --view Dump the Handlebars.js view data instead of writing template files
      -p, --parse-only Only parse the API docs and create the JSON data, do not render templates
      -o, --out <directory path> Path to put the generated files (defaults to ./out)
      -t, --themedir <directory path> Path to a custom theme directory containing Handlebars templates
      -h, --help Show this help
      -T, --theme <simple|default> Choose one of the built in themes (default is default)
      <input path> Supply a list of paths (shell globbing is handy here)

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
- **param**: Defined as @param {type} name description or @param name {type} description, params can be used with classes, methods and events.  Use [name] to indicate the param is optional, name* to indicate it is a place holder for 1..n arguments, and [name*] for 0..n arguments.
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

## Released under the YUI BSB License

Copyright 2011 Yahoo! Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Yahoo! Inc. nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL YAHOO! INC. BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
