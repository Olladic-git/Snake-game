const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

const CELL_WIDTH = 15;
const CELL_HEIGHT = 15;
const GRID_WIDTH = Math.floor(canvas.width / CELL_WIDTH);
const GRID_HEIGHT = Math.floor(canvas.height / CELL_HEIGHT);

const SPEED = 1;

//direction

const 
    UP = 'UP'
    DOWN = 'DOWN'
    LEFT = 'LEFT'
    RIGHT = 'RIGHT';


let snake;
let apple;

let gameLoopInterval;
let snakeGrowthPosition;
let changingDirection;

function initialize() {
    snake = {
        direction: RIGHT,
        head: {
            x: 4, y: 4
        },
        body: [
            {x: 4, y: 5},
            {x: 4, y: 6}
        ]
    }
    changingDirection = snake.direction;
    generateApple();
}

function gameLoop() {
    updateSnake();
    if (isGameOver()) {
        showPopUp();
        clearInterval(gameLoopInterval) 
        return;
    }
    updateApple();
    render();
}

function render() {
    clearCanvas();
    drawGrid();
    drawSnake();
    if (apple !== undefined){
        drawApple();
    }
}

function drawSnake() {

    //draw head
    context.fillStyle = 'blue';
    context.fillRect(snake.head.x * CELL_WIDTH, snake.head.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

    //draw body
    for(segment of snake.body) {
        context.fillStyle = 'green';
        context.fillRect(segment.x * CELL_WIDTH, segment.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }
}

function updateSnake() {
    updateDirection();
    moveSnake();
}

function drawGrid() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
          for (let j = 0; j < GRID_WIDTH; j++) {

            if (i % 2 !== 0 && j % 2 !== 0) {
                context.fillStyle = 'rgba(76, 76, 76, 0.4)';
            } else if (i % 2 == 0 && j % 2 == 0) {
                context.fillStyle = 'rgba(76, 76, 76, 0.4)';
            } else {
                context.fillStyle = 'rgba(154, 154, 154, 0.4)';
            }
            context.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }
    }
           
}

function moveSnake() {
    const velocity = calculateVelocity();
    let prevSegmentPosition = {
        x: snake.head.x, y: snake.head.y
    }

    //move head
    snake.head.x += velocity.x;
    snake.head.y += velocity.y;

    //move body 
    for(const segment of snake.body){
        const currentSegmentPosition = {
            x: segment.x, y: segment.y
        };

        segment.x = prevSegmentPosition.x;
        segment.y = prevSegmentPosition.y;

        prevSegmentPosition = currentSegmentPosition;
    }
    snakeGrowthPosition = prevSegmentPosition;
}

function calculateVelocity() {
    switch (snake.direction) {
        case UP:
            return {x: 0, y : -SPEED};
        case RIGHT: 
            return {x: SPEED, y: 0};
        case DOWN:
            return {x: 0, y: SPEED};
        case LEFT: 
            return {x: -SPEED, y: 0};

        default: 
            throw new Error('Unknown direction' + snake.direction);
        
    }
}

function handleKeyDown(event) {
    console.log("key down");
    if (event.key == 'a') {
       changingDirection = LEFT;
    }
    if (event.key == 'd') {
        changingDirection = RIGHT;
    }
    if (event.key == 'w') {
        changingDirection = UP;
    }
    if (event.key == 's') {
        changingDirection = DOWN;
    }

}

function updateDirection() {
    if(changingDirection == UP && (snake.direction == RIGHT || snake.direction == LEFT)) {
        snake.direction = changingDirection;
    }
    if(changingDirection == DOWN && (snake.direction == RIGHT || snake.direction == LEFT)) {
        snake.direction = changingDirection;
    }
    if(changingDirection == LEFT && (snake.direction == UP || snake.direction == DOWN)) {
        snake.direction = changingDirection;
    }
    if(changingDirection == RIGHT && (snake.direction == UP || snake.direction == DOWN)) {
        snake.direction = changingDirection;
    }
    return;
}


const min = {
    x: 0, y: 0
}
const max = {
    x: CELL_WIDTH, y: CELL_HEIGHT
}

function generateAppleCoordinate() {
    return {
        x: Math.floor(Math.random() * (max.x - min.x + 1)) + min.x,
        y: Math.floor(Math.random() * (max.y - min.y + 1)) + min.y
    }

}

function checkAppleCoordinate(appleX, appleY) {
    if(appleX === snake.head.x && appleY === snake.head.y) {
        return true;
    }

    for(element of snake.body) {
        if(element.x === appleX && element.y === appleY) {
            return true;
        }
    }
}

function generateApple() {
    let coordinates = generateAppleCoordinate();
    while (checkAppleCoordinate(coordinates.x, coordinates.y)) {
        coordinates = generateAppleCoordinate();
    }

    apple = { x: coordinates.x, y: coordinates.y }
}


function drawApple() {
    context.fillStyle = 'purple';
    context.fillRect(apple.x * CELL_WIDTH, apple.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
}

function updateApple() {
    if(apple.x === snake.head.x && apple.y === snake.head.y) {
        growSnake();
        generateApple();
    }
}

function growSnake() {
    snake.body.push({x: snakeGrowthPosition.x, y: snakeGrowthPosition.y})
}

function isGameOver() {
    if (snake.head.x >= GRID_WIDTH || snake.head.y >= GRID_HEIGHT || snake.head.x < 0 || snake.head.y < 0) {
        return true;
    }
    if (checkTheBody()) {
        return true;
    }
    return false;
}

function checkTheBody() {
    for (segment of snake.body){
        if (segment.x === snake.head.x && segment.y === snake.head.y){
            return true;
        }
    }
    return false;
}

const popUp = document.getElementById('popup');
const popUpButton = document.getElementById('popup_button')
let isOpen = false;
function showPopUp() {
    if (isGameOver()){
        popUp.classList.remove('hidden');
        popUp.classList.add('open');
        isOpen = true;
    }
}

function hidePopUp() {
    if (isOpen === true){
        popUp.classList.remove('open');
        popUp.classList.add('hidden');
        isOpen = false;
    }
}

function tryAgain() {
    hidePopUp();
    startGame();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('keydown', handleKeyDown);
popUpButton.addEventListener('click', tryAgain)

function startGame() {
    initialize();
    render();
    gameLoopInterval = setInterval(gameLoop, 500);
}

startGame();
