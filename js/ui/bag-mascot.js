/**
 * DG Modas bag mascot — video loop when available, dual-frame celebrate loop otherwise.
 */
const VIDEO_SRC = "assets/mascot-celebrate-loop.mp4";
const FRAME_START = "assets/mascot-celebrate-start.png";
const FRAME_END = "assets/mascot-celebrate-end.png";

export function bagMascotHtml() {
  return `
  <div class="bag-mascot" id="bagMascot" aria-hidden="true">
    <div class="bag-mascot__media">
      <video
        class="bag-mascot__video"
        src="${VIDEO_SRC}?v=1"
        poster="${FRAME_START}?v=1"
        muted
        loop
        playsinline
        preload="metadata"
        hidden
      ></video>
      <div class="bag-mascot__frames">
        <img class="bag-mascot__frame bag-mascot__frame--a" src="${FRAME_START}?v=1" alt="" width="512" height="512" />
        <img class="bag-mascot__frame bag-mascot__frame--b" src="${FRAME_END}?v=1" alt="" width="512" height="512" />
      </div>
    </div>
    <p class="bag-mascot__caption">Seu pedido está quase pronto!</p>
  </div>`;
}

export function initBagMascot(root = document) {
  const mascot = root.querySelector("#bagMascot") || document.getElementById("bagMascot");
  if (!mascot) return;

  const video = mascot.querySelector(".bag-mascot__video");
  const frames = mascot.querySelector(".bag-mascot__frames");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    mascot.classList.add("is-static");
    if (video) video.hidden = true;
    return;
  }

  const useFrames = () => {
    if (video) video.hidden = true;
    if (frames) frames.hidden = false;
    mascot.classList.add("is-frame-loop");
  };

  const tryVideo = async () => {
    if (!video) {
      useFrames();
      return;
    }
    try {
      const head = await fetch(VIDEO_SRC, { method: "HEAD" });
      if (!head.ok) throw new Error("no video");
      video.hidden = false;
      if (frames) frames.hidden = true;
      mascot.classList.remove("is-frame-loop");
      await video.play();
    } catch {
      useFrames();
    }
  };

  tryVideo();

  if (typeof window.gsap !== "undefined") {
    window.gsap.from(mascot, {
      autoAlpha: 0,
      scale: 0.86,
      y: 16,
      duration: 0.7,
      ease: "back.out(1.6)",
    });
  }
}
