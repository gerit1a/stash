import videojs, { VideoJsPlayer } from "video.js";

interface ITouchControlsOptions {
  videoSeekSeconds?: number;
}

const IBigPlayButton = videojs.getComponent("BigPlayButton");

class BigPlayPauseButton extends IBigPlayButton {
  handleClick(event: videojs.EventTarget.Event) {
    if (this.player().paused()) {
      // @ts-ignore for some reason handleClick isn't defined in BigPlayButton type. Not sure why
      super.handleClick(event);
    } else {
      this.player().pause();
    }
  }

  buildCSSClass() {
    return "vjs-control vjs-button vjs-big-play-pause-button";
  }
}

interface IBigButtonGroupEvent {
  direction: "forward" | "backward";
}

class BigButtonGroup extends videojs.getComponent("Component") {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  constructor(player: VideoJsPlayer, options: any) {
    super(player, options);

    const backButton = this.addChild("seekButton", { direction: "back" });

    this.addChild("BigPlayPauseButton", {});

    const forwardButton = this.addChild("seekButton", { direction: "forward" });

    this.on("display", (e: IBigButtonGroupEvent) => {
      let el = e.direction === "forward" ? forwardButton : backButton;
      el.addClass("visible");
      setTimeout(() => {
        el.removeClass("visible");
      }, 100);
    });
  }

  createEl() {
    return super.createEl("div", {
      className: "vjs-big-button-group",
    });
  }
}

class touchControls extends videojs.getPlugin("plugin") {
  bigButtonGroup?: BigButtonGroup;
  videoSeekSeconds: number = 5;
  lastTouchStart: number = 0;
  lastTouchPosition?: "left" | "right" | "center";

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  constructor(player: VideoJsPlayer, options: ITouchControlsOptions) {
    super(player, options);

    this.bigButtonGroup = player.addChild("BigButtonGroup");
    this.videoSeekSeconds = options.videoSeekSeconds ?? 5;
    if (!videojs.browser.TOUCH_ENABLED || !this.bigButtonGroup) {
      return;
    }
    player.on("touchstart", this.onTouchStart);
  }

  onTouchStart = (event: TouchEvent) => {
    this.handleTouchStart(event);
  };

  getTouchPosition(touchPercent: number) {
    if (touchPercent < 0.35) {
      return "left";
    } else if (touchPercent > 0.65) {
      return "right";
    } else {
      return "center";
    }
  }

  handleTouchStart(event: TouchEvent) {
    if (!this.player.hasStarted() || event.touches.length > 1) {
      return;
    }
    const playerWidth = this.player.el().getBoundingClientRect().width;
    const touchLocation = event.changedTouches[0]?.clientX;
    const touchPercent = touchLocation / playerWidth;
    const touchPosition = this.getTouchPosition(touchPercent);

    const currentTimeInMillis = Date.now();
    if (
      !(
        touchPosition === this.lastTouchPosition &&
        currentTimeInMillis - this.lastTouchStart < 250
      )
    ) {
      this.lastTouchStart = currentTimeInMillis;
      this.lastTouchPosition = touchPosition;
      return;
    }

    if (touchPosition === "right") {
      this.bigButtonGroup?.trigger({ type: "display", direction: "forward" });
      this.player.currentTime(
        this.player.currentTime() + this.videoSeekSeconds
      );
    } else if (touchPosition === "left") {
      this.bigButtonGroup?.trigger({ type: "display", direction: "backward" });
      this.player.currentTime(
        Math.max(0, this.player.currentTime() - this.videoSeekSeconds)
      );
    }
  }
}

// Register the plugin with video.js.
videojs.registerComponent("BigButtonGroup", BigButtonGroup);
videojs.registerComponent("BigPlayPauseButton", BigPlayPauseButton);
videojs.registerPlugin("touchControls", touchControls);

declare module "video.js" {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  export interface VideoJsPlayer {
    touchControls: (options: ITouchControlsOptions) => touchControls;
  }
}
