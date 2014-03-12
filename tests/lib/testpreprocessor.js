module.exports=function(data) {
	global.testPreprocessorCallCount++;

	for (className in data.classes) {
		classData=data.classes[className];

		classData.customtagPlusStar=classData.customtag+"*";
	}
}