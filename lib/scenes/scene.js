function Scene() {
    BaseScene.call();
    this.subScenes = new Array();
}
Scene.prototype = new BaseScene();
