function BaseScene() {
    this.state = null;

    this.draw = function() {}
    this.update = function() {}

    this.updateState = function(newState) {
      this.state = newState;
    }
}
