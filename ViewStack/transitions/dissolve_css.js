define(function(){ return '\
.-d-view-stack-dissolve.-d-view-stack-out {\
  -webkit-animation-duration: 1s;\
  animation-duration: 1s;\
  -webkit-animation-name: -d-view-stack-dissolveOut;\
  animation-name: -d-view-stack-dissolveOut;\
  -webkit-animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
  animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
}\
.-d-view-stack-dissolve.-d-view-stack-in {\
  -webkit-animation-duration: 1s;\
  animation-duration: 1s;\
  -webkit-animation-name: -d-view-stack-dissolveIn;\
  animation-name: -d-view-stack-dissolveIn;\
  -webkit-animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
  animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
}\
@-webkit-keyframes -d-view-stack-dissolve-out {\
  from {\
    opacity: 1;\
  }\
  to {\
    opacity: 0;\
  }\
}\
@keyframes -d-view-stack-dissolve-out {\
  from {\
    opacity: 1;\
  }\
  to {\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -d-view-stack-dissolve-in {\
  from {\
    opacity: 0;\
  }\
  to {\
    opacity: 1;\
  }\
}\
@keyframes -d-view-stack-dissolve-in {\
  from {\
    opacity: 0;\
  }\
  to {\
    opacity: 1;\
  }\
}\
'; } );
