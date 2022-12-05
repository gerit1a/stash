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
  timer: NodeJS.Timeout | null = null;
  bigButtonGroup?: BigButtonGroup;
  videoSeekSeconds: number = 5;

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

  handleTouchStart(event: TouchEvent) {
    if (!this.player.hasStarted()) {
      return;
    }
    const playerWidth = this.player.el().getBoundingClientRect().width;
    const touchLocation = event.changedTouches[0]?.clientX;
    const touchPercent = touchLocation / playerWidth;

    if (this.timer === null) {
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 250);
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;

    if (touchPercent > 0.65) {
      this.bigButtonGroup?.trigger({ type: "display", direction: "forward" });
      this.player.currentTime(
        this.player.currentTime() + this.videoSeekSeconds
      );
    } else if (touchPercent < 0.35) {
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
