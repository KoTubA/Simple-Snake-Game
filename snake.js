(function () {

    let easy = document.querySelector('#easy'),
        medium = document.querySelector('#medium'),
        hard = document.querySelector('#hard'),
        refresh = document.querySelector('#refresh'),
        s = null,
        time = 0;

    easy.addEventListener('click', () => { time = 125, s = new Snake(125) });
    medium.addEventListener('click', () => { time = 100, s = new Snake(100) });
    hard.addEventListener('click', () => { time = 75, s = new Snake(75) });
    refresh.addEventListener('click', () => { s = new Snake(time) });

    function Snake(time) {

        this.time = time;

        this.point = document.querySelectorAll('.point');
        this.highest = document.querySelectorAll('.point-highest');

        this.canvasElem = document.querySelector('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.image = new Image();
        this.image.src = "img/board.png";

        this.board = document.querySelector('#game-cnt');
        this.menu = document.querySelector('#menu');
        this.result = document.querySelector('#result');
        this.home = document.querySelector('#home');
        this.subtitle = document.querySelector('#subtitle-cnt');

        this.menu.style.opacity = "0";
        this.result.style.opacity = 0;
        this.result.style.zIndex = -1;
        this.board.style.display = "flex";
        this.menu.addEventListener('transitionend', () => {
            this.menu.style.display = "none";
        });

        this.d = "";
        this.flag = true;
        this.score = 0;
        this.point.forEach((el) => el.innerText = this.score);

        this.box = 32;
        this.snake = [];
        this.apple = [];
        this.snake[0] = { x: (3 * this.box) + 28, y: (7 * this.box) + 25 };
        this.snake[1] = { x: (2 * this.box) + 28, y: (7 * this.box) + 25 };
        this.snake[2] = { x: (1 * this.box) + 28, y: (7 * this.box) + 25 };
        this.apple[0] = { x: (13 * this.box) + 28, y: (7 * this.box) + 25 };
        this.snakeX = null;
        this.snakeY = null;

        this.draw = function () {
            this.ctx.drawImage(this.image, 0, 0);
            this.flag = true;

            this.apple.forEach((el) => {
                this.ctx.fillStyle = "#B62220";
                this.ctx.fillRect(el.x, el.y, this.box, this.box);
                //this.ctx.strokeRect(el.x,el.y,this.box,this.box);

                this.snake.forEach((s, j) => {
                    this.ctx.fillStyle = (j == 0) ? "#16337a" : "white";
                    this.ctx.fillRect(s.x, s.y, this.box, this.box);
                    this.ctx.strokeStyle = "#2448a3";
                    this.ctx.strokeRect(s.x, s.y, this.box, this.box);
                });
            });
            this.check();
        };

        this.check = function () {
            if (this.d != "") {
                this.snakeX = this.snake[0].x;
                this.snakeY = this.snake[0].y;
                if (this.d == "LEWO") this.snakeX -= this.box;
                if (this.d == "GÓRA") this.snakeY -= this.box;
                if (this.d == "PRAWO") this.snakeX += this.box;
                if (this.d == "DÓŁ") this.snakeY += this.box;

                this.collision();
            };
        };


        this.collision = function () {

            this.newHead = {
                x: this.snakeX,
                y: this.snakeY
            };

            //Sprawdzamy czy wąż nie uderzył w ścianę
            if ((this.newHead.x > (17 * this.box)) || (this.newHead.x < 28) || (this.newHead.y < 25) || (this.newHead.y > (15 * this.box))) this.summary();

            //Sprawdzamy czy wąż nie zjadł ogona
            this.snake.forEach((el) => {
                if (this.newHead.x == el.x && this.newHead.y == el.y) this.summary();
            });

            this.snake.unshift(this.newHead);

            //Sprawdzamy czy wąż zładł jabłko
            (this.newHead.x == this.apple[0].x && this.newHead.y == this.apple[0].y) ? this.eat() : this.snake.pop();
        };

        this.eat = function () {
            this.score++;
            this.point.forEach((el) => el.innerText = this.score);
            this.highest.forEach((el) => { if (el.innerText < this.score) el.innerText = this.score });

            if (this.score == 252) { setTimeout(() => this.summary(), this.time); return };

            let f = null;

            do {
                f = false;
                //Losujemy nowe położenie owoca
                this.apple[0] = { x: (Math.floor(Math.random() * 16) * this.box) + 28, y: ((Math.floor(Math.random() * 14)) * this.box) + 25 };

                //Sprawdzamy czy jabłko ma inną pozycję niż ciało węża
                this.snake.forEach((el) => {
                    if (el.x == this.apple[0].x && el.y == this.apple[0].y) f = true;
                })
            } while (f);
        };

        document.addEventListener('keydown', e => {
            if (this.board.style.display == "flex") {
                switch (e.keyCode) {
                    case 37:
                    case 65:
                        if (this.d != "PRAWO" && this.d != "" && this.flag) {
                            this.d = "LEWO";
                            this.flag = false;
                        }
                        break;
                    case 38:
                    case 87:
                        if (this.d != "DÓŁ" && this.flag) {
                            this.d = "GÓRA";
                            this.flag = false;
                        }
                        break;
                    case 39:
                    case 68:
                        if (this.d != "LEWO" && this.flag) {
                            this.d = "PRAWO";
                            this.flag = false;
                        }
                        break;
                    case 40:
                    case 83:
                        if (this.d != "GÓRA" && this.flag) {
                            this.d = "DÓŁ";
                            this.flag = false;
                        }
                        break;
                }
            };
        });

        this.summary = function () {
            let el = document.querySelector('#cnt-img').firstChild;
            clearInterval(this.game);

            if (this.score == 252) el.src = "img/crown.png";
            else el.src = "img/death.png"

            this.result.style.opacity = 1;
            this.result.style.zIndex = 90;
        }

        this.image.addEventListener('load', () => {
            this.draw();
        });

        this.home.addEventListener('click', () => {
            this.menu.addEventListener('transitionend', () => {
                this.menu.style.display = "flex";
            });
            this.menu.style.opacity = "1"; this.result.style.opacity = 0; this.menu.style.display = "flex";
            this.board.style.display = "none"; this.result.style.zIndex = -1; this.highest.forEach((el) => el.innerText = "0");
        });

        this.game = setInterval(this.draw.bind(this), this.time);
    };
})();