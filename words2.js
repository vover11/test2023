
    // Разделяем слова на теги span
    const splitWords = () => {
        const textNode = document.querySelector(".text");
        const text = textNode.textContent;
        const newDomElements = text.split(" ").map((text) => {
            const highlighted =
                text.startsWith(`DEVELOPMENT`) ||
                text.startsWith(`WEBSITE`) ||
                text.startsWith(`COMPANY`);
            return `<span class="word ${highlighted ? "highlighted" : null}" style="background-color: transparent">${text}</span>`;

        });
        textNode.innerHTML = newDomElements.join("");
    };
    splitWords();

    // Создаем движок Matter.js и его модули
    const { Engine, Render, World, Bodies } = Matter;


    
    // Создаем размеры холста
    const container = document.querySelector(".text");
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    

    const canvas = document.createElement('canvas');
    // canvas = document.querySelector('canvas');
    canvas.width = width;
    canvas.height = height;
    



    // Создаем тела и связываем их с элементами DOM
    const wordSpans = container.querySelectorAll('.word');
    const bodies = Array.from(wordSpans).map((wordSpan) => {
        const bounds = wordSpan.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        // const x = container.clientWidth / 2;  //ставим слова по центру 
        const y = -bounds.height / 2; // Изменяем начальную координату по оси y
        const w = bounds.width;
        const h = bounds.height;
        const body = Bodies.rectangle(x, y, w, h);
        // Связываем тело Matter.js с соответствующим элементом DOM
        wordSpan.style.position = "absolute";
        wordSpan.style.left = x - w / 2 + "px";
        wordSpan.style.top = y - h / 2 + "px";
        container.appendChild(wordSpan);
        // Связываем тело Matter.js с соответствующим элементом DOM
        body.render.fillStyle = 'transparent';
        body.label = wordSpan;
        return body;
    });





    // Создаем движок
    const engine = Engine.create();

    // Создаем отрисовщик
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background:
                "blue",
        },
    });

    window.addEventListener("resize", function () {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        render.options.pixelRatio = window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        Engine.update(engine, 0);
    });

    const updateWordPositions = () => {
        bodies.forEach((body) => {
            const wordSpan = body.label;
            const pos = body.position;
            const angle = body.angle;

            // Проверяем, не выходит ли слово за границы канваса
            const wordWidth = wordSpan.clientWidth;
            const wordHeight = wordSpan.clientHeight;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const maxX = canvasWidth - wordWidth / 2;
            const maxY = canvasHeight - wordHeight / 2;
            const minX = wordWidth / 2;
            const minY = wordHeight / 2;

            let x = pos.x;
            let y = pos.y;

            if (x > maxX) {
                x = maxX;
            } else if (x < minX) {
                x = minX;
            }

            if (y > maxY) {
                y = maxY;
            } else if (y < minY) {
                y = minY;
            }

            wordSpan.style.left = x - wordWidth / 2 + "px";
            wordSpan.style.top = y - wordHeight / 2 + "px";
            wordSpan.style.transform = `rotate(${angle}rad)`;
        });

        requestAnimationFrame(updateWordPositions);
    };
    updateWordPositions();


    // Создаем границы холста
    const ground = Bodies.rectangle(width / 2, height + 50, width + 100, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });
    World.add(engine.world, [ground, leftWall, rightWall]);




    // Запускаем движок и отрисовщик
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Render.run(render);

    World.add(engine.world, bodies);




