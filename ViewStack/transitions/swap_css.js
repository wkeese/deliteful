define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.-d-view-stack-swap {\
  -webkit-animation-duration: 0.6s;\
  animation-duration: 0.6s;\
  -webkit-animation-timing-function: linear;\
  animation-timing-function: linear;\
}\
.-d-view-stack-swap.-d-view-stack-out {\
  -webkit-animation-name: -d-view-stack-swapOut;\
  animation-name: -d-view-stack-swapOut;\
}\
.-d-view-stack-swap.-d-view-stack-in {\
  -webkit-animation-name: -d-view-stack-swapIn;\
  animation-name: -d-view-stack-swapIn;\
}\
.-d-view-stack-swap.-d-view-stack-out.-d-view-stack-reverse {\
  -webkit-animation-name: -d-view-stack-swapOutReverse;\
  animation-name: -d-view-stack-swapOutReverse;\
}\
.-d-view-stack-swap.-d-view-stack-in.-d-view-stack-reverse {\
  -webkit-animation-name: -d-view-stack-swapInReverse;\
  animation-name: -d-view-stack-swapInReverse;\
}\
@-webkit-keyframes -d-view-stack-swapOut {\
  0% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    -webkit-transform: translate3d(-45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    -webkit-transform: translate3d(-20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@keyframes -d-view-stack-swapOut {\
  0% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    transform: translate3d(-45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    transform: translate3d(-20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -d-view-stack-swapIn {\
  0% {\
    z-index: -100;\
    -webkit-transform: translate3d(-20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    -webkit-transform: translate3d(45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -d-view-stack-swapIn {\
  0% {\
    z-index: -100;\
    transform: translate3d(-20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    transform: translate3d(45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -d-view-stack-swapOutReverse {\
  0% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    -webkit-transform: translate3d(45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    -webkit-transform: translate3d(20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@keyframes -d-view-stack-swapOutReverse {\
  0% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    transform: translate3d(45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    transform: translate3d(20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -d-view-stack-swapInReverse {\
  0% {\
    z-index: -100;\
    -webkit-transform: translate3d(20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    -webkit-transform: translate3d(-45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -d-view-stack-swapInReverse {\
  0% {\
    z-index: -100;\
    transform: translate3d(20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    transform: translate3d(-45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}";
});
