'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   DOMAIN DATA
   ───────────────────────────────────────────── */

const domains = [
  { id: 1, name: 'Mathematical foundations', status: 'Partial', level: 'partial' },
  { id: 2, name: 'Probabilistic estimation', status: 'Priority next', level: 'next' },
  { id: 3, name: 'Perception & signal processing', status: 'Strong', level: 'strong' },
  { id: 4, name: 'Real-time systems', status: 'Starting', level: 'starting' },
  { id: 5, name: 'Control theory', status: 'Not started', level: 'none' },
  { id: 6, name: 'Planning & decision', status: 'Not started', level: 'none' },
  { id: 7, name: 'Mission & autonomy', status: 'Adjacent', level: 'partial' },
];

/* ─────────────────────────────────────────────
   LANDSCAPE HTML
   ───────────────────────────────────────────── */

const landscapeHTML = `
<div class="pipeline">
  <div class="mission-bar">Mission &amp; Autonomy — behavior trees, multi-agent coordination, human-machine teaming</div>
  <div class="pipe-row">
    <div class="ps ps-strong"><div class="pn">Perception</div><div class="pp">CNN · SAR · OpenCV</div></div>
    <div class="pa">→</div>
    <div class="ps ps-partial"><div class="pn">Estimation</div><div class="pp">LSTM ✓ · KF/EKF ○</div></div>
    <div class="pa">→</div>
    <div class="ps ps-none"><div class="pn">Planning</div><div class="pp">A* · RRT · traj. opt.</div></div>
    <div class="pa">→</div>
    <div class="ps ps-none"><div class="pn">Control</div><div class="pp">PID · LQR · MPC</div></div>
  </div>
  <div class="rt-bar">Real-time Systems (Rust) — deterministic timing, no GC, lock-free, DDS</div>
</div>

<div class="leg">
  <div class="li"><div class="ld ld-strong"></div>Your strength</div>
  <div class="li"><div class="ld ld-partial"></div>Partial / adjacent</div>
  <div class="li"><div class="ld ld-next"></div>Priority next</div>
  <div class="li"><div class="ld ld-none"></div>Not started</div>
</div>

<div class="dom d-partial" data-domain="1">
  <div class="dh" data-tog="l1"><div class="dn">01</div><div class="dname">Math foundations</div><div class="dtag">The language everything is written in</div><div class="dbadge">Partial</div><div class="chev">▼</div></div>
  <div class="db" id="lb1">
    <div class="sl">Gap from ML math to estimation math</div>
    <div class="st">Your ML background gives you linear algebra and probability at the right level for backprop and loss surfaces. Estimation needs three extra things: <em>Gaussian conditioning</em>, <em>Jacobians</em>, and <em>state-space notation</em> (x(k+1) = Ax(k) + Bu(k) + w(k)).</div>
    <div class="sl">Specific things to learn</div>
    <ul class="llist">
      <li>Conditional Gaussian distributions: given joint Gaussian p(x,y), what is p(x|y)? This derivation <em>is</em> the Kalman update step.</li>
      <li>Jacobian matrices: how to linearize f(x) around an operating point x₀.</li>
      <li>State-space representation: x = Ax + Bu + w, y = Cx + v.</li>
      <li>ODE integration: Euler and RK4 for simulating physical systems.</li>
    </ul>
    <div class="sl">Do this first</div>
    <div class="proj"><span class="pname">Derive the Kalman filter from scratch</span>Pen and paper. Start from Bayesian conditioning of two Gaussians, derive the predict and update equations. One afternoon.</div>
    <div class="sl">Resources</div>
    <div class="st">Labbe's <em>Kalman and Bayesian Filters in Python</em> (free) · Barfoot <em>State Estimation for Robotics</em> Appendix A (free PDF) · 3Blue1Brown eigenvectors video</div>
  </div>
</div>

<div class="dom d-next" data-domain="2">
  <div class="dh" data-tog="l2"><div class="dn">02</div><div class="dname">Probabilistic estimation</div><div class="dtag">The mathematical heart of the stack</div><div class="dbadge">Priority next</div><div class="chev">▼</div></div>
  <div class="db" id="lb2">
    <div class="sl">What it is</div>
    <div class="st">Tracking the state of a system over time given noisy, incomplete observations. The hidden state could be a drone's position, a submarine's heading, an aircraft's trajectory, or a battery's internal resistance.</div>
    <div class="sl">Your bridge</div>
    <div class="bridge">Your LSTM-Transformer RUL model <em>is</em> an estimation system — you're estimating a hidden degradation state from noisy cycle observations. The Kalman filter family does it with an analytical model. Understanding both gives you the ability to choose the right tool.</div>
    <div class="sl">The progression</div>
    <ul class="llist">
      <li><strong>Kalman Filter</strong> — linear systems, Gaussian noise. Start here.</li>
      <li><strong>Extended Kalman Filter</strong> — nonlinear systems, linearized via Jacobians. The industry workhorse.</li>
      <li><strong>Unscented Kalman Filter</strong> — sigma-point approximation. No Jacobians required.</li>
      <li><strong>Particle Filter</strong> — non-Gaussian, non-linear, general.</li>
      <li><strong>Factor Graphs</strong> — modern formulation for SLAM and multi-sensor fusion.</li>
    </ul>
    <div class="sl">Build — in this order</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> 1D Kalman filter</span>Estimate position from noisy GPS measurements. No matrices, just scalars. 1–2 days.</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> EKF for 2D vehicle tracking</span>State vector [x, y, heading, speed]. Nonlinear motion model. Implement the Jacobian manually. 1 week.</div>
    <div class="proj"><span class="pname"><span class="stag stag-bridge">Bridge</span> Battery SOH with EKF</span>Replace your LSTM with an analytical degradation model inside an EKF. Same domain, different framework.</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> IMU + GPS fusion</span>Fuse accelerometer/gyroscope with GPS. The canonical aerospace example. 1–2 weeks.</div>
    <div class="sl">Resources</div>
    <div class="st">Thrun, Burgard, Fox — <em>Probabilistic Robotics</em> Ch.3–4 · Labbe's free Jupyter book · Barfoot <em>State Estimation for Robotics</em></div>
  </div>
</div>

<div class="dom d-strong" data-domain="3">
  <div class="dh" data-tog="l3"><div class="dn">03</div><div class="dname">Perception &amp; signal processing</div><div class="dtag">Your existing strength — targeted gaps to fill</div><div class="dbadge">Strong</div><div class="chev">▼</div></div>
  <div class="db" id="lb3">
    <div class="sl">What you already have</div>
    <div class="st">CNN-based computer vision, PyTorch, satellite imagery processing (SAR, hyperspectral), OpenCV.</div>
    <div class="sl">Gaps to fill</div>
    <ul class="llist">
      <li><strong>Radar signal processing</strong> — range-FFT, Doppler-FFT, CFAR detection.</li>
      <li><strong>IMU noise models</strong> — Allan variance, random walk vs. bias instability.</li>
      <li><strong>Visual odometry / SLAM</strong> — feature matching across frames → camera motion → 3D map.</li>
    </ul>
    <div class="sl">Key bridging project</div>
    <div class="proj"><span class="pname"><span class="stag stag-cv">CV→Est</span> Visual odometry from scratch</span>Monocular camera sequence, extract features, match across frames, recover the essential matrix, estimate camera trajectory.</div>
    <div class="sl">Resources</div>
    <div class="st">Hartley &amp; Zisserman <em>Multiple View Geometry</em> · Skolnik <em>Introduction to Radar Systems</em> Chs.1–3</div>
  </div>
</div>

<div class="dom d-starting" data-domain="4">
  <div class="dh" data-tog="l4"><div class="dn">04</div><div class="dname">Real-time systems</div><div class="dtag">The execution substrate</div><div class="dbadge">Starting</div><div class="chev">▼</div></div>
  <div class="db" id="lb4">
    <div class="sl">What real-time means</div>
    <div class="st">Deterministic, not fast. Your code must complete in a guaranteed time budget — always, not on average.</div>
    <div class="sl">Things to learn</div>
    <ul class="llist">
      <li><strong>Rust no_std</strong> — writing for embedded/RTOS targets.</li>
      <li><strong>Allocation discipline</strong> — why Vec::push on a hot path is dangerous. The heapless crate.</li>
      <li><strong>Lock-free data structures</strong> — atomic operations, memory ordering, MPSC queues.</li>
      <li><strong>RTOS concepts</strong> — task scheduling, priority inversion, deadline guarantees.</li>
      <li><strong>DDS</strong> — the pub-sub standard that ROS2 and the F-35 both use. Look at Zenoh.</li>
    </ul>
    <div class="sl">Build</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> Lock-free ring buffer</span>Fixed-capacity ring buffer using atomics. Benchmark against Mutex&lt;VecDeque&gt;.</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> Minimal pub/sub message bus</span>Topics as typed channels. No heap allocation on the message path. DDS in miniature.</div>
    <div class="sl">Resources</div>
    <div class="st">Rust embedded book · Liu <em>Real-Time Systems</em> Ch.1–3 · Zenoh documentation</div>
  </div>
</div>

<div class="dom d-none" data-domain="5">
  <div class="dh" data-tog="l5"><div class="dn">05</div><div class="dname">Control theory</div><div class="dtag">Compute inputs to achieve desired behavior</div><div class="dbadge">Not started</div><div class="chev">▼</div></div>
  <div class="db" id="lb5">
    <div class="sl">What it is</div>
    <div class="st">Estimation answers "where am I?" Planning answers "where should I go?" Control answers "what do I do with my actuators right now?"</div>
    <div class="sl">Your bridge</div>
    <div class="bridge">LQR is literally solving a minimization problem: find control inputs u that minimize J = Σ(xᵀQx + uᵀRu). MPC is running gradient descent on a prediction horizon in real time. The intuition transfers from ML.</div>
    <div class="sl">The progression</div>
    <ul class="llist">
      <li><strong>PID controller</strong> — proportional + integral + derivative. The building block.</li>
      <li><strong>Stability analysis</strong> — eigenvalues of the closed-loop system matrix.</li>
      <li><strong>LQR</strong> — optimal control for linear systems via Riccati equation.</li>
      <li><strong>MPC</strong> — simulate N steps ahead, optimise, apply first input, repeat.</li>
    </ul>
    <div class="sl">Build</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> PID for a simulated 1D system</span>Mass-spring-damper. Watch it overshoot, undershoot, oscillate. Tune with Ziegler-Nichols.</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> LQR for an inverted pendulum</span>Balance a pole on a cart. The canonical control demo.</div>
    <div class="sl">Resources</div>
    <div class="st">Brian Douglas YouTube · Brunton <em>Data-Driven Control</em> lectures</div>
  </div>
</div>

<div class="dom d-none" data-domain="6">
  <div class="dh" data-tog="l6"><div class="dn">06</div><div class="dname">Planning &amp; decision</div><div class="dtag">Find a feasible path or action sequence</div><div class="dbadge">Not started</div><div class="chev">▼</div></div>
  <div class="db" id="lb6">
    <div class="sl">What it is</div>
    <div class="st">Two sub-problems: <em>path planning</em> (geometric path A→B) and <em>trajectory optimisation</em> (dynamically feasible, minimum cost). Behavior trees sit above both.</div>
    <div class="sl">The progression</div>
    <ul class="llist">
      <li><strong>A* and D* Lite</strong> — graph search. D* Lite replans efficiently.</li>
      <li><strong>RRT / RRT*</strong> — sampling-based planning for continuous spaces.</li>
      <li><strong>Trajectory optimisation</strong> — CHOMP, iLQR. Where planning meets control.</li>
      <li><strong>Behavior trees</strong> — Sequence, Selector, Condition, Action. The standard.</li>
    </ul>
    <div class="sl">Build</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> RRT for 2D obstacle avoidance</span>Random 2D environment, circular obstacles. Grow tree, find path. 3–5 days.</div>
    <div class="proj"><span class="pname"><span class="stag stag-rust">Rust</span> Behavior tree executor</span>Sequence, Selector, Action, Condition, Parallel. Tick-based execution.</div>
    <div class="sl">Resources</div>
    <div class="st">LaValle <em>Planning Algorithms</em> (free) · Colledanchise &amp; Ögren <em>Behavior Trees in Robotics and AI</em></div>
  </div>
</div>

<div class="dom d-partial" data-domain="7">
  <div class="dh" data-tog="l7"><div class="dn">07</div><div class="dname">Mission &amp; autonomy</div><div class="dtag">Coordinating capabilities toward mission objectives</div><div class="dbadge">Adjacent</div><div class="chev">▼</div></div>
  <div class="db" id="lb7">
    <div class="sl">What it is</div>
    <div class="st">Multi-agent coordination, fault-tolerant mission execution, human-machine teaming, distributed state sharing across vehicles.</div>
    <div class="sl">Your bridge</div>
    <div class="bridge">Your AI agents work maps directly here. Both are hierarchical task orchestration. The difference is latency constraints and the nature of the tools — physical effectors, not API calls.</div>
    <div class="sl">Things to understand</div>
    <ul class="llist">
      <li><strong>Multi-agent task allocation</strong> — Hungarian algorithm, auction protocols.</li>
      <li><strong>Consensus and distributed state</strong> — how 10 drones agree on a shared world picture.</li>
      <li><strong>Human-machine teaming</strong> — mixed-initiative control.</li>
      <li><strong>ROS2</strong> — the best pedagogical environment for the full stack.</li>
    </ul>
    <div class="sl">Build</div>
    <div class="proj"><span class="pname"><span class="stag stag-agents">Agents</span> Multi-agent task allocator</span>N UAVs, M targets. Hungarian for global optimal, auction for decentralised.</div>
    <div class="proj"><span class="pname"><span class="stag stag-agents">Agents</span> Fault-tolerant mission planner</span>Replans on sensor failure. Behavior trees + EKF. Connects the stack.</div>
    <div class="sl">Resources</div>
    <div class="st">ROS2 + Nav2 · Shoham &amp; Leyton-Brown <em>Multiagent Systems</em> · Anduril Lattice talks</div>
  </div>
</div>

<div class="capstone">
  <div class="cap-label">Capstone</div>
  <div class="cap-t">Autonomy Primitives Library in Rust</div>
  <div class="st">Build a single Rust crate: EKF + lock-free sensor buffer + A* planner + PID controller + behavior tree executor. Write a 2D simulation that uses all of them.</div>
  <div class="seq">
    <span class="sq">Math gaps<span class="sq-dur">2 wks</span></span><span class="sq-arr">→</span>
    <span class="sq sq-now">KF → EKF<span class="sq-dur">4 wks</span></span><span class="sq-arr">→</span>
    <span class="sq">SOH bridge<span class="sq-dur">2 wks</span></span><span class="sq-arr">→</span>
    <span class="sq">PID + LQR<span class="sq-dur">3 wks</span></span><span class="sq-arr">→</span>
    <span class="sq">A* + RRT<span class="sq-dur">2 wks</span></span><span class="sq-arr">→</span>
    <span class="sq">BT<span class="sq-dur">2 wks</span></span><span class="sq-arr">→</span>
    <span class="sq">Integration<span class="sq-dur">2 wks</span></span>
  </div>
</div>
`;

/* ─────────────────────────────────────────────
   READING LIST HTML
   ───────────────────────────────────────────── */

const readingListHTML = `
<div class="tier-legend">
  <div class="tl"><div class="tldot tldot-gold"></div>Gold standard — the authoritative reference</div>
  <div class="tl"><div class="tldot tldot-hands"></div>Hands-on — build things while you learn</div>
  <div class="tl"><div class="tldot tldot-101"></div>101 — get oriented first</div>
</div>

<div class="dom d-partial" data-domain="1">
  <div class="dh" data-tog="r1"><div class="dn">01</div><div class="dname">Mathematical foundations</div><div class="dbadge">Partial</div><div class="chev">▼</div></div>
  <div class="db" id="rb1">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Mathematics for Machine Learning<span class="bfree">free</span></span><span class="bauth">Deisenroth, Faisal, Ong · 2020</span><div class="bdesc">Purpose-built bridge from ML to deeper math. Linear algebra, probability, and optimisation in unified notation.</div></div>
        <div class="book"><span class="btitle">Introduction to Linear Algebra</span><span class="bauth">Gilbert Strang · 5th ed</span><div class="bdesc">The MIT standard. Eigenvalue intuition and matrix decompositions from first principles.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">Kalman and Bayesian Filters in Python<span class="bfree">free</span></span><span class="bauth">Roger Labbe · GitHub</span><div class="bdesc">Every formula has a notebook cell. Learn by implementing.</div></div>
        <div class="book"><span class="btitle">Mathematics for ML Specialisation<span class="bfree">free audit</span></span><span class="bauth">Imperial College · Coursera</span><div class="bdesc">Worked problems. Linear algebra, multivariate calculus, PCA.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Essence of Linear Algebra<span class="bfree">free</span></span><span class="bauth">3Blue1Brown · YouTube</span><div class="bdesc">Visual geometric intuition. 15 videos, ~3 hours. Watch first.</div></div>
        <div class="book"><span class="btitle">No Bullshit Guide to Linear Algebra</span><span class="bauth">Ivan Savov · 2nd ed</span><div class="bdesc">Densely direct. No padding, just the tools.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-next" data-domain="2">
  <div class="dh" data-tog="r2"><div class="dn">02</div><div class="dname">Probabilistic estimation</div><div class="dbadge">Priority next</div><div class="chev">▼</div></div>
  <div class="db" id="rb2">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Probabilistic Robotics</span><span class="bauth">Thrun, Burgard, Fox · MIT Press 2005</span><div class="bdesc">THE book. KF, EKF, particle filters, SLAM — all derived rigorously.</div></div>
        <div class="book"><span class="btitle">State Estimation for Robotics<span class="bfree">free</span></span><span class="bauth">Tim Barfoot · Cambridge 2017</span><div class="bdesc">Uses Lie groups for 3D estimation. Graduate level. Free PDF.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">Kalman and Bayesian Filters in Python<span class="bfree">free</span></span><span class="bauth">Roger Labbe</span><div class="bdesc">14 Jupyter notebooks. Build every filter from scratch.</div></div>
        <div class="book"><span class="btitle">filterpy<span class="bfree">free</span></span><span class="bauth">Roger Labbe · Python</span><div class="bdesc">Reference implementation. Cleaner than most textbook pseudocode.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Understanding the Kalman Filter<span class="bfree">free</span></span><span class="bauth">Faragher · IEEE 2012</span><div class="bdesc">8-page paper. Best single document for intuition.</div></div>
        <div class="book"><span class="btitle">The Kalman Filter<span class="bfree">free</span></span><span class="bauth">Michel van Biezen · YouTube</span><div class="bdesc">55 short videos. Scalar examples before matrix form.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-strong" data-domain="3">
  <div class="dh" data-tog="r3"><div class="dn">03</div><div class="dname">Perception &amp; signal processing</div><div class="dbadge">Strong</div><div class="chev">▼</div></div>
  <div class="db" id="rb3">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Multiple View Geometry</span><span class="bauth">Hartley &amp; Zisserman · 2004</span><div class="bdesc">The geometric CV bible. Projective geometry, epipolar geometry, reconstruction.</div></div>
        <div class="book"><span class="btitle">Introduction to Radar Systems</span><span class="bauth">Skolnik · 3rd ed</span><div class="bdesc">Range, Doppler, antenna patterns, clutter, CFAR.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">Think DSP<span class="bfree">free</span></span><span class="bauth">Allen Downey</span><div class="bdesc">FFT, filtering, spectrograms, convolution — all in Python.</div></div>
        <div class="book"><span class="btitle">Programming Computer Vision with Python<span class="bfree">free</span></span><span class="bauth">Jan Erik Solem</span><div class="bdesc">Feature detection, optical flow, 3D reconstruction.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Computer Vision: Algorithms and Applications<span class="bfree">free</span></span><span class="bauth">Szeliski · 2nd ed</span><div class="bdesc">The accessible modern reference. Image formation to deep learning.</div></div>
        <div class="book"><span class="btitle">But what is the Fourier Transform?<span class="bfree">free</span></span><span class="bauth">3Blue1Brown</span><div class="bdesc">Visual intuition for frequency domain in 20 minutes.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-starting" data-domain="4">
  <div class="dh" data-tog="r4"><div class="dn">04</div><div class="dname">Real-time systems</div><div class="dbadge">Starting</div><div class="chev">▼</div></div>
  <div class="db" id="rb4">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Hard Real-Time Computing Systems</span><span class="bauth">Buttazzo · 3rd ed</span><div class="bdesc">Task scheduling, priority inversion, deadline guarantees.</div></div>
        <div class="book"><span class="btitle">Real-Time Systems</span><span class="bauth">Jane Liu · 2000</span><div class="bdesc">Rate monotonic scheduling, EDF, schedulability analysis.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">The Rust Embedded Book<span class="bfree">free</span></span><span class="bauth">Rust Embedded WG</span><div class="bdesc">no_std, memory-mapped registers, interrupt handlers, HAL.</div></div>
        <div class="book"><span class="btitle">Embedded Rust in Action</span><span class="bauth">McNamara · Manning 2023</span><div class="bdesc">Project-based. Build actual embedded systems in Rust.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Introduction to Embedded Systems<span class="bfree">free</span></span><span class="bauth">Lee &amp; Seshia · 2nd ed</span><div class="bdesc">Models of computation, timing semantics, concurrency.</div></div>
        <div class="book"><span class="btitle">FreeRTOS Getting Started<span class="bfree">free</span></span><span class="bauth">freertos.org</span><div class="bdesc">Tasks, queues, semaphores. The mental model even for Rust.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-none" data-domain="5">
  <div class="dh" data-tog="r5"><div class="dn">05</div><div class="dname">Control theory</div><div class="dbadge">Not started</div><div class="chev">▼</div></div>
  <div class="db" id="rb5">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Feedback Systems<span class="bfree">free</span></span><span class="bauth">Åström &amp; Murray</span><div class="bdesc">The modern definitive reference. Classical and modern control unified. Free PDF.</div></div>
        <div class="book"><span class="btitle">Data-Driven Science and Engineering<span class="bfree">free</span></span><span class="bauth">Brunton &amp; Kutz</span><div class="bdesc">Bridges control to ML. DMD, SINDy, Koopman operators. Free PDF.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">Control Bootcamp<span class="bfree">free</span></span><span class="bauth">Steve Brunton · YouTube</span><div class="bdesc">30 videos. PID through LQR, Kalman, MPC. Code alongside.</div></div>
        <div class="book"><span class="btitle">Brian Douglas — Control Systems<span class="bfree">free</span></span><span class="bauth">YouTube</span><div class="bdesc">~100 videos with excellent animations. The Khan Academy of control.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Modern Control Engineering</span><span class="bauth">Ogata · 5th ed</span><div class="bdesc">The standard undergraduate textbook.</div></div>
        <div class="book"><span class="btitle">MATLAB Tech Talks: Control<span class="bfree">free</span></span><span class="bauth">MathWorks · YouTube</span><div class="bdesc">Short animated explainers. PID, transfer functions, state-space.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-none" data-domain="6">
  <div class="dh" data-tog="r6"><div class="dn">06</div><div class="dname">Planning &amp; decision</div><div class="dbadge">Not started</div><div class="chev">▼</div></div>
  <div class="db" id="rb6">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Planning Algorithms<span class="bfree">free</span></span><span class="bauth">LaValle</span><div class="bdesc">Discrete search through sampling-based through trajectory optimisation.</div></div>
        <div class="book"><span class="btitle">Behavior Trees in Robotics and AI<span class="bfree">free</span></span><span class="bauth">Colledanchise &amp; Ögren</span><div class="bdesc">The only dedicated BT textbook. Formal analysis, design patterns.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">Underactuated Robotics<span class="bfree">free</span></span><span class="bauth">Russ Tedrake · MIT</span><div class="bdesc">Trajectory optimisation, LQR trees, MPC. Best free graduate course.</div></div>
        <div class="book"><span class="btitle">OMPL Tutorials<span class="bfree">free</span></span><span class="bauth">ompl.kavrakilab.org</span><div class="bdesc">RRT, PRM, 20+ algorithms with unified interface.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">AI for Robotics<span class="bfree">free</span></span><span class="bauth">Sebastian Thrun · Udacity</span><div class="bdesc">Localisation, search, PID, SLAM. Good mental map.</div></div>
        <div class="book"><span class="btitle">AI: A Modern Approach Ch. 3–4</span><span class="bauth">Russell &amp; Norvig · 4th ed</span><div class="bdesc">BFS, DFS, A*, heuristics. Exceptionally clear.</div></div>
      </div>
    </div>
  </div>
</div>

<div class="dom d-partial" data-domain="7">
  <div class="dh" data-tog="r7"><div class="dn">07</div><div class="dname">Mission &amp; autonomy</div><div class="dbadge">Adjacent</div><div class="chev">▼</div></div>
  <div class="db" id="rb7">
    <div class="tgrid">
      <div class="tier tier-g"><div class="tier-label">Gold standard</div>
        <div class="book"><span class="btitle">Multiagent Systems<span class="bfree">free</span></span><span class="bauth">Shoham &amp; Leyton-Brown</span><div class="bdesc">Game theory, mechanism design, distributed optimisation. Free PDF.</div></div>
        <div class="book"><span class="btitle">Intro to Autonomous Mobile Robots</span><span class="bauth">Siegwart, Nourbakhsh, Scaramuzza</span><div class="bdesc">Localisation, mapping, navigation, architecture.</div></div>
      </div>
      <div class="tier tier-h"><div class="tier-label">Hands-on</div>
        <div class="book"><span class="btitle">ROS2 + Nav2<span class="bfree">free</span></span><span class="bauth">docs.ros.org</span><div class="bdesc">All stack layers running together. DDS, BT, EKF, A*, PID.</div></div>
        <div class="book"><span class="btitle">Programming Robots with ROS</span><span class="bauth">Quigley, Gerkey, Smart</span><div class="bdesc">Practical guide. Architectural concepts are timeless.</div></div>
      </div>
      <div class="tier tier-i"><div class="tier-label">101</div>
        <div class="book"><span class="btitle">Anduril Lattice talks<span class="bfree">free</span></span><span class="bauth">Anduril · YouTube</span><div class="bdesc">Rare look into production mission system design.</div></div>
        <div class="book"><span class="btitle">MIT 6.832 Underactuated Robotics<span class="bfree">free</span></span><span class="bauth">Russ Tedrake · MIT OCW</span><div class="bdesc">Planning + control + dynamics + autonomy unified.</div></div>
      </div>
    </div>
  </div>
</div>
`;

/* ─────────────────────────────────────────────
   KF DOMAIN PARALLELS HTML
   ───────────────────────────────────────────── */

const parallelsHTML = `
<div class="par-intro">
  <div class="par-intro-text">Eight structural themes that recur across every domain where Kalman filtering is applied — from battery degradation to missile tracking to nuclear reactor monitoring. Each theme maps a concept you know from batteries to its exact parallel in defence, aerospace, and energy systems.</div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p1"><div class="dn">01</div><div class="dname">State vs. observation</div><div class="dtag">You can't measure what you care about</div><div class="chev">▼</div></div>
  <div class="db" id="pb1">
    <div class="par-anchor">In your battery work, you measure <b>V(t), I(t), T(t)</b> but care about <b>SOH, fade rate, internal resistance</b>. None of these appear on any instrument. KF exists entirely to close this gap: given noisy indirect signals, infer the hidden physical state.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Missile tracking — Sentry Tower</div><div class="par-row"><b>Observe:</b> radar range r, azimuth θ, elevation φ</div><div class="par-row"><b>Want:</b> [x, y, z, vx, vy, vz] in Cartesian</div><div class="par-row"><b>KF does:</b> inverts noisy polar obs into Cartesian state estimate with covariance</div></div>
      <div class="par-box par-box-amber"><div class="par-box-label">Nuclear reactor — PWR</div><div class="par-row"><b>Observe:</b> thermocouple at coolant outlet, neutron detector counts</div><div class="par-row"><b>Want:</b> fuel centerline temp, reactivity ρ, fission rate</div><div class="par-row"><b>KF does:</b> maps accessible coolant measurements to inaccessible core state</div></div>
      <div class="par-box par-box-rose"><div class="par-box-label">Satellite attitude — ADCS</div><div class="par-row"><b>Observe:</b> star positions in sensor frame, gyroscope angular rate</div><div class="par-row"><b>Want:</b> full quaternion orientation + accumulated gyro bias</div><div class="par-row"><b>KF does:</b> fuses snapshots with integration to estimate attitude and its drift</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> every domain has a gap between what instruments return and what engineers need. KF inverts that gap optimally. The observation model h(x) defines the gap; the filter closes it.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Distinct types for state and observation</b> — <code>struct State([f64; N])</code> and <code>struct Obs([f64; M])</code> are different types in Rust. Passing an observation where a state is expected is a compile error, not a runtime crash.</div>
      <div class="par-sw-row"><b>Const generics for dimension safety</b> — <code>Filter&lt;const N: usize, const M: usize&gt;</code> catches dimension mismatches at compile time. The matrix multiply H @ P where H is M×N and P is N×N produces M×N — if the dimensions are wrong, the code won't compile.</div>
      <div class="par-sw-row"><b>Project connection</b> — Project 3: first time you define a typed state struct in Rust and feel the compiler enforcing the math.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p2"><div class="dn">02</div><div class="dname">Process model — your physics is your prediction</div><div class="dtag">The F matrix is where domain expertise enters</div><div class="chev">▼</div></div>
  <div class="db" id="pb2">
    <div class="par-anchor">Your <b>degradation model</b> — how SOH evolves from cycle k to k+1 — is the F matrix. Every predict step the filter asks: given what I estimate now, where should this cell be next cycle? That answer comes entirely from your electrochemistry knowledge. KF has no opinions about battery degradation. You bring the physics. KF runs it.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Ballistic missile</div><div class="par-row"><b>Physics encoded:</b> Newton + drag. x(k+1) = x(k) + v·dt, v(k+1) = v(k) − (drag/m)·dt</div><div class="par-row"><b>When right:</b> purely ballistic trajectory → perfect tracking</div><div class="par-row"><b>When wrong:</b> assume ballistic, it's actually a maneuvering glide vehicle → filter diverges</div></div>
      <div class="par-box par-box-amber"><div class="par-box-label">Nuclear reactor</div><div class="par-row"><b>Physics encoded:</b> point kinetics equations: dn/dt = [(ρ−β)/Λ]·n + Σλ_i·C_i</div><div class="par-row"><b>When right:</b> steady-state → predictions accurate to millidegrees</div><div class="par-row"><b>When wrong:</b> steady-state model during rod withdrawal → filter misses the transient entirely</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> the predict step is where you encode domain knowledge. A wrong F matrix is worse than no filter — the filter becomes confidently wrong.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Process model as a Rust trait</b> — <code>trait ProcessModel { fn predict(&amp;self, x: &amp;State) -&gt; State; fn jacobian(&amp;self, x: &amp;State) -&gt; Matrix; }</code> The filter core becomes domain-agnostic. Swapping battery degradation for ballistic trajectory means implementing a different struct, not rewriting the filter.</div>
      <div class="par-sw-row"><b>Analytic Jacobian required for real-time</b> — numeric differentiation costs 2N function evaluations per step. At 1kHz with N=6, that's 12,000 evaluations/second. You must derive ∂f/∂x analytically.</div>
      <div class="par-sw-row"><b>Project connection</b> — Project 4: first time you write an analytic Jacobian in Rust and discover it's just partial derivatives of your physics equation.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p3"><div class="dn">03</div><div class="dname">Process noise Q — your model's confession</div><div class="dtag">How wrong are you about how the system evolves?</div><div class="chev">▼</div></div>
  <div class="db" id="pb3">
    <div class="par-anchor">When you model capacity fade as a smooth curve, you're assuming you know this cell's trajectory. <b>Q admits you don't.</b> A field battery with irregular cycling deserves large Q. A lab cell on a controlled protocol deserves small Q. Getting Q wrong is the most common reason KF implementations diverge in practice.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Maneuvering aircraft — Singer model</div><div class="par-row"><b>Q small:</b> commercial airliner cruising. "Constant velocity" model is nearly right.</div><div class="par-row"><b>Q large:</b> fighter jet in evasive maneuvers — pulling 9g. Singer model sets Q = σ²_a.</div><div class="par-row"><b>Wrong Q:</b> small Q for a maneuvering target → filter lags badly in turns</div></div>
      <div class="par-box par-box-amber"><div class="par-box-label">Nuclear — load following</div><div class="par-row"><b>Q small:</b> steady baseload at 100% power. Kinetics model is excellent.</div><div class="par-row"><b>Q large:</b> operator ramping power — control rod movements your model doesn't know about.</div><div class="par-row"><b>Wrong Q:</b> baseload Q during a transient → filter misses the reactivity change</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> Q is your honesty about model uncertainty. Every domain has stable-operation Q (small) and dynamic-operation Q (large). Adaptive Q estimation — updating Q from innovation residuals — is a research area precisely because every domain needs it.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Pre-allocated, stack-resident matrices</b> — Q is N×N, computed every predict step. Pre-allocate at construction. Never allocate on the predict path. At 1kHz with N=6, a heap allocation here is a timing violation.</div>
      <div class="par-sw-row"><b>Adaptive Q requires explicit synchronization</b> — if Q changes at runtime (different regime), the change must be atomic with respect to the predict loop. A partially-updated Q produces a non-symmetric matrix. Either double-buffer Q or gate the update between ticks.</div>
      <div class="par-sw-row"><b>Project connection</b> — Projects 3–4: tune Q and watch the filter diverge when it's too small. The most instructive failure mode to encounter early.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p4"><div class="dn">04</div><div class="dname">Measurement noise R — your sensor's datasheet</div><div class="dtag">How much should the filter trust what you just measured?</div><div class="chev">▼</div></div>
  <div class="db" id="pb4">
    <div class="par-anchor">Your voltage probe noise — ±2mV ADC quantization, ±0.5mV thermal noise — goes directly into <b>R</b>. Set R too small → KF over-trusts noisy readings, state jitters. Set R too large → KF ignores good data. R is not a tuning knob. It's a measurement. It comes from calibration runs.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Radar system</div><div class="par-row"><b>R for range:</b> ΔR = c/2B — physics-determined by bandwidth. Not tunable.</div><div class="par-row"><b>R for angle:</b> ΔΘ ≈ λ/D — physics-determined by aperture.</div><div class="par-row"><b>Wrong R:</b> use clear-sky R in ground clutter → filter tracks the ground, not the target</div></div>
      <div class="par-box par-box-blue"><div class="par-box-label">GPS receiver — adaptive R</div><div class="par-row"><b>Open sky:</b> ±3m horizontal (HDOP + receiver spec)</div><div class="par-row"><b>Urban canyon:</b> ±20m from multipath — same receiver, 10× worse R</div><div class="par-row"><b>Research area:</b> estimating R in real time from carrier-to-noise ratio</div></div>
      <div class="par-box par-box-purple"><div class="par-box-label">Submarine — depth vs sonar</div><div class="par-row"><b>Depth gauge:</b> ±0.1m — well-characterised, stable</div><div class="par-row"><b>USBL acoustic:</b> ±2m calm water, ±10m in thermocline. Same hardware, wildly different R by season.</div><div class="par-row"><b>Key:</b> operators know the season and depth — that domain knowledge tunes R</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> R is physics-determined from sensor bandwidth, aperture, or noise floor — not a free parameter. When R varies with conditions, that variation must be modelled, not hidden in a fixed number.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Sensor failure as <code>Option&lt;Obs&gt;</code></b> — when a sensor fails (GPS jammed, probe disconnected), model absence as <code>None</code>. When R → ∞, Kalman gain drops to zero automatically — the update step is a no-op. No special-case logic needed.</div>
      <div class="par-sw-row"><b>Adaptive R thread safety</b> — if R varies with conditions, updating R must be atomic with respect to the update step. A partially-updated R produces an asymmetric innovation covariance. Double-buffer R or gate updates between observations.</div>
      <div class="par-sw-row"><b>Project connection</b> — Project 19 (IMU+GPS fusion): GPS goes unavailable, R → ∞, filter continues predicting correctly without any special-case code.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p5"><div class="dn">05</div><div class="dname">Kalman gain K — automatic credibility weighting</div><div class="dtag">You never set K directly. It emerges from Q and R.</div><div class="chev">▼</div></div>
  <div class="db" id="pb5">
    <div class="par-anchor">Early in your battery's life, model is uncertain (P large), <b>K large</b> → lean on measurements. By cycle 200, model is calibrated, P shrinks, K drops. When an anomalous voltage arrives at cycle 300 — noise or lithium plating? — the filter weighs the evidence automatically. K = P·Hᵀ·(H·P·Hᵀ + R)⁻¹. You tune Q and R. K emerges.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Drone LIDAR in fog</div><div class="par-row"><b>Clear:</b> R small, K large → trust LIDAR, correct aggressively</div><div class="par-row"><b>Heavy fog:</b> R spikes, K drops automatically → rely on IMU prediction</div><div class="par-row"><b>Key:</b> no mode-switching. The filter detects sensor degradation through R and adjusts K in real time.</div></div>
      <div class="par-box par-box-blue"><div class="par-box-label">Aircraft — GPS reacquisition</div><div class="par-row"><b>GPS available:</b> K moderate, P bounded</div><div class="par-row"><b>GPS denied:</b> no updates, P grows as INS drifts. K computed but never applied.</div><div class="par-row"><b>GPS returns:</b> P large → K spikes → filter absorbs large correction. The visible position jump is K doing its job correctly.</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> K = P·Hᵀ·(H·P·Hᵀ + R)⁻¹ is identical in your battery filter, the Sentry Tower, and an F-16 navigation computer. You tune Q and R. K falls out.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Cholesky for innovation covariance inversion</b> — computing K requires inverting (H·P·Hᵀ + R), which must be symmetric positive definite. Use Cholesky, not LU. Faster for SPD matrices, numerically more stable, and fails loudly if positive definiteness is violated.</div>
      <div class="par-sw-row"><b>Zero heap allocation in gain computation</b> — pre-allocate all intermediate matrices at filter construction. The entire K computation should touch zero heap memory at runtime. At 1kHz, a single allocation is a 1ms latency spike.</div>
      <div class="par-sw-row"><b>Project connection</b> — Projects 4–5: first time a non-positive-definite innovation covariance crashes your Cholesky and you have to understand why P drifted.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p6"><div class="dn">06</div><div class="dname">EKF Jacobian — taking the derivative of your physics</div><div class="dtag">Nonlinear world → linearise at current estimate → standard KF</div><div class="chev">▼</div></div>
  <div class="db" id="pb6">
    <div class="par-anchor">The relationship between your battery state [SOC, R_internal] and observed terminal voltage is nonlinear — the OCV curve is an S-shape. The EKF linearises around the current estimate: <b>H = ∂V/∂[SOC, R_internal]</b> — partial derivatives of your electrochemical observation equation. If you can write the physics, you can take its derivative. That's the whole EKF extension.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Radar — polar to Cartesian</div><div class="par-row"><b>h([x,y,z]):</b> [√(x²+y²+z²), atan2(y,x), atan2(z,√(x²+y²))]</div><div class="par-row"><b>Jacobian H:</b> 3×3 matrix of atan2 and √ partial derivatives</div><div class="par-row"><b>Why needed:</b> running KF in polar is numerically unstable near the poles. EKF in Cartesian via this Jacobian is standard.</div></div>
      <div class="par-box par-box-amber"><div class="par-box-label">Nuclear — power vs reactivity</div><div class="par-row"><b>Nonlinearity:</b> n_ss = n_0/(1 − ρ/β) — steep near criticality, shallow at low power</div><div class="par-row"><b>Jacobian:</b> ∂n/∂ρ = n_0·β/(β−ρ)² — filter becomes more sensitive near dangerous operating points automatically</div><div class="par-row"><b>Why it matters:</b> near criticality, small ρ changes cause huge n changes</div></div>
      <div class="par-box par-box-rose"><div class="par-box-label">Spacecraft — quaternion attitude</div><div class="par-row"><b>Nonlinearity:</b> h(q) = R(q) × star_direction — nonlinear in quaternion components</div><div class="par-row"><b>Why MEKF:</b> standard EKF violates unit-norm. Multiplicative EKF parameterises error as small rotation.</div><div class="par-row"><b>Lesson:</b> manifold geometry forces algorithm adaptation</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> the Jacobian is multivariable calculus applied to domain equations. Different physics, same operation: ∂h/∂x at the current estimate.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Analytic, not numeric Jacobians in real-time</b> — numerical differentiation costs 2N function evaluations per step. At 1kHz with N=6, that's 12,000 evaluations/second. Derive ∂f/∂x and ∂h/∂x analytically and hard-code them. Highest-leverage math-to-code work in the EKF.</div>
      <div class="par-sw-row"><b>Jacobian caching for slow-changing dynamics</b> — if the Jacobian changes slowly, recompute only when ‖x(k) − x(k−1)‖ exceeds a threshold. Cache the last computed Jacobian.</div>
      <div class="par-sw-row"><b>Project connection</b> — Project 4 (EKF 2D tracking): first time you hand-derive the atan2 Jacobian in Rust and verify it numerically against finite differences as a test.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p7"><div class="dn">07</div><div class="dname">Multi-rate fusion — fast + slow, one filter</div><div class="dtag">The predict/update split was designed for this</div><div class="chev">▼</div></div>
  <div class="db" id="pb7">
    <div class="par-anchor">Two data streams in battery work: <b>cycle-level capacity</b> (one reading per full cycle, hours apart) and <b>real-time terminal voltage</b> (milliseconds apart). Radically different rates. EKF predict runs at the fast rate. Update fires when the slow measurement arrives. This predict/update decoupling appears in every serious instrumentation system ever built.</div>
    <div class="sl">Domain parallels</div>
    <div class="par-grid">
      <div class="par-box par-box-blue"><div class="par-box-label">Aircraft — IMU + GPS</div><div class="par-row"><b>Fast:</b> IMU at 200Hz — drifts ~1m/hour</div><div class="par-row"><b>Slow:</b> GPS at 1Hz — accurate ±3m, no drift</div><div class="par-row"><b>Architecture:</b> predict at 200Hz with IMU. Update at 1Hz with GPS. Runs in every smartphone, UAV, and commercial aircraft.</div></div>
      <div class="par-box par-box-purple"><div class="par-box-label">Submarine — RLG + USBL</div><div class="par-row"><b>Fast:</b> ring laser gyro at 1kHz — drifts 0.1nm/hour</div><div class="par-row"><b>Slow:</b> USBL acoustic every ~10s — noisy, but bounded</div><div class="par-row"><b>Architecture:</b> predict at 1kHz silently. Update at 0.1Hz acoustically. Ping timing is a tactical decision.</div></div>
      <div class="par-box par-box-green"><div class="par-box-label">Power grid — PMU + SCADA</div><div class="par-row"><b>Fast:</b> PMU at 30–120Hz — voltage phasors and frequency</div><div class="par-row"><b>Slow:</b> SCADA at 1 sample/4 seconds — power flows, switch states</div><div class="par-row"><b>Architecture:</b> same predict/update pattern at grid scale</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> fast + drifting sensor fused with slow + accurate reference. The topology is universal. Only physics and rates change.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Lock-free ring buffer between sensor threads</b> — IMU thread writes to SPSC lock-free buffer at 200Hz. EKF thread reads without blocking. GPS writes to its own buffer at 1Hz. EKF drains both each tick. A mutex introduces priority inversion — the 200Hz loop misses its deadline. Project 7 (lock-free ring buffer) is the software infrastructure that makes multi-rate fusion work.</div>
      <div class="par-sw-row"><b>Timing budget enforcement</b> — predict step must complete in &lt;5ms (for 200Hz). Measure worst-case execution time in CI with <code>std::time::Instant</code> and assert it stays within budget.</div>
      <div class="par-sw-row"><b>Project connection</b> — Projects 7 + 19 in sequence: build the ring buffer, then wire it into the IMU+GPS fusion filter. The two projects compose directly.</div>
    </div>
  </div>
</div>

<div class="par-theme" data-domain="0">
  <div class="dh" data-tog="p8"><div class="dn">08</div><div class="dname">Observability — what no filter can save you from</div><div class="dtag">If the state can't be inferred from your measurements, tuning cannot help</div><div class="chev">▼</div></div>
  <div class="db" id="pb8">
    <div class="par-anchor">If you only measure OCV at rest, you can estimate SOC but <b>cannot simultaneously estimate SOC and internal resistance</b> from one reading — infinitely many [SOC, R] pairs produce the same voltage. You need a discharge pulse to make resistance visible. No amount of filter sophistication saves an unobservable system. You must design the experiment to make states observable.</div>
    <div class="sl">Observability constraints in other domains</div>
    <div class="par-grid">
      <div class="par-box par-box-red"><div class="par-box-label">Radar — range-only</div><div class="par-row"><b>Problem:</b> single radar, range only. Target at 200km could be anywhere on a sphere — position unobservable.</div><div class="par-row"><b>Fix:</b> add angle measurement (monostatic), or add a second radar for triangulation (bistatic).</div><div class="par-row"><b>Design lesson:</b> radar arrays positioned for observability, not just coverage</div></div>
      <div class="par-box par-box-amber"><div class="par-box-label">Nuclear — coolant-only instrumentation</div><div class="par-row"><b>Problem:</b> all sensors in coolant loop. Coolant temp observable. Fuel pin centerline is NOT.</div><div class="par-row"><b>Fix:</b> instrumented assemblies during commissioning calibrate a heat transfer model. That model becomes h(x) permanently.</div><div class="par-row"><b>Design lesson:</b> pay the observability cost once at design time, run cheap sensors forever</div></div>
    </div>
    <div class="par-insight"><b>Universal pattern:</b> observability matrix O = [H; HF; HF²; ...HF^(n-1)]. If rank(O) &lt; state dimension, some states cannot be estimated. No filter tuning overcomes an unobservable system.</div>
    <div class="par-sw"><div class="par-sw-label">Software discipline this requires</div>
      <div class="par-sw-row"><b>Observability check as a startup assertion</b> — compute rank(O) at filter construction. If rank(O) &lt; N, <code>panic!</code> with a message: "state index 2 is not observable from your H matrix." Catches configuration errors at startup, not after 10 minutes of silently wrong estimates.</div>
      <div class="par-sw-row"><b>Graceful degradation on sensor loss</b> — detect absence, switch to predict-only, track uncertainty growth in P diagonal, reacquire with inflated uncertainty when sensor returns. The growing P diagonal is your real-time readout of estimate degradation.</div>
      <div class="par-sw-row"><b>Project connection</b> — Project 19 (GPS loss) exercises graceful degradation. Project 24 (fault-tolerant mission planner) exercises the full recovery loop.</div>
    </div>
  </div>
</div>
`;

/* ─────────────────────────────────────────────
   NORTH STAR HTML
   ───────────────────────────────────────────── */

const northStarHTML = `
<article class="ns">

<header class="ns-header">
  <h1 class="ns-title">What I'm mastering</h1>
  <p class="ns-sub">A note for when I feel lost from the macro view</p>
  <p class="ns-date">Shekhar · April 2026</p>
</header>

<h2 class="ns-h2">The discipline</h2>
<p class="ns-p">The thing I'm mastering has a precise name, even if nobody uses it consistently: <span class="ns-em">probabilistic state estimation</span>. It is the science of inferring hidden truth from observable noise. The formal discipline of knowing things you cannot directly measure, from evidence that is always imperfect.</p>
<p class="ns-p">This is not a narrow specialty. It is the substrate on which almost every serious physical system in the modern world runs. The GPS in my phone fuses twelve noisy satellite signals through a Kalman filter into a coherent position estimate. Every commercial aircraft maintains its sense of position and attitude through an EKF loop at 200Hz, without touching the ground. A military perimeter tower converts a cloud of radar returns into tracked objects with positions, velocities, and threat assessments — all via a state estimator. A nuclear reactor's control rods are positioned based on a real-time estimate of the core's internal state, computed from sensors that cannot see inside the reactor.</p>
<blockquote class="ns-pull">In every case, the same question: given what I can measure, what is the most probable state of the world right now — and how confident am I?</blockquote>
<p class="ns-p">The reason it feels hard to name is that it appears across domains wearing different labels. In aerospace it's GNC. In robotics it's SLAM and state estimation. In manufacturing it's predictive maintenance. In defence it's sensor fusion and multi-target tracking. These are not different disciplines. They are the same mathematical skeleton wearing different domain clothes.</p>

<hr class="ns-hr">

<h2 class="ns-h2">What I'm not learning</h2>
<p class="ns-p">I'm not learning a tool. I'm not primarily learning Rust, though I'm learning Rust. I'm not primarily learning the Kalman filter, though I'm learning the Kalman filter. I'm learning a way of thinking about physical systems that will remain useful regardless of what the dominant framework looks like in ten years.</p>
<p class="ns-p">The way of thinking: every physical system has a hidden state that evolves over time according to some dynamics. You observe that state indirectly through sensors that lie to varying degrees. Your job is to maintain the best possible estimate of that hidden state, quantify your uncertainty honestly, and use that estimate to make good decisions. Everything else is implementation detail.</p>

<hr class="ns-hr">

<h2 class="ns-h2">The three layers I'm building</h2>
<p class="ns-p">More precisely, I'm assembling a three-layer capability that very few people carry in one mind.</p>
<p class="ns-p">The <span class="ns-em">first layer is the estimation substrate</span> — Kalman filters, EKFs, particle filters, factor graphs. The most transferable layer. The EKF I implement for battery SOH degradation and the EKF inside a UAV navigation computer are the same algorithm. The physics function f(x) changes. The filter does not.</p>
<p class="ns-p">The <span class="ns-em">second layer is the real-time execution environment</span> — making these algorithms run in systems where correctness under time constraints is not optional. Rust, no_std, lock-free data structures, deterministic memory, DDS pub/sub. Most people who understand the estimation math cannot build this layer. Most people who can build this layer don't understand the math.</p>
<p class="ns-p">The <span class="ns-em">third layer is the intelligent orchestration layer</span> — AI agents, learned models, LLM-native interfaces. Where analytical frameworks are well-understood, use them. Where dynamics are too complex to model analytically, where the interface must be natural language — deploy learned systems. The battery intelligence platform at Peak Energy is this layer applied to manufacturing. Anduril's Lattice does the same for mission coordination.</p>
<blockquote class="ns-pull">The person who works fluently across estimation math, real-time systems, and intelligent orchestration is genuinely rare. That is what I'm building toward.</blockquote>

<hr class="ns-hr">

<h2 class="ns-h2">The software engineering is the engineering</h2>
<p class="ns-p">There's a version of this path where estimation math and software engineering are treated as separate concerns — you learn the math, you learn to code, somehow they come together later. That's the wrong model. The software engineering <em>is</em> how the estimation math becomes real. There are five specific disciplines that show up in every project, each directly motivated by the estimation requirements.</p>

<div class="ns-sw-grid">
  <div class="ns-sw-card"><div class="ns-sw-title">Allocation discipline on the hot path</div><div class="ns-sw-body">When the EKF predict step runs every millisecond, <code>Vec::push</code> is a liability — a hidden realloc that can take 10ms. Every matrix must be pre-allocated at construction, reused on every tick.</div><div class="ns-sw-proj">→ Projects 3, 4</div></div>
  <div class="ns-sw-card"><div class="ns-sw-title">Concurrency without locks</div><div class="ns-sw-body">If sensor threads share a mutex, the GPS thread can block the IMU thread mid-prediction — the 200Hz loop misses its deadline. Lock-free ring buffers let threads write and read without blocking.</div><div class="ns-sw-proj">→ Project 7, then 19</div></div>
  <div class="ns-sw-card"><div class="ns-sw-title">Deterministic execution</div><div class="ns-sw-body">Real-time means every code path completes in bounded worst-case time. No dynamic dispatch that flushes the instruction cache. No allocator that could block. <code>no_std</code> Rust forces this.</div><div class="ns-sw-proj">→ Project 8, 22</div></div>
  <div class="ns-sw-card"><div class="ns-sw-title">Numerical precision as correctness</div><div class="ns-sw-body">The covariance P must stay positive definite. Floating-point rounding can destroy this. Joseph form covariance update. Cholesky instead of LU. These aren't optimisations — they're correctness.</div><div class="ns-sw-proj">→ Projects 4, 5</div></div>
  <div class="ns-sw-card"><div class="ns-sw-title">Type safety for physical quantities</div><div class="ns-sw-body">Velocity in m/s and velocity in m/ms are different types. State in the body frame and state in the inertial frame are different types. Rust catches unit errors at compile time.</div><div class="ns-sw-proj">→ Project 22</div></div>
  <div class="ns-sw-card"><div class="ns-sw-title">Trait abstraction for the physics boundary</div><div class="ns-sw-body">The process model f(x) and observation model h(x) should be Rust traits — not hardcoded functions. This makes the estimation core domain-agnostic.</div><div class="ns-sw-proj">→ Project 22</div></div>
</div>

<blockquote class="ns-pull ns-pull-blue">The projects aren't sequenced by domain difficulty. They're sequenced by which software discipline they introduce. Project 7 (lock-free ring buffer) and Project 4 (EKF with numerical stability) are more connected than they look — one is the mathematics of estimation, the other is the engineering that makes it run without corrupting itself.</blockquote>

<hr class="ns-hr">

<h2 class="ns-h2">My specific angle</h2>
<p class="ns-p">Most people trying to enter this field arrive from one of two directions. The first is the academic direction: deep mathematical fluency, limited production experience. They can derive the observability matrix. They have never shipped software running continuously on a factory floor. The second is the software direction: excellent systems engineers, no formation in estimation theory — reaching for ML as the default tool for any uncertainty problem.</p>
<p class="ns-p">I'm entering from a third direction: deep manufacturing operational experience, production ML systems already shipped, now learning the formal estimation substrate my intuition has been trying to reach. The factories, the battery cycling data, the SCADA pipelines — these aren't credentials to put aside. They're the domain context that makes me dangerous. An autonomy engineer who grew up in GNC textbooks has never understood what it means when a cell shows an anomalous voltage curve at cycle 47. I have.</p>
<p class="ns-p"><span class="ns-em">My domain isn't batteries. It isn't manufacturing. My domain is physical systems operating in the presence of noise, uncertainty, and imperfect sensors.</span> I encountered it through battery manufacturing first. I'll encounter it again through many other lenses.</p>

<hr class="ns-hr">

<h2 class="ns-h2">What the work actually looks like</h2>
<p class="ns-p">A domain expert hands me their equations. They tell me what they care about knowing (the hidden state), what they can measure (the observations), and what they know about how the system evolves (the process model). I take that, translate it into a state-space representation, check the observability, tune Q from empirical residuals and R from calibration data, implement the EKF, build the real-time software that runs it without allocating on the hot path, with lock-free sensor feeds, with numerically stable matrix operations — and connect it to the AI layer that makes it interpretable to humans.</p>
<p class="ns-p">The domain expert contributes the physics. I contribute the framework that makes the physics computable in real time, without corrupting itself, with honest uncertainty.</p>

<hr class="ns-hr">

<h2 class="ns-h2">The long view</h2>
<p class="ns-p">Five years from now, I'll be able to walk into almost any industry that operates physical systems — defence, space, nuclear, power grids, autonomous vehicles, manufacturing intelligence — and immediately understand the core estimation problem. I'll know which states are observable before anyone runs the filter. I'll know which software architecture the multi-rate sensor fusion requires before anyone writes a line of code. I'll be the person who connects the physicist's equations to the running system.</p>
<p class="ns-p">The Kalman filter was first published in 1960. It runs right now on the International Space Station, in every commercial airliner, in every GPS receiver, and in every serious autonomous system on earth. The mathematical core is unchanged. The implementations have gotten faster. The people who understand both the math and the software discipline that makes it run correctly are still scarce.</p>

<hr class="ns-hr">

<div class="ns-closing">
  <h2 class="ns-h2">When I feel lost</h2>
  <p class="ns-p">When the Rust borrow checker is fighting me, the Jacobian is wrong, the covariance matrix has gone non-positive-definite, and it's not clear why any of this matters — remember: every physical system that operates beyond human reaction time runs on some version of what I'm building. The math is 65 years old and still unsurpassed. I'm not learning an academic curiosity. I'm learning the substrate.</p>
  <p class="ns-p">The path is estimation → control → planning → real-time → integration. One project at a time. The battery SOH EKF comes first not because batteries are the destination, but because I know that domain well enough to notice immediately when both the math and the software are wrong — and to know which one broke.</p>
  <p class="ns-p ns-final">Keep going. The substrate is worth building.</p>
</div>

</article>
`;

/* ─────────────────────────────────────────────
   PROJECTS DATA + HTML
   ───────────────────────────────────────────── */

const DL: Record<string, string> = {d1:'Math',d2:'Estimation',d3:'Perception',d4:'Real-time',d5:'Control',d6:'Planning',d7:'Mission'};

const projects = [
  {id:1,name:'KF derivation (pen and paper)',domains:['d1','d2'],type:'foundation',diff:1,time:'half day',lang:'Paper',desc:'Derive the Kalman predict and update equations from conditional Gaussian distributions. The derivation makes the filter feel obvious rather than magical.',concepts:['Gaussian conditioning','Bayes theorem','posterior distribution'],anduril:'Foundation for every state estimator in Lattice'},
  {id:2,name:'ODE integrators',domains:['d1','d4'],type:'foundation',diff:1,time:'1 day',lang:'Rust',desc:'Implement Euler and RK4. Simulate a mass-spring-damper and compare accuracy vs step size.',concepts:['Euler integration','RK4','numerical stability','simulation'],anduril:'Physics simulation underpins all trajectory planning'},
  {id:3,name:'1D Kalman filter',domains:['d2'],type:'foundation',diff:1,time:'1–2 days',lang:'Rust',desc:'Track position from noisy scalar GPS. Build the predict/update loop and watch the posterior uncertainty collapse.',concepts:['predict/update loop','Kalman gain','Q and R matrices'],anduril:'GPS smoothing in every Anduril platform'},
  {id:4,name:'EKF: 2D vehicle tracking',domains:['d2'],type:'foundation',diff:2,time:'3–5 days',lang:'Rust',desc:'State = [x, y, heading, speed]. Nonlinear turn model. Noisy [x,y] observations. Implement the Jacobian by hand.',concepts:['Extended Kalman Filter','Jacobian linearization','nonlinear dynamics'],anduril:'Target tracking in Sentry Tower radar'},
  {id:5,name:'UKF: sigma-point filter',domains:['d2'],type:'foundation',diff:3,time:'3–5 days',lang:'Rust',desc:'Re-implement project 4 using the Unscented Kalman Filter. No Jacobians. Compare accuracy on tight manoeuvres.',concepts:['unscented transform','sigma-point propagation','no-Jacobian nonlinear'],anduril:'High-accuracy estimation for precision strike systems'},
  {id:6,name:'Particle filter',domains:['d2'],type:'foundation',diff:3,time:'3–5 days',lang:'Rust',desc:'Track a target with non-Gaussian, multi-modal uncertainty. Implement importance sampling and systematic resampling.',concepts:['importance sampling','systematic resampling','particle degeneracy'],anduril:'Ambiguous target tracking in cluttered environments'},
  {id:7,name:'Lock-free ring buffer',domains:['d4'],type:'foundation',diff:2,time:'2–3 days',lang:'Rust',desc:'Fixed-capacity SPSC buffer using atomics and no mutexes. Benchmark worst-case latency against Mutex<VecDeque>.',concepts:['atomic operations','Acquire/Release ordering','SPSC','lock-free'],anduril:'Sensor data pipeline in every embedded Anduril node'},
  {id:8,name:'DDS-style pub/sub bus',domains:['d4','d7'],type:'foundation',diff:3,time:'1 week',lang:'Rust',desc:'Topics as typed channels. No heap allocation on the message path. Reliable vs best-effort QoS.',concepts:['pub/sub','zero-copy messaging','type-erasure','QoS policies'],anduril:'Lattice node communication protocol'},
  {id:9,name:'Radar range-Doppler sim',domains:['d3'],type:'foundation',diff:2,time:'3–5 days',lang:'Python',desc:'Simulate radar returns from a moving target. Apply range-FFT for distance, Doppler-FFT for velocity, CFAR for detection.',concepts:['range-FFT','Doppler shift','CFAR detection','matched filter'],anduril:'Sentry Tower radar signal processing chain'},
  {id:10,name:'PID controller',domains:['d5'],type:'foundation',diff:1,time:'2 days',lang:'Rust',desc:'1D mass-spring-damper with tunable PID. Tune gains by hand: overshoot, oscillation, integral windup.',concepts:['P/I/D gains','Ziegler-Nichols','steady-state error','integral windup'],anduril:'Inner-loop attitude control in Fury drone'},
  {id:11,name:'LQR: inverted pendulum',domains:['d5'],type:'foundation',diff:3,time:'1 week',lang:'Rust',desc:'Balance a pole on a cart. Solve the algebraic Riccati equation. Tune Q and R and observe the fundamental tradeoff.',concepts:['LQR','Riccati equation','state feedback','Q/R tradeoff'],anduril:'Drone attitude stabilisation, spacecraft pointing'},
  {id:12,name:'MPC: constrained trajectory',domains:['d5','d6'],type:'foundation',diff:4,time:'1–2 weeks',lang:'Rust',desc:'Predict N steps ahead, minimise cost over horizon, apply first input, repeat. Add max-thrust and velocity constraints.',concepts:['receding horizon control','QP solver','constraints','MPC vs PID'],anduril:'High-speed precision manoeuvring'},
  {id:13,name:'A* path planner',domains:['d6'],type:'foundation',diff:1,time:'2–3 days',lang:'Rust',desc:'Shortest path on 2D grid with obstacles. Binary heap priority queue. Extend to D* Lite for dynamic replanning.',concepts:['A* search','admissible heuristics','binary heap','D* Lite'],anduril:'Waypoint planning in Lattice mission system'},
  {id:14,name:'RRT obstacle avoidance',domains:['d6'],type:'foundation',diff:2,time:'3–5 days',lang:'Rust',desc:'Grow a random tree in continuous 2D space, avoiding obstacles. Implement RRT* and watch paths converge.',concepts:['sampling-based planning','nearest-neighbour','RRT*','configuration space'],anduril:'UAV path planning through complex 3D terrain'},
  {id:15,name:'Behavior tree executor',domains:['d6','d7'],type:'foundation',diff:3,time:'1 week',lang:'Rust',desc:'Implement Sequence, Selector, Parallel, Action, and Condition nodes. Tick-based execution.',concepts:['BT node types','tick loop','composability','Success/Failure/Running'],anduril:'Mission execution architecture inside Lattice'},
  {id:16,name:'Multi-agent task allocator',domains:['d7'],type:'foundation',diff:3,time:'1 week',lang:'Rust',desc:'N vehicles, M targets. Hungarian algorithm for centralised optimal, then contract-net auction for decentralised.',concepts:['Hungarian algorithm','auction protocol','task assignment','decentralised coordination'],anduril:'Multi-UAV swarm coordination in Lattice'},
  {id:17,name:'Visual odometry',domains:['d3','d2'],type:'bridge',diff:3,time:'1–2 weeks',lang:'Python',desc:'Feature detection → matching → essential matrix → decompose to R,t → camera trajectory. CV meets estimation.',concepts:['epipolar geometry','RANSAC','essential matrix','motion estimation'],anduril:'Vision-based navigation in GPS-denied environments'},
  {id:18,name:'Battery SOH with EKF',domains:['d2','d3'],type:'bridge',diff:3,time:'1–2 weeks',lang:'Rust',desc:'Replace your LSTM with an analytical EKF degradation model. State = [capacity_fade_rate, resistance]. The key bridge project.',concepts:['state-space degradation','analytical vs learned estimation','PHM validation'],anduril:'PHM systems in defence logistics'},
  {id:19,name:'IMU + GPS fusion',domains:['d3','d2','d4'],type:'bridge',diff:3,time:'1–2 weeks',lang:'Rust',desc:'Fuse 100Hz IMU (drifting) with 1Hz GPS (accurate) via EKF. The navigation core in every autonomous platform.',concepts:['multi-rate sensor fusion','IMU noise model','bias estimation','integration drift'],anduril:'Navigation core in Fury, Ghost 4, Roadrunner'},
  {id:20,name:'EKF + PID closed loop',domains:['d2','d5'],type:'bridge',diff:3,time:'1–2 weeks',lang:'Rust',desc:'EKF estimates state from noisy observations, PID acts on the estimate. Demonstrates the separation principle.',concepts:['observer-controller','separation principle','closed-loop estimation','noisy control'],anduril:'Every closed-loop autonomous system'},
  {id:21,name:'BT + A* navigator',domains:['d6','d7'],type:'bridge',diff:3,time:'1–2 weeks',lang:'Rust',desc:'Behavior tree sequences: localise → plan (A*) → follow waypoints (PID) → handle obstacles. First sense-plan-act loop.',concepts:['sense-plan-act','behavior orchestration','reactive replanning','task sequencing'],anduril:'Autonomous navigation missions in Lattice'},
  {id:22,name:'Autonomy primitives library',domains:['d2','d4','d5','d6'],type:'capstone',diff:4,time:'6–8 weeks',lang:'Rust',desc:'One Rust crate: EKF + lock-free sensor buffer + PID + A* planner + behavior tree executor. The portfolio piece.',concepts:['crate architecture','API design','no_std compatibility','integration testing'],anduril:'Maps to every Anduril platform abstraction layer'},
  {id:23,name:'2D autonomy simulator',domains:['d2','d5','d6','d7'],type:'capstone',diff:5,time:'8–10 weeks',lang:'Rust',desc:'A robot that localises via EKF, plans with RRT, controls with PID, executes missions via BT — full autonomy loop.',concepts:['full autonomy loop','sensor simulation','end-to-end testing'],anduril:'Isomorphic to every mobile autonomous platform'},
  {id:24,name:'Fault-tolerant mission planner',domains:['d6','d7'],type:'capstone',diff:4,time:'2–3 weeks',lang:'Rust',desc:'Missions that survive sensor failure, waypoint denial, comms loss. BT-based fault recovery trees.',concepts:['fault detection','graceful degradation','mission resilience','recovery behaviors'],anduril:'Critical for contested environments'},
  {id:25,name:'Deep Kalman filter',domains:['d2','d3'],type:'capstone',diff:5,time:'2–3 weeks',lang:'Python',desc:'EKF where the process model is a small neural net trained on battery data. Retains KF uncertainty + ML expressiveness.',concepts:['learned process model','differentiable KF','hybrid estimation','uncertainty propagation'],anduril:'Next-gen estimation for complex physical systems'},
];

function buildProjectsHTML() {
  function dots(d: number) {
    return Array.from({length: 5}, (_, i) =>
      `<span class="pdot ${i < d ? 'pdot-filled' : ''}" style="--dot-level: ${d}"></span>`
    ).join('');
  }

  const cards = projects.map(p => {
    const domainBadges = p.domains.map(d => `<span class="pdom pdom-${d}">${DL[d]}</span>`).join('');
    const typeBadge = p.type !== 'foundation' ? `<span class="ptype ptype-${p.type}">${p.type}</span>` : '';
    const conceptTags = p.concepts.map(c => `<span class="pconcept">${c}</span>`).join('');

    return `<div class="pcard pcard-${p.type}" data-type="${p.type}" data-domains="${p.domains.join(',')}">
      <div class="pcard-head">${domainBadges}${typeBadge}</div>
      <div class="pcard-title">${p.name}</div>
      <div class="pcard-desc">${p.desc}</div>
      <div class="pcard-concepts">${conceptTags}</div>
      <div class="pcard-meta">
        <span class="pcard-lang">${p.lang}</span>
        <span class="pcard-dots">${dots(p.diff)}</span>
        <span class="pcard-time">${p.time}</span>
      </div>
      <div class="pcard-anduril">${p.anduril}</div>
    </div>`;
  }).join('');

  return `
    <div class="proj-legend">
      <div class="proj-leg-item"><div class="proj-leg-bar proj-leg-foundation"></div>Foundation — single domain</div>
      <div class="proj-leg-item"><div class="proj-leg-bar proj-leg-bridge"></div>Bridge — connects two domains</div>
      <div class="proj-leg-item"><div class="proj-leg-bar proj-leg-capstone"></div>Capstone — integrates the stack</div>
    </div>
    <div class="proj-filters">
      <div class="proj-filter-row">
        <button class="pfb pfb-on" data-pf="all">All ${projects.length}</button>
        <button class="pfb" data-pf="foundation">Foundation ${projects.filter(p=>p.type==='foundation').length}</button>
        <button class="pfb" data-pf="bridge">Bridge ${projects.filter(p=>p.type==='bridge').length}</button>
        <button class="pfb" data-pf="capstone">Capstone ${projects.filter(p=>p.type==='capstone').length}</button>
      </div>
      <div class="proj-filter-row">
        <button class="pfb" data-pf="d1">D1 Math</button>
        <button class="pfb" data-pf="d2">D2 Estimation</button>
        <button class="pfb" data-pf="d3">D3 Perception</button>
        <button class="pfb" data-pf="d4">D4 Real-time</button>
        <button class="pfb" data-pf="d5">D5 Control</button>
        <button class="pfb" data-pf="d6">D6 Planning</button>
        <button class="pfb" data-pf="d7">D7 Mission</button>
      </div>
    </div>
    <div class="proj-count" id="proj-count">Showing ${projects.length} of ${projects.length} projects</div>
    <div class="proj-grid">${cards}</div>
  `;
}

const projectsHTML = buildProjectsHTML();

/* ─────────────────────────────────────────────
   STYLES
   ───────────────────────────────────────────── */

const styles = `
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.min.css');
  @import url('https://api.fontshare.com/v2/css?f[]=sentient@400,500,600,700&display=swap');

  /* ── Base ── */
  .au-page {
    --bg: #FFF8F0;
    --bg-surface: #FFFFFF;
    --bg-surface-hover: #FFF4E8;
    --bg-sidebar: #FDF6EE;
    --text-primary: #1A1A1A;
    --text-secondary: #5C5650;
    --text-tertiary: #9C8E82;
    --text-muted: #B8ADA4;
    --border: #E8DDD1;
    --border-light: #F0E6DA;
    --accent-green: #2D7A4F;
    --accent-green-bg: #EDF7F1;
    --accent-amber: #A06B1B;
    --accent-amber-bg: #FDF5E8;
    --accent-blue: #2A5FA5;
    --accent-blue-bg: #EDF3FC;
    --accent-purple: #6B4FA0;
    --accent-purple-bg: #F3F0F9;
    --accent-muted-bg: #F5F0EA;
    --serif: 'Sentient', 'Georgia', serif;
    --sans: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'Geist Mono', 'SF Mono', monospace;
    --radius: 6px;
  }

  .au-page.dark {
    --bg: #141210;
    --bg-surface: #1C1A17;
    --bg-surface-hover: #242220;
    --bg-sidebar: #191715;
    --text-primary: #E8E0D6;
    --text-secondary: #A69E94;
    --text-tertiary: #706860;
    --text-muted: #524C46;
    --border: #2E2A26;
    --border-light: #262320;
    --accent-green: #5CB87E;
    --accent-green-bg: #1A2B20;
    --accent-amber: #D4983B;
    --accent-amber-bg: #2A2118;
    --accent-blue: #6BA3E0;
    --accent-blue-bg: #1A2230;
    --accent-purple: #A08BD4;
    --accent-purple-bg: #221E30;
    --accent-muted-bg: #222018;
    --serif: 'Sentient', 'Georgia', serif;
    --sans: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'Geist Mono', 'SF Mono', monospace;
  }

  .au-page {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .au-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .au-page em { font-family: var(--serif); font-style: italic; }
  .au-page strong { font-weight: 500; color: var(--text-primary); }

  /* ── Layout ── */
  .au-layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .au-sidebar {
    width: 260px; flex-shrink: 0; position: sticky; top: 0; height: 100vh;
    background: var(--bg-sidebar); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow-y: auto;
    padding: 32px 0;
  }
  .au-sidebar-title {
    font-family: var(--serif); font-size: 18px; font-weight: 600;
    color: var(--text-primary); padding: 0 24px; margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  .au-sidebar-sub {
    font-size: 12px; color: var(--text-tertiary); padding: 0 24px;
    margin-bottom: 28px; line-height: 1.4;
  }
  .au-sidebar-section {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-muted); padding: 0 24px;
    margin-bottom: 8px; margin-top: 20px;
  }
  .au-sidebar-section:first-of-type { margin-top: 0; }

  .au-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 24px; cursor: pointer; transition: all 0.1s;
    border-left: 2px solid transparent; font-size: 13px; color: var(--text-secondary);
    text-decoration: none;
  }
  .au-nav-item:hover { background: var(--bg-surface-hover); color: var(--text-primary); }
  .au-nav-item.active { background: var(--bg-surface-hover); color: var(--text-primary); border-left-color: var(--text-primary); }
  .au-nav-num { font-family: var(--mono); font-size: 10px; color: var(--text-muted); width: 16px; }
  .au-nav-name { flex: 1; }
  .au-nav-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .au-nav-dot.dot-strong { background: var(--accent-green); }
  .au-nav-dot.dot-partial { background: var(--accent-amber); }
  .au-nav-dot.dot-next { background: var(--accent-blue); }
  .au-nav-dot.dot-starting { background: var(--accent-amber); opacity: 0.6; }
  .au-nav-dot.dot-none { background: var(--text-muted); }

  .au-sidebar-bottom {
    margin-top: auto; padding: 20px 24px; border-top: 1px solid var(--border);
  }
  .au-theme-toggle {
    font-family: var(--sans); font-size: 12px; color: var(--text-tertiary);
    background: none; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 6px 12px; cursor: pointer; width: 100%; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .au-theme-toggle:hover { color: var(--text-primary); border-color: var(--text-tertiary); }
  .au-home-link {
    display: block; font-size: 12px; color: var(--text-muted); text-decoration: none;
    margin-top: 10px; text-align: center; transition: color 0.15s;
  }
  .au-home-link:hover { color: var(--text-secondary); }

  /* ── Tab bar ── */
  .au-tabs {
    display: flex; gap: 0; border-bottom: 1px solid var(--border);
    padding: 0 48px; background: var(--bg-surface);
    position: sticky; top: 0; z-index: 10;
  }
  .au-tab {
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    color: var(--text-tertiary); padding: 14px 20px 12px;
    cursor: pointer; border: none; background: none;
    border-bottom: 2px solid transparent; transition: all 0.15s;
    letter-spacing: 0.01em;
  }
  .au-tab:hover { color: var(--text-secondary); }
  .au-tab.active { color: var(--text-primary); border-bottom-color: var(--text-primary); }

  /* ── Main content ── */
  .au-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .au-content { padding: 32px 48px 64px; max-width: 1080px; }

  /* ── Pipeline ── */
  .pipeline { margin-bottom: 20px; }
  .mission-bar {
    border: 1px dashed var(--border); border-radius: var(--radius);
    padding: 10px 16px; text-align: center; font-size: 12px;
    color: var(--text-tertiary); margin-bottom: 8px;
    font-family: var(--serif); font-style: italic;
  }
  .pipe-row { display: flex; align-items: stretch; gap: 4px; }
  .ps {
    flex: 1; padding: 12px 14px; border-radius: var(--radius);
    border: 1px solid var(--border); min-width: 0; background: var(--bg-surface);
  }
  .pn { font-size: 13px; font-weight: 500; font-family: var(--serif); }
  .pp { font-size: 11px; margin-top: 4px; line-height: 1.4; font-family: var(--mono); color: var(--text-tertiary); }
  .pa { display: flex; align-items: center; font-size: 12px; color: var(--text-muted); padding: 0 3px; flex-shrink: 0; }
  .ps-strong { background: var(--accent-green-bg); border-color: var(--accent-green); }
  .ps-strong .pn { color: var(--accent-green); }
  .ps-partial { background: var(--accent-amber-bg); border-color: var(--accent-amber); }
  .ps-partial .pn { color: var(--accent-amber); }
  .ps-none .pn { color: var(--text-tertiary); }
  .rt-bar {
    border: 1px solid var(--accent-amber); border-radius: var(--radius);
    padding: 10px 16px; text-align: center; font-size: 12px;
    margin-top: 8px; background: var(--accent-amber-bg); color: var(--accent-amber);
    font-family: var(--serif); font-style: italic;
  }

  /* ── Legend ── */
  .leg, .tier-legend { display: flex; gap: 16px; flex-wrap: wrap; margin: 14px 0 20px; }
  .li, .tl { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-tertiary); }
  .ld, .tldot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .ld-strong, .tldot-gold { background: var(--accent-green); }
  .ld-partial { background: var(--accent-amber); }
  .ld-next { background: var(--accent-blue); }
  .ld-none { background: var(--text-muted); }
  .tldot-gold { background: var(--accent-amber); }
  .tldot-hands { background: var(--accent-green); }
  .tldot-101 { background: var(--accent-purple); }

  /* ── Domain cards ── */
  .dom {
    border: 1px solid var(--border); border-radius: var(--radius);
    margin-bottom: 8px; overflow: hidden; background: var(--bg-surface);
    transition: box-shadow 0.15s;
  }
  .dom:hover { box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .d-strong { border-left: 3px solid var(--accent-green); }
  .d-partial { border-left: 3px solid var(--accent-amber); }
  .d-starting { border-left: 3px solid var(--accent-amber); opacity: 0.85; }
  .d-starting:hover { opacity: 1; }
  .d-next { border-left: 3px solid var(--accent-blue); }
  .d-none { border-left: 3px solid var(--border); }

  .dh {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 16px; cursor: pointer; user-select: none;
    transition: background 0.1s;
  }
  .dh:hover { background: var(--bg-surface-hover); }
  .dn {
    font-family: var(--mono); font-size: 11px; color: var(--text-muted);
    width: 20px; flex-shrink: 0;
  }
  .dname { font-family: var(--serif); font-size: 15px; font-weight: 500; color: var(--text-primary); }
  .dtag { font-size: 12px; color: var(--text-muted); flex: 1; margin-left: 6px; font-style: italic; font-family: var(--serif); }
  .dbadge {
    font-size: 11px; font-weight: 500; padding: 3px 11px;
    border-radius: 999px; flex-shrink: 0; font-family: var(--sans);
  }
  .d-strong .dbadge { background: var(--accent-green-bg); color: var(--accent-green); }
  .d-partial .dbadge { background: var(--accent-amber-bg); color: var(--accent-amber); }
  .d-starting .dbadge { background: var(--accent-amber-bg); color: var(--accent-amber); }
  .d-next .dbadge { background: var(--accent-blue-bg); color: var(--accent-blue); }
  .d-none .dbadge { background: var(--accent-muted-bg); color: var(--text-tertiary); }

  .chev { font-size: 10px; color: var(--text-muted); transition: transform 0.2s; flex-shrink: 0; }
  .db {
    display: none; padding: 16px 20px 20px;
    border-top: 1px solid var(--border-light);
  }
  .db.open { display: block; }

  /* ── Inner content ── */
  .sl {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.07em; color: var(--text-muted); margin: 16px 0 6px;
    font-family: var(--sans);
  }
  .sl:first-child { margin-top: 0; }
  .st {
    font-size: 14px; color: var(--text-secondary); line-height: 1.7;
    font-family: var(--serif);
  }
  .llist {
    font-size: 14px; color: var(--text-secondary); padding-left: 20px;
    line-height: 1.8; font-family: var(--serif);
  }
  .llist li { margin-bottom: 2px; }
  .llist code {
    font-family: var(--mono); font-size: 12px;
    background: var(--accent-muted-bg); padding: 1px 6px;
    border-radius: 3px; color: var(--text-primary);
  }

  .proj {
    background: var(--bg); border: 1px solid var(--border-light);
    border-radius: var(--radius); padding: 12px 14px; margin: 8px 0;
    font-size: 14px; color: var(--text-secondary); line-height: 1.6;
    font-family: var(--serif);
  }
  .pname {
    font-weight: 500; color: var(--text-primary); display: block;
    margin-bottom: 4px; font-family: var(--serif);
  }
  .stag {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 999px; display: inline-block;
    margin-right: 5px; vertical-align: middle;
  }
  .stag-rust { background: var(--accent-muted-bg); color: var(--text-tertiary); }
  .stag-bridge { background: var(--accent-green-bg); color: var(--accent-green); }
  .stag-cv { background: var(--accent-purple-bg); color: var(--accent-purple); }
  .stag-agents { background: var(--accent-purple-bg); color: var(--accent-purple); }

  .bridge {
    font-size: 14px; color: var(--text-secondary); line-height: 1.65;
    border-left: 2px solid var(--accent-green); padding-left: 12px;
    margin: 8px 0; font-family: var(--serif);
  }

  /* ── Capstone ── */
  .capstone {
    border: 1px solid var(--accent-green); border-radius: var(--radius);
    padding: 20px 22px; margin-top: 24px; background: var(--accent-green-bg);
  }
  .cap-label {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--accent-green); margin-bottom: 4px;
    font-family: var(--sans);
  }
  .cap-t {
    font-family: var(--serif); font-size: 17px; font-weight: 600;
    color: var(--text-primary); margin-bottom: 10px;
  }
  .seq { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; align-items: center; }
  .sq {
    font-family: var(--sans); font-size: 11px; padding: 5px 12px;
    border-radius: 999px; border: 1px solid var(--border);
    color: var(--text-tertiary); background: var(--bg-surface);
    display: flex; align-items: center; gap: 6px;
  }
  .sq-dur { font-family: var(--mono); font-size: 10px; color: var(--text-muted); }
  .sq-now { background: var(--accent-blue-bg); border-color: var(--accent-blue); color: var(--accent-blue); }
  .sq-now .sq-dur { color: var(--accent-blue); opacity: 0.7; }
  .sq-arr { font-size: 11px; color: var(--text-muted); }

  /* ── Reading list tiers ── */
  .tgrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  @media (max-width: 900px) { .tgrid { grid-template-columns: 1fr; } }
  .tier {
    border-radius: var(--radius); padding: 14px 14px 12px; border: 1px solid;
  }
  .tier-g { border-color: var(--accent-amber); background: var(--accent-amber-bg); }
  .tier-h { border-color: var(--accent-green); background: var(--accent-green-bg); }
  .tier-i { border-color: var(--accent-purple); background: var(--accent-purple-bg); }

  .tier-label {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;
  }
  .tier-g .tier-label { color: var(--accent-amber); }
  .tier-h .tier-label { color: var(--accent-green); }
  .tier-i .tier-label { color: var(--accent-purple); }

  .book {
    margin-bottom: 12px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);
  }
  .book:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .btitle {
    font-family: var(--serif); font-size: 13px; font-weight: 500;
    line-height: 1.35; display: block; color: var(--text-primary);
  }
  .bauth {
    font-family: var(--sans); font-size: 11px; display: block;
    margin-top: 2px; color: var(--text-tertiary);
  }
  .bfree {
    font-family: var(--sans); font-size: 9px; font-weight: 600;
    padding: 1px 6px; border-radius: 999px; display: inline-block;
    margin-left: 5px; vertical-align: middle; text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .tier-g .bfree { background: var(--accent-amber); color: var(--bg); }
  .tier-h .bfree { background: var(--accent-green); color: var(--bg); }
  .tier-i .bfree { background: var(--accent-purple); color: var(--bg); }
  .bdesc {
    font-family: var(--serif); font-size: 12.5px; margin-top: 5px;
    line-height: 1.55; color: var(--text-secondary);
  }

  /* ── Projects ── */
  .proj-legend { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  .proj-leg-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-tertiary); }
  .proj-leg-bar { width: 3px; height: 14px; border-radius: 2px; flex-shrink: 0; }
  .proj-leg-foundation { background: var(--border); }
  .proj-leg-bridge { background: var(--accent-purple); }
  .proj-leg-capstone { background: var(--accent-green); }

  .proj-filters { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
  .proj-filter-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .pfb {
    font-family: var(--sans); font-size: 11px; font-weight: 500;
    padding: 4px 12px; border-radius: 999px;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-tertiary); cursor: pointer; transition: all 0.15s;
  }
  .pfb:hover { background: var(--bg-surface-hover); color: var(--text-secondary); }
  .pfb-on { background: var(--text-primary); color: var(--bg); border-color: var(--text-primary); }
  .pfb-on:hover { background: var(--text-primary); color: var(--bg); }

  .proj-count { font-size: 12px; color: var(--text-muted); margin: 10px 0 14px; }

  .proj-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  }
  @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .proj-grid { grid-template-columns: 1fr; } }

  .pcard {
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;
    background: var(--bg-surface); transition: box-shadow 0.15s;
  }
  .pcard:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .pcard-foundation { border-left: 3px solid var(--border); }
  .pcard-bridge { border-left: 3px solid var(--accent-purple); }
  .pcard-capstone { border-left: 3px solid var(--accent-green); }
  .pcard.pcard-hidden { display: none !important; }

  .pcard-head { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
  .pdom {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    padding: 2px 7px; border-radius: 999px; border: 1px solid;
  }
  .pdom-d1 { background: var(--accent-muted-bg); color: var(--text-tertiary); border-color: var(--border); }
  .pdom-d2 { background: var(--accent-blue-bg); color: var(--accent-blue); border-color: var(--accent-blue); }
  .pdom-d3 { background: var(--accent-green-bg); color: var(--accent-green); border-color: var(--accent-green); }
  .pdom-d4 { background: var(--accent-amber-bg); color: var(--accent-amber); border-color: var(--accent-amber); }
  .pdom-d5 { background: #FDF0EC; color: #A0522D; border-color: #D2855C; }
  .au-page.dark .pdom-d5 { background: #2A1C18; color: #D2855C; border-color: #A0522D; }
  .pdom-d6 { background: var(--accent-purple-bg); color: var(--accent-purple); border-color: var(--accent-purple); }
  .pdom-d7 { background: #FBE8EE; color: #993556; border-color: #E08FAB; }
  .au-page.dark .pdom-d7 { background: #2A1820; color: #E08FAB; border-color: #993556; }

  .ptype {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 999px; margin-left: auto; flex-shrink: 0;
  }
  .ptype-bridge { background: var(--accent-purple-bg); color: var(--accent-purple); }
  .ptype-capstone { background: var(--accent-green-bg); color: var(--accent-green); }

  .pcard-title { font-family: var(--serif); font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.35; }
  .pcard-desc { font-family: var(--serif); font-size: 13px; color: var(--text-secondary); line-height: 1.55; flex: 1; }

  .pcard-concepts { display: flex; flex-wrap: wrap; gap: 4px; }
  .pconcept {
    font-family: var(--mono); font-size: 10px; padding: 2px 7px;
    border-radius: 999px; border: 1px solid var(--border);
    color: var(--text-muted);
  }

  .pcard-meta { display: flex; align-items: center; gap: 10px; }
  .pcard-lang { font-family: var(--sans); font-size: 11px; font-weight: 500; color: var(--text-tertiary); }
  .pcard-dots { display: flex; gap: 3px; align-items: center; }
  .pdot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--border); transition: background 0.15s;
  }
  .pdot-filled { background: var(--accent-amber); }
  .pcard-time { font-family: var(--mono); font-size: 11px; color: var(--text-muted); margin-left: auto; }

  .pcard-anduril {
    font-family: var(--serif); font-size: 12px; font-style: italic;
    color: var(--text-muted); border-top: 1px solid var(--border-light);
    padding-top: 8px; margin-top: 2px;
  }

  /* ── KF Parallels ── */
  .par-intro { margin-bottom: 20px; }
  .par-intro-text {
    font-family: var(--serif); font-size: 14px; color: var(--text-secondary);
    line-height: 1.7; border-left: 3px solid var(--accent-green);
    padding-left: 14px;
  }

  .par-theme {
    border: 1px solid var(--border); border-radius: var(--radius);
    margin-bottom: 8px; overflow: hidden; background: var(--bg-surface);
    transition: box-shadow 0.15s;
  }
  .par-theme:hover { box-shadow: 0 1px 4px rgba(0,0,0,0.04); }

  .par-anchor {
    font-family: var(--serif); font-size: 14px; color: var(--text-secondary);
    line-height: 1.7; margin-bottom: 14px;
    border-left: 3px solid var(--accent-green); padding-left: 12px;
    border-radius: 0;
  }
  .par-anchor b { color: var(--text-primary); font-weight: 500; }

  .par-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px; margin-bottom: 12px;
  }

  .par-box {
    border-radius: var(--radius); padding: 12px; border: 1px solid;
  }
  .par-box-label {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;
  }
  .par-row {
    font-family: var(--serif); font-size: 12px; line-height: 1.65; margin-bottom: 2px;
  }
  .par-row b { font-weight: 500; }

  .par-box-red { background: #FDF0EC; border-color: #F0997B; }
  .par-box-red .par-box-label { color: #993C1D; }
  .par-box-red .par-row { color: #712B13; }
  .au-page.dark .par-box-red { background: #2A1810; border-color: #993C1D; }
  .au-page.dark .par-box-red .par-box-label { color: #F0997B; }
  .au-page.dark .par-box-red .par-row { color: #F5C4B3; }

  .par-box-amber { background: var(--accent-amber-bg); border-color: var(--accent-amber); }
  .par-box-amber .par-box-label { color: var(--accent-amber); }
  .par-box-amber .par-row { color: #78500A; }
  .au-page.dark .par-box-amber .par-row { color: #D4983B; }

  .par-box-blue { background: var(--accent-blue-bg); border-color: var(--accent-blue); }
  .par-box-blue .par-box-label { color: var(--accent-blue); }
  .par-box-blue .par-row { color: #1A4A80; }
  .au-page.dark .par-box-blue .par-row { color: #6BA3E0; }

  .par-box-purple { background: var(--accent-purple-bg); border-color: var(--accent-purple); }
  .par-box-purple .par-box-label { color: var(--accent-purple); }
  .par-box-purple .par-row { color: #4A3580; }
  .au-page.dark .par-box-purple .par-row { color: #A08BD4; }

  .par-box-rose { background: #FBE8EE; border-color: #E08FAB; }
  .par-box-rose .par-box-label { color: #993556; }
  .par-box-rose .par-row { color: #72243E; }
  .au-page.dark .par-box-rose { background: #2A1820; border-color: #993556; }
  .au-page.dark .par-box-rose .par-box-label { color: #E08FAB; }
  .au-page.dark .par-box-rose .par-row { color: #ED93B1; }

  .par-box-green { background: #EAF5DE; border-color: #7AB840; }
  .par-box-green .par-box-label { color: #2D6B10; }
  .par-box-green .par-row { color: #1D4A08; }
  .au-page.dark .par-box-green { background: #1A2810; border-color: #3B6D11; }
  .au-page.dark .par-box-green .par-box-label { color: #97C459; }
  .au-page.dark .par-box-green .par-row { color: #C0DD97; }

  .par-insight {
    font-family: var(--serif); font-size: 13px; color: var(--text-secondary);
    line-height: 1.6; background: var(--bg); border-radius: var(--radius);
    padding: 10px 12px; font-style: italic; margin-bottom: 10px;
  }
  .par-insight b { font-style: normal; font-weight: 500; color: var(--text-primary); }

  .par-sw {
    border-radius: var(--radius); padding: 12px 14px;
    border-left: 3px solid var(--accent-blue); background: var(--accent-blue-bg);
  }
  .par-sw-label {
    font-family: var(--sans); font-size: 10px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--accent-blue); margin-bottom: 8px;
  }
  .par-sw-row {
    font-family: var(--serif); font-size: 12.5px; line-height: 1.65;
    color: var(--text-secondary); margin-bottom: 4px;
  }
  .par-sw-row b { font-weight: 500; color: var(--text-primary); }
  .par-sw-row code {
    font-family: var(--mono); font-size: 11px;
    background: var(--bg-surface); padding: 1px 5px;
    border-radius: 3px; color: var(--text-primary);
  }

  /* ── North Star ── */
  .ns { max-width: 640px; }
  .ns-header {
    margin-bottom: 2.5rem; padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }
  .ns-title {
    font-family: var(--serif); font-size: 28px; font-weight: 600;
    line-height: 1.25; color: var(--text-primary); margin-bottom: 6px;
    letter-spacing: -0.02em;
  }
  .ns-sub {
    font-family: var(--serif); font-size: 15px; font-style: italic;
    color: var(--text-secondary); margin-bottom: 4px;
  }
  .ns-date {
    font-family: var(--sans); font-size: 12px; color: var(--text-muted);
  }
  .ns-h2 {
    font-family: var(--serif); font-size: 18px; font-weight: 600;
    color: var(--text-primary); margin: 2.5rem 0 0.75rem;
    letter-spacing: -0.01em;
  }
  .ns-h2:first-of-type { margin-top: 0; }
  .ns-p {
    font-family: var(--serif); font-size: 15px; line-height: 1.85;
    color: var(--text-secondary); margin-bottom: 1rem;
  }
  .ns-p:last-child { margin-bottom: 0; }
  .ns-p em { font-family: var(--serif); }
  .ns-p code {
    font-family: var(--mono); font-size: 13px;
    background: var(--accent-muted-bg); padding: 1px 5px; border-radius: 3px;
  }
  .ns-em { color: var(--accent-green); font-weight: 500; }
  .ns-pull {
    border-left: 3px solid var(--accent-green); padding: 0.75rem 1.25rem;
    margin: 1.75rem 0; border-radius: 0;
    font-family: var(--serif); font-size: 16px; font-style: italic;
    line-height: 1.7; color: var(--text-primary);
  }
  .ns-pull-blue { border-left-color: var(--accent-blue); }
  .ns-hr {
    border: none; border-top: 1px solid var(--border-light); margin: 2rem 0;
  }

  .ns-sw-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px; margin: 1.25rem 0;
  }
  .ns-sw-card {
    background: var(--accent-blue-bg); border-radius: var(--radius);
    padding: 12px 14px; border-left: 3px solid var(--accent-blue);
  }
  .ns-sw-title {
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    color: var(--text-primary); margin-bottom: 5px;
  }
  .ns-sw-body {
    font-family: var(--serif); font-size: 13px; line-height: 1.6;
    color: var(--text-secondary);
  }
  .ns-sw-body code {
    font-family: var(--mono); font-size: 11px;
    background: var(--bg-surface); padding: 1px 4px; border-radius: 3px;
  }
  .ns-sw-proj {
    font-family: var(--mono); font-size: 11px; color: var(--accent-blue);
    margin-top: 6px;
  }

  .ns-closing {
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 1.25rem 1.5rem; margin-top: 2.5rem;
  }
  .ns-closing .ns-h2 { margin-top: 0; margin-bottom: 0.75rem; }
  .ns-final {
    font-weight: 500; color: var(--text-primary) !important;
    font-size: 16px !important;
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .au-sidebar { display: none; }
    .au-content { padding: 24px 20px 48px; }
    .au-tabs { padding: 0 20px; }
    .pipe-row { flex-direction: column; }
    .pa { transform: rotate(90deg); padding: 4px 0; }
    .par-grid { grid-template-columns: 1fr; }
    .ns-sw-grid { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */

export default function AutonomyPage() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'landscape' | 'reading' | 'projects' | 'parallels' | 'northstar'>('landscape');
  const [activeDomain, setActiveDomain] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Wire up accordion toggles via event delegation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    let currentFilter = 'all';

    const handler = (e: MouseEvent) => {
      // Accordion toggles
      const togTarget = (e.target as HTMLElement).closest('[data-tog]');
      if (togTarget) {
        const id = togTarget.getAttribute('data-tog');
        if (!id) return;
        const prefix = id.charAt(0);
        const num = id.slice(1);
        const body = document.getElementById(prefix + 'b' + num);
        const chev = togTarget.querySelector('.chev') as HTMLElement;
        if (body) {
          body.classList.toggle('open');
          if (chev) {
            chev.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : '';
          }
        }
        return;
      }

      // Project filter buttons
      const filterBtn = (e.target as HTMLElement).closest('[data-pf]');
      if (filterBtn) {
        const f = filterBtn.getAttribute('data-pf')!;
        currentFilter = (currentFilter === f && f !== 'all') ? 'all' : f;
        el.querySelectorAll('.pfb').forEach(b => b.classList.remove('pfb-on'));
        el.querySelector(`[data-pf="${currentFilter}"]`)?.classList.add('pfb-on');
        let n = 0;
        el.querySelectorAll('.pcard').forEach(c => {
          const card = c as HTMLElement;
          const ok = currentFilter === 'all'
            || card.dataset.type === currentFilter
            || (card.dataset.domains && card.dataset.domains.split(',').includes(currentFilter));
          card.classList.toggle('pcard-hidden', !ok);
          if (ok) n++;
        });
        const countEl = document.getElementById('proj-count');
        if (countEl) countEl.textContent = `Showing ${n} of ${projects.length} projects`;
      }
    };

    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [activeTab]);

  // Scroll to domain when clicking sidebar
  const scrollToDomain = (id: number) => {
    setActiveDomain(id);
    const el = contentRef.current?.querySelector(`[data-domain="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Open the accordion
      const body = el.querySelector('.db');
      const chev = el.querySelector('.chev') as HTMLElement;
      if (body && !body.classList.contains('open')) {
        body.classList.add('open');
        if (chev) chev.style.transform = 'rotate(180deg)';
      }
    }
  };

  const dotClass = (level: string) => {
    const map: Record<string, string> = {
      strong: 'dot-strong', partial: 'dot-partial', next: 'dot-next',
      starting: 'dot-starting', none: 'dot-none',
    };
    return map[level] || 'dot-none';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className={`au-page ${dark ? 'dark' : ''}`}>
        <div className="au-layout">

          {/* ── Sidebar ── */}
          <nav className="au-sidebar">
            <div className="au-sidebar-title">Autonomy Stack</div>
            <div className="au-sidebar-sub">Learning landscape &amp; reading list</div>

            <div className="au-sidebar-section">Domains</div>
            {domains.map((d) => (
              <a
                key={d.id}
                className={`au-nav-item ${activeDomain === d.id ? 'active' : ''}`}
                onClick={() => scrollToDomain(d.id)}
              >
                <span className="au-nav-num">{String(d.id).padStart(2, '0')}</span>
                <span className="au-nav-name">{d.name}</span>
                <span className={`au-nav-dot ${dotClass(d.level)}`} />
              </a>
            ))}

            <div className="au-sidebar-section">View</div>
            <a
              className={`au-nav-item ${activeTab === 'landscape' ? 'active' : ''}`}
              onClick={() => setActiveTab('landscape')}
            >
              <span className="au-nav-name">Stack Landscape</span>
            </a>
            <a
              className={`au-nav-item ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveTab('reading')}
            >
              <span className="au-nav-name">Reading List</span>
            </a>
            <a
              className={`au-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span className="au-nav-name">Projects</span>
            </a>
            <a
              className={`au-nav-item ${activeTab === 'parallels' ? 'active' : ''}`}
              onClick={() => setActiveTab('parallels')}
            >
              <span className="au-nav-name">KF Parallels</span>
            </a>
            <a
              className={`au-nav-item ${activeTab === 'northstar' ? 'active' : ''}`}
              onClick={() => setActiveTab('northstar')}
            >
              <span className="au-nav-name">North Star</span>
            </a>

            <div className="au-sidebar-bottom">
              <button className="au-theme-toggle" onClick={() => setDark(!dark)}>
                {dark ? '☀' : '☾'}&nbsp;&nbsp;{dark ? 'Light mode' : 'Dark mode'}
              </button>
              <Link href="/" className="au-home-link">← Back to home</Link>
            </div>
          </nav>

          {/* ── Main ── */}
          <div className="au-main">
            <div className="au-tabs">
              <button
                className={`au-tab ${activeTab === 'landscape' ? 'active' : ''}`}
                onClick={() => setActiveTab('landscape')}
              >
                Stack Landscape
              </button>
              <button
                className={`au-tab ${activeTab === 'reading' ? 'active' : ''}`}
                onClick={() => setActiveTab('reading')}
              >
                Reading List
              </button>
              <button
                className={`au-tab ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button
                className={`au-tab ${activeTab === 'parallels' ? 'active' : ''}`}
                onClick={() => setActiveTab('parallels')}
              >
                KF Parallels
              </button>
              <button
                className={`au-tab ${activeTab === 'northstar' ? 'active' : ''}`}
                onClick={() => setActiveTab('northstar')}
              >
                North Star
              </button>
            </div>

            <div className="au-content" ref={contentRef}>
              {activeTab === 'landscape' && (
                <div dangerouslySetInnerHTML={{ __html: landscapeHTML }} />
              )}
              {activeTab === 'reading' && (
                <div dangerouslySetInnerHTML={{ __html: readingListHTML }} />
              )}
              {activeTab === 'projects' && (
                <div dangerouslySetInnerHTML={{ __html: projectsHTML }} />
              )}
              {activeTab === 'parallels' && (
                <div dangerouslySetInnerHTML={{ __html: parallelsHTML }} />
              )}
              {activeTab === 'northstar' && (
                <div dangerouslySetInnerHTML={{ __html: northStarHTML }} />
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
