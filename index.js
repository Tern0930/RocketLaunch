const passwordField = document.getElementById("password");
const passwordConfirmButton = document.getElementById("password-confirm");
const levers = document.querySelector(".levers");
const checkButtons = document.querySelector(".check-buttons");
const launchButton = document.getElementById("launch");
const restartButton = document.getElementById("restart");
const leversValues = new Map();
const checkboxValues = new Map();

const rocket = document.querySelector('.rocket');
const rocketContainer = document.querySelector('.rocket-container');
const rocketContainerInner = document.querySelector('.rocket-container_inner');
const rocketPlanetContainer = document.querySelector('.planet-rocket-container');

rocketPlanetContainer.classList.add('planet-rocket-container_rotate');
rocketContainer.classList.add('rocket-container_rotate');

rotateRocket('planet-rocket-container', 25, 0);

disableInput();
restartButton.setAttribute("disabled", "disabled");
const password = 'TrustNo1';

passwordConfirmButton.addEventListener('click', () => {
    if (passwordField.value === password)
        enableInput();
});

launchButton.addEventListener('click', () => {
    console.log('Pipa');
    rocket.classList.add('rocket_rotation');
    rocket.classList.add('rocket_launched');
    rocketContainerInner.classList.add('rocket_launched');
    // rocketContainerInner.classList.add('rocket_launched');
    // rocketContainerInner.classList.add('rocket_rotation');

    launchRocket(leversValues.get(levers.children[2]), leversValues.get(levers.children[3]), leversValues.get(levers.children[4]));
    disableInput();
})
// rocket.classList.add('rocket_launched');
// rocketContainer.classList.add('rocket-container_launched');
function disableInput() {
    for (const lever of levers.children) {
        lever.setAttribute("disabled", "disabled");
    }
    for (const checkbox of checkButtons.children) {
        checkbox.firstElementChild.setAttribute("disabled", "disabled");
    }
    launchButton.setAttribute("disabled", "disabled");
}

function enableInput() {
    for (const lever of levers.children) {
        lever.removeAttribute("disabled");
        leversValues.set(lever, lever.value);
    }
    for (const checkbox of checkButtons.children) {
        checkbox.firstElementChild.removeAttribute("disabled");
        checkboxValues.set(checkbox, checkbox.firstElementChild.checked);
    }
    passwordField.setAttribute("disabled", "disabled");
    passwordConfirmButton.setAttribute("disabled", "disabled");
}

function flightAccess() {
    for (const lever of levers.children) {
        leversValues.set(lever, lever.value);
    }
    for (const checkbox of checkButtons.children) {
        checkboxValues.set(checkbox, checkbox.firstElementChild.checked)
    }
    let accessState = true;
    for (const checkboxState of checkboxValues) {
        accessState &= checkboxState[1];
    }
    rotateRocket('planet-rocket-container', leversValues.get(levers.children[0]), 0);
    rotateRocket('rocket-container', leversValues.get(levers.children[1]), 1);
    if (accessState)
        launchButton.removeAttribute("disabled");
    else
        launchButton.setAttribute("disabled", "disabled");
    console.log(checkboxValues);
}

function rotateRocket(className, angle, index) {
    if (document.styleSheets[2].rules.length > index)
        document.styleSheets[2].removeRule(index);
    document.styleSheets[2].addRule(`.${className}_rotate`, `transition: 0.5s linear; 
    transform: rotate(${angle}deg) ${className === 'rocket-container' ? 'scale(0.4) translate(0, -30%)' : ''};`, index);
}

function launchRocket(speedL, speedR, speedM, index=2) {
    if (speedL !== speedR) {
        const origPos = speedL > speedR ? (2 + speedR / (speedL - speedR)) * 100 / 3 : (1 - speedL / (speedR - speedL)) * 100 / 3;
        document.styleSheets[2].addRule('.rocket_rotation', `
        transform-origin: ${origPos}% 30%;
        animation-name: rocket-rotation;
        animation-duration: ${100 / Math.abs(speedL - speedR) * 20}s;
        animation-direction: ${speedL > speedR ? 'normal' : 'reverse'};
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        `, index);
    }
    document.styleSheets[2].addRule('.rocket_launched', `
    transition: transform ${100 / (Math.min(speedR, speedL) + speedM * 2) * 20}s cubic-bezier(.74, -0, 1, .63);
    transform: translate(0, -20000px);
    `)
    restartButton.removeAttribute("disabled");
}


function restart() {
    for (const lever of levers.children) {
        lever.value = (Number(lever.getAttribute('max')) + Number(lever.getAttribute('min'))) / 2;
        lever.onchange();
    }
    for (const checkbox of checkButtons.children) {
        checkbox.firstElementChild.checked = false;
    }
    enableInput();
    document.styleSheets[2].removeRule(document.styleSheets[2].rules.length - 1);
    document.styleSheets[2].removeRule(document.styleSheets[2].rules.length - 2);
    restartButton.setAttribute("disabled", "disabled");
}
