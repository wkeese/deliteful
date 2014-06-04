define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-view-stack {\
  display: block;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  position: relative;\
}\
.d-view-stack > * {\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  position: absolute;\
  width: 100%;\
  height: 100%;\
}\
.-d-view-stack-transition > * {\
  position: absolute;\
}\
.-d-view-stack-transition {\
  overflow-x: hidden;\
  overflow-y: hidden;\
}";
});
