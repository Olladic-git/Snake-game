import React from "react";
import { CELL_WIDTH, CELL_HEIGHT, RIGHT, LEFT, UP, DOWN, COLOR_GREY, COLOR_LIGHT, SPEED } from "./constants";


export default class SnakeGameApp extends React.Component {
    canvasRef = React.createRef();
    popupRef = React.createRef();
    popupButtonRef = React.createRef();

    canvas = undefined;
    context =  undefined;
    popUp = undefined;
    popUpButton = undefined;

    isPopUpOpen = false;

    snake = undefined;
    apple = undefined;

    gameLoopInterval = undefined;
    snakeGrowthPosition = undefined;
    changingDirection = undefined;

    getGridWidth() {
        return Math.floor(this.canvas.width / CELL_WIDTH);
    }

    getGridHeight() {
        return Math.floor(this.canvas.height / CELL_HEIGHT);
    }


    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.context = this.canvas.getContext('2d');
        this.popUp = this.popupRef.current;
        this.popUpButton = this.popupButtonRef.current;

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.popUpButton.addEventListener('click', this.tryAgain.bind(this));

        this.startGame();
    }
    render() {
        return(
            <React.Fragment>
                <canvas id="game-canvas" width="300px" height="300px" ref={this.canvasRef}></canvas>
                <div id="popup" className="popup hidden" ref={this.popupRef}>
                    <div className="popup_body">
                        <div className="popup_content">
                            <div className="popup_text">Game over</div>
                            <button id="popup_button" className="popup_button" ref={this.popupButtonRef}>Try again</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    initialize() {
        this.generateSnake();
        this.generateApple();
    }
    
    gameLoop() {
        this.updateSnake();
        if (this.isGameOver()) {
            this.endGame();
            return;
        }
        this.updateApple();
        this.updateCanvas();
    }
    
    updateCanvas() {
        this.clearCanvas();
        this.drawGrid();
        this.drawSnake();
        if (this.apple !== undefined){
            this.drawApple();
        }
    }
    
    generateSnake() {
        this.snake = {
            direction: RIGHT,
            head: {
                x: 4, y: 4
            },
            body: [
                {x: 4, y: 5},
                {x: 4, y: 6}
            ]
        }
    
        this.changingDirection = this.snake.direction;
    }
    
    updateSnake() {
        this.updateDirection();
        this.moveSnake();
    }
    
    drawSnake() {
        //draw head
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.snake.head.x * CELL_WIDTH, this.snake.head.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    
        //draw body
        for (const segment of this.snake.body) {
            this.context.fillStyle = 'green';
            this.context.fillRect(segment.x * CELL_WIDTH, segment.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }
    }
    
    
    drawGrid() {
        for (let i = 0; i < this.getGridHeight(); i++) {
          for (let j = 0; j < this.getGridWidth(); j++) {
                if (i % 2 !== 0 && j % 2 !== 0) {
                    this.context.fillStyle = COLOR_GREY;
                } else if (i % 2 == 0 && j % 2 == 0) {
                    this.context.fillStyle = COLOR_GREY;
                } else {
                    this.context.fillStyle = COLOR_LIGHT;
                }
                this.context.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }
    
    moveSnake() {
        const velocity = this.calculateVelocity();
    
        let prevSegmentPosition = {
            x: this.snake.head.x, y: this.snake.head.y
        };
    
        //move head
        this.snake.head.x += velocity.x;
        this.snake.head.y += velocity.y;
    
        //move body 
        for (const segment of this.snake.body) {
            const currentSegmentPosition = {
                x: segment.x, y: segment.y
            };
    
            segment.x = prevSegmentPosition.x;
            segment.y = prevSegmentPosition.y;
    
            prevSegmentPosition = currentSegmentPosition;
        }
        this.snakeGrowthPosition = prevSegmentPosition;
    }
    
    calculateVelocity() {
        switch (this.snake.direction) {
            case UP:
                return {x: 0, y : -SPEED};
            case RIGHT: 
                return {x: SPEED, y: 0};
            case DOWN:
                return {x: 0, y: SPEED};
            case LEFT: 
                return {x: -SPEED, y: 0};
            default: 
                throw new Error('Unknown direction' + this.snake.direction);
        }
    }
    
    handleKeyDown(event) {
        if (event.code == 'KeyA') {
           this.changingDirection = LEFT;
        }
        if (event.code == 'KeyD') {
            this.changingDirection = RIGHT;
        }
        if (event.code == 'KeyW') {
            this.changingDirection = UP;
        }
        if (event.code == 'KeyS') {
            this.changingDirection = DOWN;
        }
    }
    
    updateDirection() {
        if (this.changingDirection == UP && (this.snake.direction == RIGHT || this.snake.direction == LEFT)) {
            this.snake.direction = this.changingDirection;
        }
        if (this.changingDirection == DOWN && (this.snake.direction == RIGHT || this.snake.direction == LEFT)) {
            this.snake.direction = this.changingDirection;
        }
        if (this.changingDirection == LEFT && (this.snake.direction == UP || this.snake.direction == DOWN)) {
            this.snake.direction = this.changingDirection;
        }
        if (this.changingDirection == RIGHT && (this.snake.direction == UP || this.snake.direction == DOWN)) {
            this.snake.direction = this.changingDirection;
        }
        return;
    }
    
    generateAppleCoordinate() {
        return {
            x: Math.floor(Math.random() * (CELL_WIDTH - 0 + 1)) + 0,
            y: Math.floor(Math.random() * (CELL_HEIGHT - 0 + 1)) + 0
        }
    }
    
    checkAppleCoordinate(appleX, appleY) {
        if (appleX === this.snake.head.x && appleY === this.snake.head.y) {
            return true;
        }
    
        for (const element of this.snake.body) {
            if (element.x === appleX && element.y === appleY) {
                return true;
            }
        }
    }
    
    generateApple() {
        let coordinates = this.generateAppleCoordinate();
    
        while (this.checkAppleCoordinate(coordinates.x, coordinates.y)) {
            coordinates = this.generateAppleCoordinate();
        }
    
        this.apple = { x: coordinates.x, y: coordinates.y };
    }
    
    drawApple() {
        this.context.fillStyle = 'purple';
        this.context.fillRect(this.apple.x * CELL_WIDTH, this.apple.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }
    
    updateApple() {
        if (this.apple.x === this.snake.head.x && this.apple.y === this.snake.head.y) {
            this.growSnake();
            this.generateApple();
        }
    }
    
    growSnake() {
        this.snake.body.push({x: this.snakeGrowthPosition.x, y: this.snakeGrowthPosition.y})
    }
    
    isGameOver() {
        if (this.snake.head.x >= this.getGridWidth() || this.snake.head.y >= this.getGridHeight() || this.snake.head.x < 0 || this.snake.head.y < 0) {
            return true;
        }
        if (this.checkTheBody()) {
            return true;
        }
        return false;
    }
    
    checkTheBody() {
        for (const segment of this.snake.body){
            if (segment.x === this.snake.head.x && segment.y === this.snake.head.y){
                return true;
            }
        }
        return false;
    }
    
    showPopUp() {
        if (this.isGameOver()) {
            this.popUp.classList.remove('hidden');
            this.popUp.classList.add('open');
            this.isPopUpOpen = true;
        }
    }
    
    hidePopUp() {
        if (this.isPopUpOpen === true) {
            this.popUp.classList.remove('open');
            this.popUp.classList.add('hidden');
        }
    }
    
    tryAgain() {
        this.hidePopUp();
        this.startGame();
    }
    
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    startGame() {
        this.initialize();
        this.updateCanvas();
        this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 500);
    }
    
    endGame() {
        this.showPopUp();
        clearInterval(this.gameLoopInterval);
    }
}