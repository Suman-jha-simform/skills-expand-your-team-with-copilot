/**
 * Animated Git-style branch background.
 * Draws slowly-drifting branch lines with commit dots across the full page.
 */
(function () {
  const canvas = document.getElementById("git-bg-canvas");
  const ctx = canvas.getContext("2d");

  // Branch colors (lime-green palette, very light)
  const BRANCH_COLORS = [
    "rgba(74, 158, 47, 0.18)",
    "rgba(118, 196, 66, 0.14)",
    "rgba(46, 107, 25, 0.12)",
    "rgba(100, 180, 50, 0.16)",
    "rgba(60, 140, 30, 0.13)",
  ];

  const COMMIT_COLOR = "rgba(74, 158, 47, 0.35)";
  const COMMIT_FILL = "rgba(240, 255, 244, 0.9)";

  let branches = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBranches();
  }

  /**
   * A branch is a horizontal lane with commit dots that slowly scroll
   * from right to left, looping forever.
   */
  function createBranch(index, total) {
    const laneHeight = canvas.height / total;
    const y = laneHeight * index + laneHeight * (0.3 + Math.random() * 0.4);
    const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
    const speed = 0.18 + Math.random() * 0.22; // px per frame

    // Spacing between commits on this branch (px)
    const commitSpacing = 140 + Math.random() * 100;

    // Number of commits to cover the full canvas width plus one extra for seamless loop
    const numCommits = Math.ceil(canvas.width / commitSpacing) + 2;
    const commits = [];
    for (let i = 0; i < numCommits; i++) {
      commits.push({
        x: i * commitSpacing,
        radius: 4 + Math.random() * 3,
      });
    }

    // Optional: small fork/merge detour on this branch
    const hasFork = Math.random() > 0.5;
    const forkOffsetX = canvas.width * (0.2 + Math.random() * 0.5);
    const forkSpan = 120 + Math.random() * 80;
    const forkDrop = 22 + Math.random() * 18; // vertical offset of fork lane

    return {
      y,
      color,
      speed,
      commitSpacing,
      commits,
      offset: Math.random() * commitSpacing, // start at random phase
      hasFork,
      forkOffsetX,
      forkSpan,
      forkDrop,
    };
  }

  function initBranches() {
    const numBranches = Math.max(4, Math.floor(canvas.height / 160));
    branches = [];
    for (let i = 0; i < numBranches; i++) {
      branches.push(createBranch(i, numBranches));
    }
  }

  function drawBranch(b) {
    const w = canvas.width;

    // ── Main horizontal line ──────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(0, b.y);
    ctx.lineTo(w, b.y);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ── Optional fork/merge detour ────────────────────────────────
    if (b.hasFork) {
      const fx = b.forkOffsetX - b.offset; // shift with animation
      const ex = fx + b.forkSpan;
      const fy = b.y + b.forkDrop;

      ctx.beginPath();
      // branch-off curve
      ctx.moveTo(fx, b.y);
      ctx.bezierCurveTo(fx + 20, b.y, fx + 20, fy, fx + 40, fy);
      ctx.lineTo(ex - 40, fy);
      // merge-back curve
      ctx.bezierCurveTo(ex - 20, fy, ex - 20, b.y, ex, b.y);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // ── Commit dots (scrolling) ───────────────────────────────────
    for (const c of b.commits) {
      // map commit x into screen space with looping offset
      let sx = c.x - b.offset;
      // wrap around so commits loop seamlessly
      sx = ((sx % w) + w) % w;

      ctx.beginPath();
      ctx.arc(sx, b.y, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = COMMIT_FILL;
      ctx.fill();
      ctx.strokeStyle = COMMIT_COLOR;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const b of branches) {
      b.offset += b.speed;
      if (b.offset >= b.commitSpacing) {
        b.offset -= b.commitSpacing;
      }
      drawBranch(b);
    }

    animFrame = requestAnimationFrame(tick);
  }

  // Kick off
  resize();
  tick();

  // Re-initialise on resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
})();
