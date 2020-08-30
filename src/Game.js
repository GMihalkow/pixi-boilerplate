import { Graphics, Container } from 'pixi.js';
import gsap from 'gsap';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  constructor() {
    super();

    this._mouseIsClicked = false;
    this._mainDot = null;
    this._cursorX = null;
  }

  async start() {
    this.createLine(300, 0, 0x00ff55);
    this.createDots(-300, 0, 600);
    await this.createMainDot(-300, 0);
  }

  async createMainDot(x, y) {
    this._mainDot = new Graphics();

    this._mainDot
      .beginFill(0x0000ff)
      .drawCircle(x, y, 10)
      .endFill();

    this._mainDot.interactive = true;
    this._mainDot.cursor = 'pointer';

    const _this = this;

    this.addChild(this._mainDot);

    async function gameLoop() {
      requestAnimationFrame(gameLoop);

      if (_this._mouseIsClicked && _this._cursorX !== null) {
        await _this.moveDot();
      }
    }

    await gameLoop();
  }

  createLine(x, y, color) {
    const line = new Graphics();

    line
      .beginFill(color)
      .lineStyle(10, color)
      .moveTo(x * -1, y)
      .lineTo(x, y)
      .endFill();

    this.addChild(line);
  }

  createDots(initialX, y, lineWidth) {
    const dotsCount = 8;
    const offset = lineWidth / (dotsCount - 1);
    const circleRadius = 20;

    for (let index = 0; index < dotsCount; index++) {
      const circle = new Graphics();
      const x = initialX + (offset * index);

      circle
        .beginFill(0xff0000)
        .drawCircle(x, y, circleRadius)
        .endFill();

      circle.cursor = 'pointer';

      this.addChild(circle);

      circle.interactive = true;

      circle.on('mousedown', this.onMouseDown.bind(this, x));
      circle.on('mouseup', this.onMouseUp.bind(this));
    }
  }

  async moveDot() {
    await gsap.to(this._mainDot, { x: this._cursorX, duration: 0.3 });
  }

  onMouseDown(x) {
    this._mouseIsClicked = true;
    this._cursorX = x + 300;
  }

  onMouseUp() {
    this._mouseIsClicked = false;
  }
}