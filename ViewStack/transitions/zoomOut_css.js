define(function(){ return '\
.-d-view-stack-zoomOut.-d-view-stack-out {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-zoomOutOut;\
  animation-name: -d-view-stack-zoomOutOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.dj_android .-d-view-stack-zoomOut.-d-view-stack-out {\
  -webkit-animation-name: -d-view-stack-zoomOutOutAndroid;\
  animation-name: -d-view-stack-zoomOutOutAndroid;\
}\
.-d-view-stack-zoomOut.-d-view-stack-in {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-zoomOutIn;\
  animation-name: -d-view-stack-zoomOutIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
@-webkit-keyframes -d-view-stack-zoomOutOut {\
  from {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
}\
@keyframes -d-view-stack-zoomOutOut {\
  from {\
    transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    transform: scale(0);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -d-view-stack-zoomOutOutAndroid {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(0);\
  }\
}\
@keyframes -d-view-stack-zoomOutOutAndroid {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(0);\
  }\
}\
@-webkit-keyframes -d-view-stack-zoomOutIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-zoomOutIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
