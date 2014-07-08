define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-toaster-inner {\
  user-select: none;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -moz-user-select: none;\
  -webkit-touch-callout: none;\
}\
.d-toaster-inner {\
  position: fixed;\
}\
.d-toaster-placement-default .d-toaster-inner {\
  left: 20%;\
  bottom: 10%;\
  width: 60%;\
}\
.d-toaster-placement-tl .d-toaster-inner {\
  left: 0;\
  top: 0;\
}\
.d-toaster-placement-tc .d-toaster-inner {\
  left: 20%;\
  top: 0;\
  width: 60%;\
}\
@media only screen and (max-width: 500px) {\
  .d-toaster-placement-tc .d-toaster-inner {\
    left: 0%;\
    width: 100%;\
  }\
}\
.d-toaster-placement-tr .d-toaster-inner {\
  right: 0;\
  top: 0;\
}\
.d-toaster-placement-br .d-toaster-inner {\
  right: 0;\
  bottom: 0;\
}\
.d-toaster-placement-bc .d-toaster-inner {\
  left: 20%;\
  bottom: 0;\
  width: 60%;\
}\
@media only screen and (max-width: 500px) {\
  .d-toaster-placement-bc .d-toaster-inner {\
    left: 0%;\
    width: 100%;\
  }\
}\
.d-toaster-placement-bl .d-toaster-inner {\
  left: 0;\
  bottom: 0;\
}\
button.d-toaster-dismiss:before {\
  content: \"×\";\
}\
button.d-toaster-dismiss {\
  padding: 0;\
  cursor: pointer;\
  background: 0 0;\
  border: 0;\
  -webkit-appearance: none;\
  float: right;\
  font-size: 21px;\
  font-weight: 700;\
  line-height: 1;\
  text-shadow: 0 1px 0 #fff;\
  opacity: .2;\
}\
.d-toaster-message {\
  position: relative;\
  display: block;\
}\
.d-toaster-initial {\
  opacity: 0;\
  transition-property: opacity;\
  transition-timing-function: linear;\
}\
.d-toaster-fadein {\
  opacity: 1;\
  transition-duration: 700ms;\
}\
.d-toaster-fadeout {\
  opacity: 0;\
  transition-duration: 1000ms;\
}\
@-webkit-keyframes d-toaster-swipeout {\
  0% {\
    -webkit-transform: translateX(0%);\
    transform: translateX(0%);\
  }\
  100% {\
    -webkit-transform: translateX(100%);\
    transform: translateX(100%);\
    opacity: 0;\
  }\
}\
@keyframes d-toaster-swipeout {\
  0% {\
    -webkit-transform: translateX(0%);\
    -ms-transform: translateX(0%);\
    transform: translateX(0%);\
  }\
  100% {\
    -webkit-transform: translateX(100%);\
    -ms-transform: translateX(100%);\
    transform: translateX(100%);\
    opacity: 0;\
  }\
}\
.d-toaster-swipeout {\
  -webkit-animation-name: d-toaster-swipeout;\
  animation-name: d-toaster-swipeout;\
  -webkit-animation-timing-function: linear;\
  animation-timing-function: linear;\
  -webkit-animation-duration: 700ms;\
  animation-duration: 700ms;\
  -webkit-animation-fill-mode: both;\
  animation-fill-mode: both;\
}\
.d-toaster-placement-tl .d-toaster-inner,\
.d-toaster-placement-tr .d-toaster-inner,\
.d-toaster-placement-bl .d-toaster-inner,\
.d-toaster-placement-br .d-toaster-inner {\
  width: 23em;\
  max-width: 100%;\
}\
.d-toaster-message {\
  padding: 1.2em 2.5em 1.2em 1.5em;\
  border-radius: 3px;\
  margin: .5em;\
  border: 1px transparent solid;\
}\
.dj_a11y .d-toaster-message {\
  border: .2em black solid;\
}\
.d-toaster-dismiss {\
  position: relative;\
  top: -5px;\
  right: -21px;\
}\
.d-toaster-message {\
  -webkit-touch-callout: none;\
  -webkit-user-select: none;\
  -moz-user-select: none;\
  -ms-user-select: none;\
  user-select: none;\
}\
.dj_a11y .d-toaster-message .d-toaster-icon:before {\
  font-family: \"webdings\";\
  font-size: 2em;\
  margin-right: 1em;\
  line-height: .5em;\
}\
.d-toaster-type-info {\
  background: #d9edf7;\
  border-color: #bce8f1;\
  color: #31708f;\
}\
.dj_a11y .d-toaster-type-info .d-toaster-icon:before {\
  content: \"i\";\
}\
.d-toaster-type-warning {\
  background-color: #fcf8e3;\
  border-color: #faebcc;\
  color: #8a6d3b;\
}\
.dj_a11y .d-toaster-type-warning .d-toaster-icon:before {\
  content: \"U\";\
}\
.d-toaster-type-success {\
  background-color: #dff0d8;\
  border-color: #d6e9c6;\
  color: #3c763d;\
}\
.dj_a11y .d-toaster-type-success .d-toaster-icon:before {\
  content: \"a\";\
}\
.d-toaster-type-error {\
  background-color: #f2dede;\
  border-color: #ebccd1;\
  color: #a94442;\
}\
.dj_a11y .d-toaster-type-error .d-toaster-icon:before {\
  content: \"x\";\
}";
});
