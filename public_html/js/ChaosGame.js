class ChaosGame {

    constructor(polygon, jumpRatio = 0.5) {

        this.polygon = polygon;

        this.jumpRatio = jumpRatio;

        this.currentPoint = null;

        this.previousVertexIndex = null;

        this.vertexTwoTurnsAgo = null;

        this.rule = "any";

        this.iteration = 0;
    }


    /* =====================================================
       INITIALISATION
       ===================================================== */

    initialise() {

        const vertices =
            this.polygon.getVertices();


        if (!vertices || vertices.length === 0) {

            throw new Error(
                "ChaosGame requires a polygon with vertices."
            );
        }


        /*
         * Start in the centre of the polygon.
         *
         * The first few generated points normally form
         * part of the transient phase and can later be
         * ignored by the renderer if desired.
         */

        let totalX = 0;
        let totalY = 0;


        for (const vertex of vertices) {

            totalX += vertex.x;
            totalY += vertex.y;
        }


        this.currentPoint = {

            x: totalX / vertices.length,

            y: totalY / vertices.length
        };


        this.previousVertexIndex = null;

        this.vertexTwoTurnsAgo = null;

        this.iteration = 0;


        return this.getCurrentPoint();
    }


    /* =====================================================
       PERFORM ONE ITERATION
       ===================================================== */

    step() {

        if (!this.currentPoint) {

            this.initialise();
        }


        const vertexIndex =
            this.chooseVertex();


        const vertices =
            this.polygon.getVertices();


        const vertex =
            vertices[vertexIndex];


        /*
         * Move the current point towards the
         * selected vertex.
         *
         * ratio = 0.5 means move exactly halfway.
         */

        this.currentPoint = {

            x:
                this.currentPoint.x +
                (
                    vertex.x -
                    this.currentPoint.x
                ) *
                this.jumpRatio,

            y:
                this.currentPoint.y +
                (
                    vertex.y -
                    this.currentPoint.y
                ) *
                this.jumpRatio
        };


        /*
         * Remember vertex history so restricted
         * chaos-game rules can be implemented.
         */

        this.vertexTwoTurnsAgo =
            this.previousVertexIndex;


        this.previousVertexIndex =
            vertexIndex;


        this.iteration++;


        return {

            x: this.currentPoint.x,

            y: this.currentPoint.y,

            vertexIndex: vertexIndex,

            iteration: this.iteration
        };
    }


    /* =====================================================
       GENERATE MULTIPLE POINTS
       ===================================================== */

    generate(count) {

        count =
            Math.max(
                0,
                Math.floor(count)
            );


        const points = [];


        for (
            let i = 0;
            i < count;
            i++
        ) {

            points.push(
                this.step()
            );
        }


        return points;
    }


    /* =====================================================
       CHOOSE VERTEX
       ===================================================== */

    chooseVertex() {

        const vertices =
            this.polygon.getVertices();


        if (!vertices || vertices.length === 0) {

            throw new Error(
                "Cannot choose a vertex from an empty polygon."
            );
        }


        const allowedVertices = [];


        for (
            let index = 0;
            index < vertices.length;
            index++
        ) {

            if (
                this.isVertexAllowed(
                    index,
                    vertices.length
                )
            ) {

                allowedVertices.push(
                    index
                );
            }
        }


        /*
         * A custom rule should never leave us with
         * zero choices. Fall back to unrestricted
         * selection if that somehow occurs.
         */

        if (allowedVertices.length === 0) {

            return Math.floor(
                Math.random() *
                vertices.length
            );
        }


        const randomIndex =
            Math.floor(
                Math.random() *
                allowedVertices.length
            );


        return allowedVertices[
            randomIndex
        ];
    }


    /* =====================================================
       VERTEX RULES
       ===================================================== */

    isVertexAllowed(
        vertexIndex,
        vertexCount
    ) {

        switch (this.rule) {


            /* ---------------------------------------------
               ANY VERTEX
               --------------------------------------------- */

            case "any":

                return true;


            /* ---------------------------------------------
               DO NOT REPEAT PREVIOUS VERTEX
               --------------------------------------------- */

            case "no-repeat":

                if (
                    this.previousVertexIndex === null
                ) {

                    return true;
                }


                return (
                    vertexIndex !==
                    this.previousVertexIndex
                );


            /* ---------------------------------------------
               DO NOT CHOOSE ADJACENT VERTICES
               --------------------------------------------- */

            case "no-adjacent":

                if (
                    this.previousVertexIndex === null
                ) {

                    return true;
                }


                const previous =
                    this.previousVertexIndex;


                const left =
                    (
                        previous -
                        1 +
                        vertexCount
                    ) %
                    vertexCount;


                const right =
                    (
                        previous +
                        1
                    ) %
                    vertexCount;


                return (
                    vertexIndex !== left &&
                    vertexIndex !== right
                );


            /* ---------------------------------------------
               DO NOT CHOOSE VERTEX FROM TWO TURNS AGO
               --------------------------------------------- */

            case "no-two-back":

                if (
                    this.vertexTwoTurnsAgo === null
                ) {

                    return true;
                }


                return (
                    vertexIndex !==
                    this.vertexTwoTurnsAgo
                );


            /* ---------------------------------------------
               UNKNOWN RULE
               --------------------------------------------- */

            default:

                return true;
        }
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    setPolygon(polygon) {

        this.polygon = polygon;

        this.reset();
    }


    setJumpRatio(ratio) {

        ratio =
            Number(ratio);


        if (
            !Number.isFinite(ratio)
        ) {

            return;
        }


        /*
         * Keep the ratio within a sensible range.
         */

        this.jumpRatio =
            Math.max(
                0.01,
                Math.min(
                    0.99,
                    ratio
                )
            );
    }


    setRule(rule) {

        const validRules = [

            "any",

            "no-repeat",

            "no-adjacent",

            "no-two-back"

        ];


        if (
            validRules.includes(rule)
        ) {

            this.rule = rule;

        } else {

            this.rule = "any";
        }


        /*
         * Clear history because the new rule
         * should begin without restrictions
         * inherited from the previous one.
         */

        this.previousVertexIndex = null;

        this.vertexTwoTurnsAgo = null;
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.currentPoint = null;

        this.previousVertexIndex = null;

        this.vertexTwoTurnsAgo = null;

        this.iteration = 0;
    }


    /* =====================================================
       GETTERS
       ===================================================== */

    getCurrentPoint() {

        if (!this.currentPoint) {

            return null;
        }


        return {

            x: this.currentPoint.x,

            y: this.currentPoint.y
        };
    }


    getIteration() {

        return this.iteration;
    }


    getJumpRatio() {

        return this.jumpRatio;
    }


    getRule() {

        return this.rule;
    }


    getPreviousVertexIndex() {

        return this.previousVertexIndex;
    }


    getPolygon() {

        return this.polygon;
    }
}