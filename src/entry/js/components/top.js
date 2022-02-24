const top = new Vue({
  el: '#topPage',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    info: null
  },
  methods: {
    soundPlay: function () {
      const helloVoice = new Audio("./static/sound/checkbox.mp3");
      var soundCheck = document.getElementById("sound").checked
      if (soundCheck == true) {
        helloVoice.play();
      }
    }
  }
});
