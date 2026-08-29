class Polygon {

    constructor(
        vertexCount = 3,
        width = 800,
        height = 600,
        padding = 45
    ) {

        this.vertexCount =
            Math.max(
                3,
                Math.floor(vertexCount)
            );

        this.width =
            width;

        this.height =
            height;

        this.padding =
            padding;

        this.vertices = [];


        this.generateVertices();
    }


    /* =====================================================
       GENERATE POLYGON VERTICES
       ===================================================== */

    generateVertices() {

        this.vertices = [];


        const centreX =
            this.width / 2;

        const centreY =
            this.height / 2;


        /*
         * Use the smaller canvas dimension so the
         * complete polygon remains visible.
         */

        const radius =
            Math.max(
                1,
                Math.min(
                    this.width,
                    this.height
                ) / 2 - this.padding
            );


        /*
         * Starting at -PI / 2 places the first vertex
         * at the top of the canvas.
         *
         * This gives the triangle the familiar
         * Sierpiński orientation.
         */

        const startingAngle =
            -Math.PI / 2;


        const angleStep =
            (
                Math.PI * 2
            ) /
            this.vertexCount;


        for (
            let i = 0;
            i < this.vertexCount;
            i++
        ) {

            const angle =
                startingAngle +
                i * angleStep;


            const x =
                centreX +
                Math.cos(angle) *
                radius;


            const y =
                centreY +
                Math.sin(angle) *
                radius;


            this.vertices.push({

                x: x,

                y: y,

                index: i,

                angle: angle

            });
        }


        return this.vertices;
    }


    /* =====================================================
       CHANGE NUMBER OF VERTICES
       ===================================================== */

    setVertexCount(count) {

        count =
            Math.floor(
                Number(count)
            );


        if (
            !Number.isFinite(count)
        ) {

            return;
        }


        this.vertexCount =
            Math.max(
                3,
                count
            );


        this.generateVertices();
    }


    /* =====================================================
       CHANGE CANVAS SIZE
       ===================================================== */

    setDimensions(
        width,
        height
    ) {

        width =
            Number(width);

        height =
            Number(height);


        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height)
        ) {

            return;
        }


        this.width =
            Math.max(
                1,
                width
            );


        this.height =
            Math.max(
                1,
                height
            );


        this.generateVertices();
    }


    /* =====================================================
       SET PADDING
       ===================================================== */

    setPadding(padding) {

        padding =
            Number(padding);


        if (
            !Number.isFinite(padding)
        ) {

            return;
        }


        this.padding =
            Math.max(
                0,
                padding
            );


        this.generateVertices();
    }


    /* =====================================================
       GET VERTICES
       ===================================================== */

    getVertices() {

        return this.vertices;
    }


    /* =====================================================
       GET ONE VERTEX
       ===================================================== */

    getVertex(index) {

        if (
            index < 0 ||
            index >= this.vertices.length
        ) {

            return null;
        }


        return this.vertices[index];
    }


    /* =====================================================
       GET RANDOM VERTEX
       ===================================================== */

    getRandomVertex() {

        if (
            this.vertices.length === 0
        ) {

            return null;
        }


        const index =
            Math.floor(
                Math.random() *
                this.vertices.length
            );


        return this.vertices[index];
    }


    /* =====================================================
       GET RANDOM VERTEX INDEX
       ===================================================== */

    getRandomVertexIndex() {

        if (
            this.vertices.length === 0
        ) {

            return -1;
        }


        return Math.floor(
            Math.random() *
            this.vertices.length
        );
    }


    /* =====================================================
       CENTRE
       ===================================================== */

    getCentre() {

        return {

            x: this.width / 2,

            y: this.height / 2

        };
    }


    /* =====================================================
       NUMBER OF VERTICES
       ===================================================== */

    getVertexCount() {

        return this.vertexCount;
    }


    /* =====================================================
       DIMENSIONS
       ===================================================== */

    getWidth() {

        return this.width;
    }


    getHeight() {

        return this.height;
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.generateVertices();
    }
}