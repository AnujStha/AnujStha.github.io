const canvas=document.querySelector('canvas');
const gl=canvas.getContext('webgl')

const {mat4}=glMatrix

function getPoints(count){
    let points=[];

    for (let i = 0; i < count; i++) {
        const randomGen=()=>Math.random()-0.5;
        points.push(randomGen())
        points.push(randomGen())
        points.push(randomGen())
    }

    return points;
}

async function loadShaderAndRun(){
    // const vertShader=await fetch("./Shaders/vert.vert");
    // const fragShader=await fetch("./Shaders/frag.frag");
    // run(await vertShader.text(),await fragShader.text())

    run(
        `
        precision mediump float;

        attribute vec3 position;
        varying vec3 vColor;

        void main() {
            gl_Position = vec4(position, 1);
            gl_PointSize=1.0;
            vColor=vec3(position.xy,1);
        }
        `,
        `
        precision mediump float;

        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
        `
    )
}

function run(vert,frag){
    vertexData=getPoints(1e5)

    const positionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexData),gl.STATIC_DRAW)

    const vertexShader=gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vert);
    gl.compileShader(vertexShader);
    console.log(gl.getShaderInfoLog(vertexShader).toString());

    const fragShader=gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader,frag);
    gl.compileShader(fragShader);
    console.log(gl.getShaderInfoLog(fragShader));

    const program= gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragShader);

    gl.linkProgram(program)

    const positionLocation=gl.getAttribLocation(program,"position")
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
    gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0)

    gl.useProgram(program)
    gl.drawArrays(gl.POINTS,0,vertexData.length/3)
    console.log(vertexData[5])
}

loadShaderAndRun()