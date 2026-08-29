class ChaosRenderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        this.backgroundColor = "#05090c";

        this.pointColor = "#20d6a0";

        this.vertexColor = "#43e5b6";

        this.edgeColor = "#263944";

        this.pointSize = 1;

        this.displayWidth = 0;

        this.displayHeight = 0;

        this.resizeCanvas();
    }


    /* =====================================================
       RESIZE CANVAS
       ===================================================== */

    resizeCanvas() {

        const rect =
            this.canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;


        this.displayWidth =
            rect.width;

        this.displayHeight =
            rect.height;


        this.canvas.width =
            Math.round(
                rect.width * dpr
            );

        this.canvas.height =
            Math.round(
                rect.height * dpr
            );


        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =====================================================
       CLEAR CANVAS
       ===================================================== */

    clear() {

        this.ctx.save();


        /*
         * Reset the transform so the entire physical
         * canvas is cleared correctly on high-DPI screens.
         */

        this.ctx.setTransform(
            1,
            0,
            0,
            1,
            0,
            0
        );


        this.ctx.fillStyle =
            this.backgroundColor;


        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        this.ctx.restore();
    }


    /* =====================================================
       PREPARE NEW VISUALISATION
       ===================================================== */

    prepare(polygon) {

        this.resizeCanvas();

        this.clear();

        this.drawPolygon(polygon);
    }


    /* =====================================================
       DRAW POLYGON
       ===================================================== */

    drawPolygon(polygon) {

        if (!polygon) {

            return;
        }


        const vertices =
            polygon.getVertices();


        if (
            !vertices ||
            vertices.length === 0
        ) {

            return;
        }


        /*
         * Draw faint lines between the vertices.
         */

        this.ctx.save();

        this.ctx.strokeStyle =
            this.edgeColor;

        this.ctx.lineWidth =
            1;

        this.ctx.beginPath();


        this.ctx.moveTo(
            vertices[0].x,
            vertices[0].y
        );


        for (
            let i = 1;
            i < vertices.length;
            i++
        ) {

            this.ctx.lineTo(
                vertices[i].x,
                vertices[i].y
            );
        }


        this.ctx.closePath();

        this.ctx.stroke();

        this.ctx.restore();


        /*
         * Draw the actual vertices.
         */

        this.drawVertices(vertices);
    }


    /* =====================================================
       DRAW VERTICES
       ===================================================== */

    drawVertices(vertices) {

        this.ctx.save();


        for (
            let i = 0;
            i < vertices.length;
            i++
        ) {

            const vertex =
                vertices[i];


            /*
             * Outer circle.
             */

            this.ctx.beginPath();

            this.ctx.arc(
                vertex.x,
                vertex.y,
                5,
                0,
                Math.PI * 2
            );

            this.ctx.fillStyle =
                this.backgroundColor;

            this.ctx.fill();


            this.ctx.strokeStyle =
                this.vertexColor;

            this.ctx.lineWidth =
                1.5;

            this.ctx.stroke();


            /*
             * Centre point.
             */

            this.ctx.beginPath();

            this.ctx.arc(
                vertex.x,
                vertex.y,
                1.7,
                0,
                Math.PI * 2
            );

            this.ctx.fillStyle =
                this.vertexColor;

            this.ctx.fill();
        }


        this.ctx.restore();
    }


    /* =====================================================
       DRAW ONE GENERATED POINT
       ===================================================== */

    drawPoint(point) {

        if (!point) {

            return;
        }


        this.ctx.fillStyle =
            this.pointColor;


        this.ctx.fillRect(
            point.x,
            point.y,
            this.pointSize,
            this.pointSize
        );
    }


    /* =====================================================
       DRAW MULTIPLE POINTS
       ===================================================== */

    drawPoints(points) {

        if (
            !points ||
            points.length === 0
        ) {

            return;
        }


        this.ctx.fillStyle =
            this.pointColor;


        /*
         * Setting fillStyle once before the loop is
         * substantially faster when drawing hundreds
         * of thousands of points.
         */

        for (
            let i = 0;
            i < points.length;
            i++
        ) {

            const point =
                points[i];


            this.ctx.fillRect(
                point.x,
                point.y,
                this.pointSize,
                this.pointSize
            );
        }
    }


    /* =====================================================
       DRAW BATCH
       ===================================================== */

    renderBatch(points) {

        this.drawPoints(points);
    }


    /* =====================================================
       REDRAW COMPLETE RESULT
       ===================================================== */

    render(points, polygon) {

        this.resizeCanvas();

        this.clear();

        this.drawPolygon(polygon);

        this.drawPoints(points);
    }


    /* =====================================================
       POINT SIZE
       ===================================================== */

    setPointSize(size) {

        size =
            Number(size);


        if (
            !Number.isFinite(size)
        ) {

            return;
        }


        this.pointSize =
            Math.max(
                0.5,
                Math.min(
                    5,
                    size
                )
            );
    }


    /* =====================================================
       COLOURS
       ===================================================== */

    setPointColor(color) {

        this.pointColor =
            color;
    }


    setVertexColor(color) {

        this.vertexColor =
            color;
    }


    /* =====================================================
       DIMENSIONS
       ===================================================== */

    getWidth() {

        return this.displayWidth;
    }


    getHeight() {

        return this.displayHeight;
    }


    /* =====================================================
       DOWNLOAD IMAGE
       ===================================================== */

    download(filename = "chaos-game.png") {

        const link =
            document.createElement("a");


        link.download =
            filename;


        link.href =
            this.canvas.toDataURL(
                "image/png"
            );


        link.click();
    }
}