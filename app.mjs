import { Ceremony } from './performance.mjs?v=f9f30f18008a';

const $ = id => document.getElementById(id);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => motion.matches || $('reduced-motion').checked;
const keyPath = name => `assets/keys/${name}-144.png`;
const sounds = new Map();
const voices = [];
let soundEnabled = false;
let lastTink = -Infinity;

function stopSounds() {
  for (const voice of voices) { voice.pause(); voice.currentTime = 0; }
  voices.length = 0;
}

function cue(name) {
  if (!soundEnabled) return;
  const now = performance.now();
  if (name === 'tink' && now - lastTink < 40) return;
  if (name === 'tink') lastTink = now;
  for (let i = voices.length - 1; i >= 0; i--) {
    if (voices[i].ended || voices[i].paused) voices.splice(i, 1);
  }
  while (voices.length >= 4) { const old = voices.shift(); old.pause(); old.currentTime = 0; }
  const voice = new Audio(sounds.get(name) || `assets/sounds/${name}.wav`);
  voice.volume = .2;
  voices.push(voice);
  voice.play().catch(() => {
    const index = voices.indexOf(voice);
    if (index >= 0) voices.splice(index, 1);
    $('demo-message').textContent = 'Audio is unavailable in this browser. The keys still work silently.';
  });
}

// Actual rendered snapshots from the Mac plugin, arranged as finite web previews.
const controls = [
  { id:'fix', name:'Fix it', idle:'fix-idle', working:'fix-working-early', steady:'fix-working-reduced-motion', final:'fix-fixed', message:'Fixed. You can invoice for that.', steps:[[0,'working','click'],[300,'fix-working-late'],[600,'final','confirm']] },
  { id:'pop', name:'Make it pop', idle:'pop-idle', working:'pop-working', steady:'pop-reduced', final:'pop-final', message:'Popped. Brief met.', steps:[[0,'working'],[180,'pop-active','pop'],[720,'final']] },
  { id:'talent', name:'Talent', idle:'talent-idle', working:'talent-working', steady:'talent-reduced', final:'talent-final', message:"One unit of talent. You're welcome.", steps:[[0,'working'],[160,'talent-working','feed'],[800,'final','click']] },
  { id:'perfection', name:'Perfection', idle:'perfection-idle', working:'perfection-working', steady:'perfection-reduced', final:'perfection-final', message:'Close enough. The dial never moved.', steps:[[0,'working','click'],[160,'perfection-working','buff'],[700,'perfection-active'],[1200,'final','click']] },
  { id:'approval', name:'Client approval', idle:'approval-idle', working:'approval-working', steady:'approval-reduced', final:'approval-final', message:'Approved. Nothing changed. Everybody wins.', steps:[[0,'working'],[240,'approval-active','thunk'],[650,'final']] },
  { id:'calibrate', name:'Calibrate', idle:'calibrate-idle', working:'calibrate-measuring', steady:'calibrate-reduced-motion', final:'calibrate-calibrated', message:'Calibrated. To no known standard.', steps:[[0,'working','click'],[544,'calibrate-aligning'],[1072,'calibrate-verifying'],[1600,'final','confirm']] }
];

const keys = controls.map(control => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'demo-key';
  button.id = `demo-${control.id}`;
  button.setAttribute('aria-label', `Try ${control.name}`);
  button.title = control.name;
  const image = document.createElement('img');
  image.src = keyPath(control.idle);
  image.width = 144; image.height = 144;
  image.alt = control.name;
  button.append(image);
  $('demo-keys').append(button);
  const ceremony = new Ceremony();
  const state = { control, button, image, ceremony, working:false, current:control.idle };
  const paint = frame => { state.current = frame; image.src = keyPath(frame); };
  const reset = () => { ceremony.cancel(); state.working = false; paint(control.idle); button.removeAttribute('aria-busy'); };
  button.addEventListener('click', () => {
    state.working = true;
    button.setAttribute('aria-busy','true');
    $('demo-message').textContent = `${control.name}. Taking this very seriously.`;
    ceremony.start(control.steps.map(([ms, frame, sound]) => [ms, () => {
      if (frame === 'final') {
        state.working = false;
        paint(control.final);
        button.removeAttribute('aria-busy');
        $('demo-message').textContent = control.message;
      } else {
        paint(reduced() ? control.steady : frame === 'working' ? control.working : frame);
      }
      if (sound) cue(sound);
    }]));
  });
  // Preload only this small set of native artwork, keeping the first press immediate.
  const frames = new Set([control.idle, control.working, control.steady, control.final, ...control.steps.map(([, frame]) => frame).filter(frame => !['working','final'].includes(frame))]);
  for (const frame of frames) { const preload = new Image(); preload.src = keyPath(frame); }
  return { ...state, reset, refreshMotion() { if (state.working && reduced()) paint(control.steady); } };
});

function updateMotion() {
  document.body.classList.toggle('reduced', reduced());
  document.documentElement.style.scrollBehavior = reduced() ? 'auto' : '';
  for (const key of keys) key.refreshMotion();
}
$('reduced-motion').addEventListener('change', updateMotion);
motion.addEventListener('change', updateMotion);
updateMotion();

$('sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  $('sound-toggle').setAttribute('aria-pressed', String(soundEnabled));
  $('sound-toggle').querySelector('span').textContent = `Sound ${soundEnabled ? 'on' : 'off'}`;
  $('sound-toggle').querySelector('path').setAttribute('d', soundEnabled ? 'm11 5-5 4H3v6h3l5 4V5Zm5 3c3 2 3 6 0 8m3-11c5 4 5 10 0 14' : 'm11 5-5 4H3v6h3l5 4V5Zm5 3 5 8m0-8-5 8');
  if (!soundEnabled) stopSounds();
  else { cue('tink'); $('demo-message').textContent = 'Sound on. Quiet little noises. Very important work.'; }
});

function setFader(value, play = true) {
  const previous = Number($('fader').dataset.previous || 50);
  $('fader').value = String(value);
  $('fader').dataset.previous = String(value);
  $('fader-cap').style.setProperty('--fader', value / 100);
  $('fader-value').innerHTML = `${value}<span>%</span>`;
  $('fader-response').textContent = 'Better?';
  if (play && previous !== value) cue('tink');
}
$('fader').addEventListener('input', event => setFader(Number(event.target.value)));
$('reset-demo').addEventListener('click', () => {
  for (const key of keys) key.reset();
  stopSounds();
  setFader(50, false);
  $('demo-message').textContent = 'Evidence reset. Nothing to see here.';
});

function suspend() {
  for (const key of keys) key.reset();
  stopSounds();
}
document.addEventListener('visibilitychange', () => { if (document.hidden) suspend(); });
window.addEventListener('pagehide', suspend);

// Resolve bundled cue paths once. No external services or tracking.
for (const name of ['tink','click','confirm','reset','thunk','pop','feed','buff']) sounds.set(name, `assets/sounds/${name}.wav`);
