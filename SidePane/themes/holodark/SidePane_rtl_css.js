define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-rtl.-d-side-pane-end {\
  left: 0;\
}\
.d-rtl.-d-side-pane-start {\
  right: 0;\
}\
.d-rtl.-d-side-pane-end.-d-side-pane-push.-d-side-pane-hidden,\
.d-rtl.-d-side-pane-end.-d-side-pane-overlay.-d-side-pane-hidden {\
  -webkit-transform: translate3d(-15em, 0px, 0px);\
  transform: translate3d(-15em, 0px, 0px);\
}\
.d-rtl.-d-side-pane-end.-d-side-pane-push.-d-side-pane-visible,\
.d-rtl.-d-side-pane-end.-d-side-pane-overlay.-d-side-pane-visible {\
  -webkit-transform: translate3d(0px, 0px, 0px);\
  transform: translate3d(0px, 0px, 0px);\
}\
.d-rtl.-d-side-pane-start.-d-side-pane-push.-d-side-pane-hidden,\
.d-rtl.-d-side-pane-start.-d-side-pane-overlay.-d-side-pane-hidden {\
  right: 0;\
  -webkit-transform: translate3d(15em, 0px, 0px);\
  transform: translate3d(15em, 0px, 0px);\
}\
.d-rtl.-d-side-pane-start.-d-side-pane-push.-d-side-pane-visible,\
.d-rtl.-d-side-pane-start.-d-side-pane-overlay.-d-side-pane-visible {\
  right: 0;\
  -webkit-transform: translate3d(0px, 0px, 0px);\
  transform: translate3d(0px, 0px, 0px);\
}\
.d-rtl.-d-side-pane-end.-d-side-pane-translated {\
  -webkit-transform: translate3d(15em, 0px, 0px);\
  transform: translate3d(15em, 0px, 0px);\
}\
.d-rtl.-d-side-pane-end.-d-side-pane-nottranslated {\
  -webkit-transform: translate3d(0px, 0px, 0px);\
  transform: translate3d(0px, 0px, 0px);\
}\
.d-rtl.-d-side-pane-start.-d-side-pane-translated {\
  -webkit-transform: translate3d(-15em, 0px, 0px);\
  transform: translate3d(-15em, 0px, 0px);\
}\
.d-rtl.-d-side-pane-start.-d-side-pane-nottranslated {\
  -webkit-transform: translate3d(0px, 0px, 0px);\
  transform: translate3d(0px, 0px, 0px);\
}\
.d-rtl.-d-side-pane-start.-d-side-pane-reveal.-d-side-pane-visible,\
.d-rtl .-d-side-pane.-d-side-pane-start-reveal.-d-side-pane-hidden {\
  right: 0;\
}";
});
