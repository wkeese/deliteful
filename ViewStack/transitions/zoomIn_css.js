define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.-d-view-stack-zoomIn.-d-view-stack-out {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-zoomInOut;\
  animation-name: -d-view-stack-zoomInOut;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.-d-view-stack-zoomIn.-d-view-stack-in {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-zoomInIn;\
  animation-name: -d-view-stack-zoomInIn;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.dj_android .-d-view-stack-zoomIn.-d-view-stack-in {\
  -webkit-animation-name: -d-view-stack-zoomInInAndroid;\
  animation-name: -d-view-stack-zoomInInAndroid;\
}\
@-webkit-keyframes -d-view-stack-zoomInOut {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-zoomInOut {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
@-webkit-keyframes -d-view-stack-zoomInIn {\
  from {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -d-view-stack-zoomInIn {\
  from {\
    transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    transform: scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -d-view-stack-zoomInInAndroid {\
  from {\
    -webkit-transform: scale(0);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-zoomInInAndroid {\
  from {\
    transform: scale(0);\
  }\
  to {\
    transform: scale(1);\
  }\
}";
});
