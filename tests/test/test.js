
/**
 * The test project
 * @project tester
 * @title The Tester
 * @icon http://a.img
 * @url http://one.url
 * @url http://two.url
 * @author admo
 * @contributor davglass
 * @contributor entropy
 */

/**
 * The module
 * @module mymodule
 * @category one,two
 * @category three
 * @requires one
 * @requires two
 * @uses three
 * @uses four
 */

/**
 * The submodule
 * @submodule mysubmodule
 * @category three,four
 */


/**
 * The class def
 * @class myclass
 * @constructor
 */

/**
 * test optional
 * @method testoptional
 * @param notype my desc
 * @param {int} namesecond my desc
 * @param namefirst {string} my desc
 * @param [optionalvar] {bool} my desc
 * @param {string} [optionalwithdefault="defaultval"] my desc
 * @evil
 * @injects {HTML} uses a string parameter to populate innerHTML
 * @returns something without a type
 * @example
 *   This is code
 * @example
 *   This is more code
 */

/**
 * test object param
 * @method testobjectparam
 * @param {object} anobject the object
 * @param {string} anobject.prop1 prop1
 * @param {bool} anobject.prop2 prop2
 * @return {string} something with a type
 */

/**
 * test 0..n param
 * @method test0ton
 * @param {string} [optionalandmultiple]* my desc
 * @returns something without a type
 */

/**
 * test 1..n param
 * @method test1ton
 * @param {string} multiple* my desc
 * @returns something without a type
 */

