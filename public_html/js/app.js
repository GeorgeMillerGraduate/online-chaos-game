$(document).ready(function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const canvas =
        document.getElementById("chaosCanvas");

    const canvasMessage =
        document.getElementById("canvasMessage");


    const vertexCount =
        document.getElementById("vertexCount");

    const jumpRatio =
        document.getElementById("jumpRatio");

    const iterations =
        document.getElementById("iterations");

    const simulationSpeed =
        document.getElementById("simulationSpeed");

    const ruleSelect =
        document.getElementById("ruleSelect");


    const vertexCountValue =
        document.getElementById("vertexCountValue");

    const jumpRatioValue =
        document.getElementById("jumpRatioValue");

    const iterationsValue =
        document.getElementById("iterationsValue");

    const simulationSpeedValue =
        document.getElementById("simulationSpeedValue");


    const visualisationTitle =
        document.getElementById("visualisationTitle");

    const pointCount =
        document.getElementById("pointCount");

    const vertexStat =
        document.getElementById("vertexStat");

    const ratioStat =
        document.getElementById("ratioStat");


    /* =====================================================
       OBJECTS
       ===================================================== */

    const renderer =
        new ChaosRenderer(canvas);


    let polygon =
        new Polygon(
            Number(vertexCount.value),
            renderer.getWidth(),
            renderer.getHeight()
        );


    let chaosGame =
        new ChaosGame(
            polygon,
            Number(jumpRatio.value) / 100
        );


    /* =====================================================
       STATE
       ===================================================== */

    let generatedPoints = [];

    let targetIterations =
        Number(iterations.value);

    let running = false;

    let animationFrame = null;


    /* =====================================================
       POLYGON NAMES
       ===================================================== */

    const polygonNames = {

        3: "Triangle",

        4: "Square",

        5: "Pentagon",

        6: "Hexagon",

        7: "Heptagon",

        8: "Octagon",

        9: "Nonagon",

        10: "Decagon"

    };


    /* =====================================================
       FORMAT NUMBER
       ===================================================== */

    function formatNumber(number) {

        return Number(number)
            .toLocaleString();
    }


    /* =====================================================
       UPDATE CONTROL LABELS
       ===================================================== */

    function updateControlLabels() {

        const vertices =
            Number(vertexCount.value);

        const ratio =
            Number(jumpRatio.value) / 100;

        const points =
            Number(iterations.value);

        const speed =
            Number(simulationSpeed.value);


        vertexCountValue.textContent =
            vertices;


        jumpRatioValue.textContent =
            ratio.toFixed(2);


        iterationsValue.textContent =
            formatNumber(points);


        simulationSpeedValue.textContent =
            formatNumber(speed);
    }


    /* =====================================================
       UPDATE STATISTICS
       ===================================================== */

    function updateStatistics() {

        const vertices =
            Number(vertexCount.value);

        const ratio =
            Number(jumpRatio.value) / 100;


        pointCount.textContent =
            formatNumber(
                generatedPoints.length
            );


        vertexStat.textContent =
            vertices;


        ratioStat.textContent =
            ratio.toFixed(2);


        visualisationTitle.textContent =
            polygonNames[vertices] ||
            vertices + "-gon";
    }


    /* =====================================================
       BUILD SIMULATION
       ===================================================== */

    function buildSimulation() {

        stopAnimation();


        renderer.resizeCanvas();


        polygon =
            new Polygon(
                Number(vertexCount.value),
                renderer.getWidth(),
                renderer.getHeight()
            );


        chaosGame =
            new ChaosGame(
                polygon,
                Number(jumpRatio.value) / 100
            );


        chaosGame.setRule(
            ruleSelect.value
        );


        chaosGame.initialise();


        generatedPoints = [];


        targetIterations =
            Number(iterations.value);


        renderer.prepare(
            polygon
        );


        canvasMessage.style.display =
            "none";


        updateStatistics();
    }


    /* =====================================================
       GENERATE
       ===================================================== */

    function generate() {

        buildSimulation();

        startAnimation();
    }


    /* =====================================================
       START
       ===================================================== */

    function startAnimation() {

        if (running) {

            return;
        }


        /*
         * If the previous simulation has already
         * finished, generate a fresh one.
         */

        if (
            generatedPoints.length >=
            targetIterations
        ) {

            buildSimulation();
        }


        running = true;


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =====================================================
       ANIMATION LOOP
       ===================================================== */

    function animate() {

        if (!running) {

            return;
        }


        const remaining =
            targetIterations -
            generatedPoints.length;


        if (remaining <= 0) {

            stopAnimation();

            return;
        }


        const pointsPerFrame =
            Number(
                simulationSpeed.value
            );


        const batchSize =
            Math.min(
                pointsPerFrame,
                remaining
            );


        const points =
            chaosGame.generate(
                batchSize
            );


        /*
         * Store the generated points so that the
         * simulation can be redrawn after a resize.
         */

        generatedPoints.push(
            ...points
        );


        /*
         * Only draw the new points.
         *
         * This is much faster than redrawing the
         * complete fractal every frame.
         */

        renderer.renderBatch(
            points
        );


        updateStatistics();


        if (
            generatedPoints.length >=
            targetIterations
        ) {

            stopAnimation();

            return;
        }


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =====================================================
       PAUSE / STOP
       ===================================================== */

    function stopAnimation() {

        running = false;


        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );


            animationFrame = null;
        }
    }


    /* =====================================================
       STEP
       ===================================================== */

    function stepSimulation() {

        if (!chaosGame.currentPoint) {

            buildSimulation();
        }


        stopAnimation();


        if (
            generatedPoints.length >=
            targetIterations
        ) {

            return;
        }


        const point =
            chaosGame.step();


        generatedPoints.push(
            point
        );


        renderer.drawPoint(
            point
        );


        canvasMessage.style.display =
            "none";


        updateStatistics();
    }


    /* =====================================================
       RESET
       ===================================================== */

    function resetSimulation() {

        stopAnimation();


        generatedPoints = [];


        chaosGame.reset();


        renderer.clear();


        renderer.drawPolygon(
            polygon
        );


        canvasMessage.style.display =
            "block";


        canvasMessage.textContent =
            "Generate a chaos game to begin.";


        updateStatistics();
    }


    /* =====================================================
       REBUILD AFTER PARAMETER CHANGE
       ===================================================== */

    function parameterChanged() {

        updateControlLabels();

        updateStatistics();


        /*
         * If a visualisation already exists,
         * rebuild it using the new parameters.
         */

        if (
            generatedPoints.length > 0
        ) {

            buildSimulation();
        }
    }


    /* =====================================================
       VERTEX SLIDER
       ===================================================== */

    $(vertexCount).on(
        "input",
        function () {

            updateControlLabels();

            updateStatistics();
        }
    );


    $(vertexCount).on(
        "change",
        function () {

            parameterChanged();
        }
    );


    /* =====================================================
       JUMP RATIO
       ===================================================== */

    $(jumpRatio).on(
        "input",
        function () {

            updateControlLabels();

            ratioStat.textContent =
                (
                    Number(
                        jumpRatio.value
                    ) / 100
                ).toFixed(2);
        }
    );


    $(jumpRatio).on(
        "change",
        function () {

            parameterChanged();
        }
    );


    /* =====================================================
       ITERATION COUNT
       ===================================================== */

    $(iterations).on(
        "input",
        function () {

            updateControlLabels();

            targetIterations =
                Number(
                    iterations.value
                );
        }
    );


    /* =====================================================
       SIMULATION SPEED
       ===================================================== */

    $(simulationSpeed).on(
        "input",
        function () {

            updateControlLabels();
        }
    );


    /* =====================================================
       RULE
       ===================================================== */

    $(ruleSelect).on(
        "change",
        function () {

            if (
                generatedPoints.length > 0
            ) {

                buildSimulation();

            } else {

                chaosGame.setRule(
                    ruleSelect.value
                );
            }
        }
    );


    /* =====================================================
       GENERATE BUTTON
       ===================================================== */

    $("#generateButton").on(
        "click",
        function () {

            generate();
        }
    );


    /* =====================================================
       START BUTTON
       ===================================================== */

    $("#startButton").on(
        "click",
        function () {

            /*
             * Initialise the simulation if the
             * canvas has not been used yet.
             */

            if (
                generatedPoints.length === 0 &&
                chaosGame.getIteration() === 0
            ) {

                buildSimulation();
            }


            startAnimation();
        }
    );


    /* =====================================================
       PAUSE BUTTON
       ===================================================== */

    $("#pauseButton").on(
        "click",
        function () {

            stopAnimation();
        }
    );


    /* =====================================================
       STEP BUTTON
       ===================================================== */

    $("#stepButton").on(
        "click",
        function () {

            stepSimulation();
        }
    );


    /* =====================================================
       RESET BUTTON
       ===================================================== */

    $("#resetButton").on(
        "click",
        function () {

            resetSimulation();
        }
    );


    /* =====================================================
       DOWNLOAD
       ===================================================== */

    $("#downloadButton").on(
        "click",
        function () {

            renderer.download(
                "chaos-game.png"
            );
        }
    );


    /* =====================================================
       PRESETS
       ===================================================== */

    $(".preset-button").on(
        "click",
        function () {

            const preset =
                $(this).data(
                    "preset"
                );


            $(".preset-button")
                .removeClass(
                    "active"
                );


            $(this)
                .addClass(
                    "active"
                );


            switch (preset) {


                /* -----------------------------------------
                   SIERPINSKI TRIANGLE
                   ----------------------------------------- */

                case "sierpinski":

                    vertexCount.value =
                        3;

                    jumpRatio.value =
                        50;

                    ruleSelect.value =
                        "any";

                    break;


                /* -----------------------------------------
                   PENTAGON
                   ----------------------------------------- */

                case "pentagon":

                    vertexCount.value =
                        5;

                    jumpRatio.value =
                        50;

                    ruleSelect.value =
                        "any";

                    break;


                /* -----------------------------------------
                   RESTRICTED SQUARE
                   ----------------------------------------- */

                case "restricted-square":

                    vertexCount.value =
                        4;

                    jumpRatio.value =
                        50;

                    ruleSelect.value =
                        "no-repeat";

                    break;
            }


            updateControlLabels();

            updateStatistics();

            generate();
        }
    );


    /* =====================================================
       WINDOW RESIZE
       ===================================================== */

    let resizeTimer = null;


    $(window).on(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        stopAnimation();


                        renderer.resizeCanvas();


                        /*
                         * Rebuild the polygon because its
                         * coordinates depend on canvas size.
                         */

                        polygon =
                            new Polygon(
                                Number(
                                    vertexCount.value
                                ),
                                renderer.getWidth(),
                                renderer.getHeight()
                            );


                        /*
                         * The existing generated coordinates
                         * belong to the old canvas dimensions.
                         * Recreate the simulation and regenerate
                         * the same number of points.
                         */

                        const oldPointCount =
                            generatedPoints.length;


                        chaosGame =
                            new ChaosGame(
                                polygon,
                                Number(
                                    jumpRatio.value
                                ) / 100
                            );


                        chaosGame.setRule(
                            ruleSelect.value
                        );


                        chaosGame.initialise();


                        generatedPoints = [];


                        renderer.prepare(
                            polygon
                        );


                        if (
                            oldPointCount > 0
                        ) {

                            const points =
                                chaosGame.generate(
                                    oldPointCount
                                );


                            generatedPoints =
                                points;


                            renderer.drawPoints(
                                points
                            );


                            canvasMessage.style.display =
                                "none";

                        } else {

                            canvasMessage.style.display =
                                "block";
                        }


                        updateStatistics();

                    },
                    150
                );
        }
    );


    /* =====================================================
       INITIAL PAGE STATE
       ===================================================== */

    updateControlLabels();

    updateStatistics();


    renderer.clear();


    canvasMessage.style.display =
        "block";

});