const canvas=document.querySelector('canvas');
const gl=canvas.getContext('webgl')

const {mat4}=glMatrix

function getPoints(count){
    let points=[];

    for (let i = 0; i < count; i++) {
        const randomGen=()=>Math.random()*2-1;
        points.push(randomGen())
        points.push(randomGen())
        points.push(randomGen())
    }

    return points;
}

async function loadShaderAndRun(){
    const vertShader=await fetch("./Shaders/vert.vert");
    const fragShader=await fetch("./Shaders/frag.frag");
    run(await vertShader.text(),await fragShader.text())
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