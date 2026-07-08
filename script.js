let appInitialized = false;

function initApp() {
    if (appInitialized) return;
    appInitialized = true;

    // UI Elements
    const inSecInput = document.getElementById('in-sec');
    const holdInSecInput = document.getElementById('hold-in-sec');
    const outSecInput = document.getElementById('out-sec');
    const holdOutSecInput = document.getElementById('hold-out-sec');
    
    const setBtn = document.getElementById('set-btn');
    const resetBtn = document.getElementById('reset-btn');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const lapCountEl = document.getElementById('lap-count');
    const phaseTextEl = document.getElementById('phase-text');
    const timeLeftEl = document.getElementById('time-left');
    const innerCircle = document.getElementById('inner-circle');
    
    // Modal
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // State
    let isRunning = false;
    let lapCount = 0;
    let sessionStartTime = 0;
    let animationFrameId = null;

    let inDuration = 4000;
    let holdInDuration = 4000;
    let outDuration = 4000;
    let holdOutDuration = 4000;

    let currentPhase = 'idle'; // 'in', 'hold-in', 'out', 'hold-out'
    let phaseStartTime = 0;

    function setCircleScale(scale) {
        innerCircle.style.transform = `scale(${scale})`;
    }

    function init() {
        setBtn.addEventListener('click', readInputs);
        startBtn.addEventListener('click', startBreathing);
        stopBtn.addEventListener('click', stopBreathing);
        resetBtn.addEventListener('click', resetSettings);
        closeModalBtn.addEventListener('click', () => {
            alertModal.classList.add('hidden');
        });
        
        // Initial setup
        setCircleScale(0.2);
    }

    function readInputs() {
        if (isRunning) return;
        
        // FIXED: Safe parsing to prevent NaN calculations breaking loops
        const valIn = parseFloat(inSecInput.value);
        const valHoldIn = parseFloat(holdInSecInput.value);
        const valOut = parseFloat(outSecInput.value);
        const valHoldOut = parseFloat(holdOutSecInput.value);

        inDuration = (isNaN(valIn) || valIn < 1 ? 4 : valIn) * 1000;
        holdInDuration = (isNaN(valHoldIn) || valHoldIn < 0 ? 0 : valHoldIn) * 1000;
        outDuration = (isNaN(valOut) || valOut < 1 ? 4 : valOut) * 1000;
        holdOutDuration = (isNaN(valHoldOut) || valHoldOut < 0 ? 0 : valHoldOut) * 1000;
        
        // Visual feedback that it's set
        setBtn.textContent = 'Set ✓';
        setTimeout(() => {
            if (!isRunning) setBtn.textContent = 'Set';
        }, 1500);
    }

    function resetSettings() {
        if (isRunning) return;
        inSecInput.value = 4;
        holdInSecInput.value = 4;
        outSecInput.value = 4;
        holdOutSecInput.value = 4;
        
        inDuration = 4000;
        holdInDuration = 4000;
        outDuration = 4000;
        holdOutDuration = 4000;
        
        lapCount = 0;
        lapCountEl.textContent = '0';
        phaseTextEl.textContent = 'Ready';
        timeLeftEl.textContent = '0';
        setCircleScale(0.2);
        innerCircle.style.background = '#0ea5e9';
        setBtn.textContent = 'Set';
    }

    function startBreathing() {
        if (isRunning) return;
        
        // Ensure inputs are read fresh in case they bypassed the Set button
        readInputs();
        
        isRunning = true;
        setBtn.disabled = true;
        inSecInput.disabled = true;
        holdInSecInput.disabled = true;
        outSecInput.disabled = true;
        holdOutSecInput.disabled = true;
        resetBtn.disabled = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;

        lapCount = 0;
        lapCountEl.textContent = lapCount;
        
        sessionStartTime = performance.now();
        startPhase('in');
        
        requestAnimationFrame(updateFrame);
    }

    function stopBreathing() {
        if (!isRunning) return;
        
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        const totalElapsedSec = Math.floor((performance.now() - sessionStartTime) / 1000);
        
        // Show modal summary
        alertMessage.innerHTML = `You completed <strong>\${lapCount}</strong> laps in <strong>\${totalElapsedSec}</strong> seconds.<br><br>Great job focusing on your breath!`;
        alertModal.classList.remove('hidden');

        // Restore form control responsiveness
        setBtn.disabled = false;
        inSecInput.disabled = false;
        holdInSecInput.disabled = false;
        outSecInput.disabled = false;
        holdOutSecInput.disabled = false;
        resetBtn.disabled = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        phaseTextEl.textContent = 'Ready';
        timeLeftEl.textContent = '0';
        setCircleScale(0.2);
        innerCircle.style.background = '#0ea5e9';
        setBtn.textContent = 'Set';
    }

    function startPhase(phase) {
        currentPhase = phase;
        phaseStartTime = performance.now();
        
        if (phase === 'in') {
            phaseTextEl.textContent = 'Breathe In';
            innerCircle.style.background = '#38bdf8'; // Sky blue
        } else if (phase === 'hold-in') {
            phaseTextEl.textContent = 'Hold';
            innerCircle.style.background = '#a78bfa'; // Purple
        } else if (phase === 'out') {
            phaseTextEl.textContent = 'Breathe Out';
            innerCircle.style.background = '#34d399'; // Emerald
        } else if (phase === 'hold-out') {
            phaseTextEl.textContent = 'Hold';
            innerCircle.style.background = '#f43f5e'; // Soft Coral/Red
        }
    }

    function updateFrame(timestamp) {
        if (!isRunning) return;

        let elapsed = timestamp - phaseStartTime;
        let progress = 0;
        let timeLeft = 0;

        if (currentPhase === 'in') {
            progress = Math.min(elapsed / inDuration, 1);
            timeLeft = Math.ceil((inDuration - elapsed) / 1000);
            
            // Expand circle smoothly from 0.2 to 3.0 scale
            const scale = 0.2 + (progress * 2.8);
            setCircleScale(scale);
            
            if (progress >= 1) {
                if (holdInDuration > 0) {
                    startPhase('hold-in');
                } else {
                    startPhase('out');
                }
            }
        } 
        else if (currentPhase === 'hold-in') {
            progress = Math.min(elapsed / holdInDuration, 1);
            timeLeft = Math.ceil((holdInDuration - elapsed) / 1000);
            
            // Retain full structural size during internal hold
            innerCircle.style.transform = 'scale(3.0)';

            if (progress >= 1) {
                startPhase('out');
            }
        } 
        else if (currentPhase === 'out') {
            progress = Math.min(elapsed / outDuration, 1);
            timeLeft = Math.ceil((outDuration - elapsed) / 1000);
            
            // Retract circle smoothly from 3.0 down to 0.2 scale
            const scale = 3.0 - (progress * 2.8);
            setCircleScale(scale);

            if (progress >= 1) {
                if (holdOutDuration > 0) {
                    startPhase('hold-out');
                } else {
                    lapCount++;
                    lapCountEl.textContent = lapCount;
                    startPhase('in');
                }
            }
        } 
        else if (currentPhase === 'hold-out') {
            progress = Math.min(elapsed / holdOutDuration, 1);
            timeLeft = Math.ceil((holdOutDuration - elapsed) / 1000);
            
            // Keep completely deflated during empty-lung hold
            innerCircle.style.transform = 'scale(0.2)';

            if (progress >= 1) {
                lapCount++;
                lapCountEl.textContent = lapCount;
                startPhase('in');
            }
        }

        timeLeftEl.textContent = Math.max(0, timeLeft);

        if (isRunning) {
            animationFrameId = requestAnimationFrame(updateFrame);
        }
    }

    init();
}

document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('load', initApp);
