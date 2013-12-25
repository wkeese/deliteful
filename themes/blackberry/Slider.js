define(function(){ return '\
.duiSlider {\
  display: inline-block;\
  vertical-align: middle;\
  border-collapse: separate;\
  cursor: pointer;\
  padding: 12pt;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\
}\
.duiSlider input {\
  display: none;\
}\
.duiSlider .dijitRuleContainer {\
  width: 100%;\
  margin: 0;\
  display: inline-block;\
  vertical-align: top;\
}\
.duiSliderH {\
  width: auto;\
}\
.duiSliderH .duiSliderRemainingBar {\
  width: 200px;\
  min-width: 80px;\
  height: 8px;\
}\
.duiSliderH .duiSliderRemainingBar > * {\
  left: 0;\
}\
.duiSliderH .duiSliderProgressBar {\
  height: 100%;\
  top: 0;\
  float: none;\
}\
.duiSliderH .dijitRuleContainer > * {\
  margin-left: -0.25px;\
}\
.duiSliderH .duiSliderHandle {\
  top: -7px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderV {\
  height: auto;\
}\
.duiSliderV .duiSliderRemainingBar {\
  height: 200px;\
  min-height: 80px;\
  width: 8px;\
}\
.duiSliderV .duiSliderRemainingBar > * {\
  top: 0;\
}\
.duiSliderV .duiSliderProgressBar {\
  width: 100%;\
  left: 0;\
  display: block;\
}\
.duiSliderV .duiSliderHandle {\
  left: -7px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderHandle {\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 1px;\
  border-style: outset;\
  border-color: #9d9d9d;\
  border-radius: 6px;\
  padding: 0;\
  margin: 0;\
  background: gray;\
  background-clip: content-box;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fafafa), to(#999999), color-stop(0.5, #bbbbbb));\
  background-image: linear-gradient(to bottom, #fafafa 0%, #bbbbbb 50%, #999999 100%);\
}\
.duiSliderRtl .duiSliderHandleMax,\
.duiSliderLtr .duiSliderHandleMin {\
  left: -10px;\
}\
.duiSliderRtl .duiSliderHandleMin,\
.duiSliderLtr .duiSliderHandleMax {\
  right: -10px;\
}\
.duiSliderTtb .duiSliderHandleMax,\
.duiSliderBtt .duiSliderHandleMin {\
  bottom: -10px;\
}\
.duiSliderTtb .duiSliderHandleMin,\
.duiSliderBtt .duiSliderHandleMax {\
  top: -10px;\
}\
.duiSliderBar {\
  border-width: 1px;\
  border-style: inset;\
  border-color: #b0b0b0;\
  border-radius: 6px;\
  padding: 0;\
  margin: 0;\
  background: none;\
  background-clip: content-box;\
}\
.duiSliderRemainingBar {\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  position: relative;\
  height: 100%;\
  width: 100%;\
  margin: auto;\
  vertical-align: middle;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f3f7), to(#cec5d6), color-stop(0.5, #ced3ce));\
  background-image: linear-gradient(to bottom, #f7f3f7 0%, #ced3ce 50%, #cec5d6 100%);\
}\
.duiSliderRemainingBar > * {\
  position: absolute !important;\
}\
.duiSliderProgressBar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#088eef), to(#0851ad), color-stop(0.5, #0869c6));\
  background-image: linear-gradient(to bottom, #088eef 0%, #0869c6 50%, #0851ad 100%);\
}\
.duiSliderTransition {\
  -moz-transition-duration: 400ms;\
  -webkit-transition-duration: 400ms;\
  transition-duration: 400ms;\
}\
.dj_a11y .duiSliderHandle:after {\
  content: "\\025A3";\
  display: block;\
  font-family: monospace;\
  font-size: 20px;\
}\
.dj_a11y .duiSliderH .duiSliderHandle {\
  line-height: 20px;\
}\
.dj_a11y .duiSliderV .duiSliderHandle {\
  line-height: 20px;\
}\
.dj_a11y .duiSlider .duiSliderHandle {\
  border-radius: 0;\
}\
'; } );
