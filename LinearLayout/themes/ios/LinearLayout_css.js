define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-linear-layout {\
  display: -webkit-box;\
  display: -moz-box;\
  display: -ms-flexbox;\
  display: -webkit-flex;\
  display: flex;\
  align-items: stretch;\
}\
.d-linear-layout.-d-linear-layout-v {\
  -webkit-flex-direction: column;\
  -ms-flex-direction: column;\
  -webkit-box-orient: vertical;\
  -moz-box-orient: vertical;\
  -ms-box-orient: vertical;\
  flex-direction: column;\
}\
.fill {\
  -webkit-box-flex: 1;\
  -moz-box-flex: 1;\
  -webkit-flex: 1;\
  -ms-flex: 1;\
  flex: 1;\
}\
/* Allows percentage sizing of the height of arranged elements */\
.d-linear-layout > * > .height100,\
.d-linear-layout > * > *[style*=\"height:100%\"],\
.d-linear-layout > * > *[style*=\"height: 100%\"] {\
  position: absolute;\
  width: 100%;\
}\
.d-linear-layout > * {\
  position: relative;\
}\
.height100 {\
  height: 100%;\
}\
.width100 {\
  width: 100%;\
}";
});
