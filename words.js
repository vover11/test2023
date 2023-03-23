

const splitWords = () => {
    const textNode = document.querySelector(".text");
    const text = textNode.textContent;
    const newDomElements = text.split(" ").map((text) => {
        const highlighted =
            text.startsWith(`"30under30"`) ||
            text.startsWith(`CTO`) ||
            text.startsWith(`Mythrill`);
        return `<span class="word ${highlighted ? "highlighted" : null
            }">${text}</span>`;
    });
    textNode.innerHTML = newDomElements.join("");
};

const renderCanvas = () => {
    
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const params = {
        isStatic: true,
        render: {
            fillStyle: "transparent"
        }
    };
    const textContainer = document.querySelector('.text');
    const { width, height } = textContainer.getBoundingClientRect();
    const canvasSize = {
        width: Math.ceil(width),
        height: Math.ceil(height)
    };
    const engine = Engine.create({});

    const render = Render.create({
        element: textContainer,
        engine: engine,
        options: {
            ...canvasSize,
            background: "transparent",
            wireframes: false
        }
    });
    
    const floor = Bodies.rectangle(
        canvasSize.width / 2,
        canvasSize.height,
        canvasSize.width,
        50,
        params
    );
    const wall1 = Bodies.rectangle(
        0,
        canvasSize.height / 2,
        50,
        canvasSize.height,
        params
    );
    const wall2 = Bodies.rectangle(
        canvasSize.width,
        canvasSize.height / 2,
        50,
        canvasSize.height,
        params
    );
    const top = Bodies.rectangle(
        canvasSize.width / 2,
        0,
        canvasSize.width,
        50,
        params
    );
    const wordElements = document.querySelectorAll(".word");
    const wordBodies = [...wordElements].map((elemRef) => {
        const width = elemRef.offsetWidth;
        const height = elemRef.offsetHeight;

        return {
            body: Matter.Bodies.rectangle(canvasSize.width / 2, 0, width, height, {
                render: {
                    fillStyle: "transparent"
                }
            }),
            elem: elemRef,
            render() {
                const { x, y } = this.body.position;
                this.elem.style.top = `${y + height / 2 - 10}px`;
                this.elem.style.left = `${x - width / 2}px`;
                this.elem.style.transform = `rotate(${this.body.angle}rad)`;
            }
        };
    });
    

    const mouse = Matter.Mouse.create(document.body);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    World.add(engine.world, [
        floor,
        ...wordBodies.map((box) => box.body),
        wall1,
        wall2,
        top,
        mouseConstraint
    ]);
    render.mouse = mouse;
    const bounds = {
        min: { x: 0, y: 0 },
        max: { x: canvasSize.width, y: canvasSize.height },
    };
    const wallOptions = {
        isStatic: true,
        render: {
            visible: false,
        },
    };
    const walls = [
        Bodies.rectangle(canvasSize.width / 2, -10, canvasSize.width, 20, wallOptions),
        Bodies.rectangle(canvasSize.width / 2, canvasSize.height + 10, canvasSize.width, 20, wallOptions),
        Bodies.rectangle(-10, canvasSize.height / 2, 20, canvasSize.height, wallOptions),
        Bodies.rectangle(canvasSize.width + 10, canvasSize.height / 2, 20, canvasSize.height, wallOptions),
    ];
    World.add(engine.world, walls);
    
    // Ограничение перемещения слов
    Matter.Events.on(engine, "beforeUpdate", function () {
        wordBodies.forEach((element) => {
            const { x, y } = element.body.position;
            const width = element.elem.offsetWidth;
            const height = element.elem.offsetHeight;
            const boundX = width / 2;
            const boundY = height / 2;
            if (x < boundX || x > bounds.max.x - boundX || y < boundY || y > bounds.max.y - boundY) {
                Matter.Body.setVelocity(element.body, { x: 0, y: 0 });
                Matter.Body.setPosition(element.body, {
                    x: Math.min(Math.max(x, boundX), bounds.max.x - boundX),
                    y: Math.min(Math.max(y, boundY), bounds.max.y - boundY),
                });
            }
        });
    });
    Runner.run(engine);
    Render.run(render);

    (function rerender() {
        wordBodies.forEach((element) => {
            element.render();
        });
        Matter.Engine.update(engine);
        requestAnimationFrame(rerender);
    })();
};

window.addEventListener("DOMContentLoaded", (event) => {
    splitWords();
    renderCanvas();
});
