var matrixSize = 0
var aMatrix = []
var bMatrix = []
var lMatrix = []
var uMatrix = []
var pMatrix = []
var cMatrix = []
var xMatrix = []

//this function creates the A matrix for the user to input values into
function createAMatrix() {
    var mat = document.getElementById("amatrix")
    //remove all nodes from matrix to start over creating it
    while (mat.firstChild) {
        mat.removeChild(mat.firstChild);
    }
    //update CSS grid template in order to accomodate new size of matrix
    var styleString = ""
    for(var i = 0; i < matrixSize; ++i) {
        if(i === matrixSize - 1) {
            styleString = styleString + "1fr"
        }
        else {
            styleString = styleString + "1fr "
        }
    }
    mat.style.gridTemplateRows = styleString
    mat.style.gridTemplateColumns = styleString
    //fill up matrix with input elements for user to fill in
    for(var i = 0; i < matrixSize; ++i) {
        for(var j = 0; j < matrixSize; ++j) {
            var input = document.createElement("input")
            input.type = "number"
            input.style.width = "100%"
            input.style.height = "100%"
            input.style.fontSize = `${Math.max(12, 35 - (matrixSize * 3))}px`
            mat.appendChild(input)
        }
    }
}

//this function creates the b matrix for the user to enter values into
function createBMatrix() {
    var mat = document.getElementById("bmatrix")
    //remove all nodes from matrix to start over creating it
    while (mat.firstChild) {
        mat.removeChild(mat.firstChild);
    }
    //update CSS grid template in order to accomodate new size of matrix
    var styleString = ""
    for(var i = 0; i < matrixSize; ++i) {
        if(i === matrixSize - 1) {
            styleString = styleString + "1fr"
        }
        else {
            styleString = styleString + "1fr "
        }
    }
    mat.style.gridTemplateRows = styleString
    //fill up matrix with input elements for user to fill in
    for(var i = 0; i < matrixSize; ++i) {
        var input = document.createElement("input")
        input.type = "number"
        input.style.width = "100%"
        input.style.height = "100%"
        input.style.fontSize = `${Math.max(12, 35 - (matrixSize * 3))}px`
        mat.appendChild(input)
    }
}


//fill in A and b matrices
function fillInMatrices() {
    //reset all matrix variables
    aMatrix = []
    bMatrix = []
    lMatrix = []
    uMatrix = []
    pMatrix = []
    cMatrix = []
    xMatrix = []
    //get elements of A matrix from user input
    var mat1 = document.getElementById("amatrix")
    var temp = []
    for(var i = 0; i < mat1.children.length; ++i) {
        temp.push(parseFloat(mat1.children[i].value))
        if((i+1) % matrixSize === 0) {
            aMatrix.push(temp)
            temp = []
        }
    }
    //get elements of b matrix from user input
    var mat2 = document.getElementById("bmatrix")
    for(var i = 0; i < mat2.children.length; ++i) {
        bMatrix.push(parseFloat(mat2.children[i].value))
    }
    //set up permutation matrix
    for(var i = 0; i < aMatrix.length; ++i) {
        var row = []
        for(var j = 0; j < aMatrix.length; ++j) {
            if(i === j) {
                row.push(1)
            }
            else {
                row.push(0)
            }
        }
        pMatrix.push(row)
    }
}

//check matrices and make sure all inputs are valid
function verifyMatices() {
    var mat1 = document.getElementById("amatrix")
    var mat2 = document.getElementById("bmatrix")
    var valid = true
    for(var i = 0; i < mat1.children.length; ++i) {
        if(isNaN(parseFloat(mat1.children[i].value))) {
            mat1.children[i].style.borderColor = "red"
            valid = false
        }
        else {
            mat1.children[i].style.borderColor = "#dbdbdb"
        }
    }
    for(var i = 0; i < mat2.children.length; ++i) {
        if(isNaN(parseFloat(mat2.children[i].value))) {
            mat2.children[i].style.borderColor = "red"
            valid = false
        }
        else {
            mat2.children[i].style.borderColor = "#dbdbdb"
        }
    }
    return valid
}

//eliminate column of A matrix and make corresponding change to b matrix as well
function eliminateColumn(col) {
    //find row with maximum value in column col to perform row swapping
    var max = Math.abs(aMatrix[col][col])
    var row = -1
    for(var i = col; i < aMatrix.length; ++i) {
        if(Math.abs(aMatrix[i][col]) > max) {
            max = Math.abs(aMatrix[i][col])
            row = i
        }
    }
    //if the row with maximum value at col isn't the current pivot, swap that row with the current pivot
    if(row !== -1) {
        var temp = aMatrix[row]
        aMatrix[row] = aMatrix[col]
        aMatrix[col] = temp
        temp = pMatrix[row]
        pMatrix[row] = pMatrix[col]
        pMatrix[col] = temp
    }
    //eliminate each entry in rows below pivot element
    for(var i = col+1; i < aMatrix.length; ++i) {
        var pivotEl = aMatrix[col][col]
        var currEl = aMatrix[i][col]
        var multiplier = currEl/pivotEl
        for(var j = col; j < aMatrix[i].length; ++j) {
            if(j === col) {
                aMatrix[i][j] = multiplier
            }
            else {
                aMatrix[i][j] = aMatrix[i][j] - (aMatrix[col][j] * multiplier)
            }
        }
    }
}

//assign L and U matrices for PA = LU factorization
function assignLU() {
    //assign L matrix and U matrix to current A matrix
    for(var i = 0; i < aMatrix.length; ++i) {
        lMatrix[i] = aMatrix[i].slice()
        uMatrix[i] = aMatrix[i].slice()
    }
    //set up correct structure for L matrix
    for(var i = 0; i < lMatrix.length; ++i) {
        for(var j = 0; j < lMatrix[i].length; ++j) {
            if(j > i) {
                lMatrix[i][j] = 0
            }
            else if(j === i) {
                lMatrix[i][j] = 1
            }
        }
    }
    //set up correct structure for U matrix
    uMatrix = [...aMatrix]
    for(var i = 0; i < uMatrix.length; ++i) {
        for(var j = 0; j < uMatrix[i].length; ++j) {
            if(j < i) {
                uMatrix[i][j] = 0
            }
        }
    }
}

//permute b matrix to match permutation matrix
function permuteB() {
    //create temporary array that will be assigned to b after adding elements in permuted order
    var temp = []
    //go through each row of permutation matrix and find index of 1 in that row, then add b matrix element at that index to temp array
    for(var i = 0; i < pMatrix.length; ++i) {
        var index = pMatrix[i].indexOf(1)
        temp.push(bMatrix[index])
    }
    bMatrix = temp
}

//solve Lc = Pb and then Ux = c
function solve() {
    //solve Lc = Pb (b matrix is already permuted)
    cMatrix = [...bMatrix]
    for(var i = 0; i < lMatrix.length; ++i) {
        for(var j = i-1; j >= 0; --j) {
            cMatrix[i] = cMatrix[i] - lMatrix[i][j] * cMatrix[j]
        }
    }
    //solve Ux = c
    xMatrix = [...cMatrix]
    for(var i = uMatrix.length - 1; i >= 0; --i) {
        for(var j = i+1; j < uMatrix[i].length; ++j) {
            xMatrix[i] = xMatrix[i] - uMatrix[i][j] * xMatrix[j]
        }
        xMatrix[i] = xMatrix[i] / uMatrix[i][i]
    }
}

//display x (answer) in page
function showX() {
    var el = document.getElementById("x-matrix")
    //remove answers from last calculation from page
    while(el.getElementsByTagName("h3").length > 1) {
        var children = el.getElementsByTagName("h3")
        el.removeChild(children[1])
    }
    //remove infinitely many/no solutions answer paragraph from page
    if(el.getElementsByTagName("p").length > 0) {
        var children = el.getElementsByTagName("p")
        el.removeChild(children[0])
    }
    var hasNaN = false
    //if any values in x matrix are NaN, system has no or infinitely many solutions
    for(var i = 0; i < xMatrix.length; ++i) {
        //if we have no or infinitely many solutions, output that to page and return
        if(isNaN(xMatrix[i]) || xMatrix[i] === Number.POSITIVE_INFINITY || xMatrix[i] === Number.NEGATIVE_INFINITY) {
            var ans = document.createElement("p")
            ans.innerHTML = "SYSTEM HAS NO UNIQUE SOLUTION - SYSTEM IS EITHER DEPENDENT (INFINITELY MANY SOLUTIONS), OR INCONSISTENT (NO SOLUTION)"
            el.appendChild(ans)
            hasNaN = true
            break
        }
    }
    //if we have a single unique solution, output x matrix to page
    if(!hasNaN) {
        for(var i = 0; i < xMatrix.length; ++i) {
            var ans = document.createElement("h3")
            ans.innerHTML = `x<sub>${i}</sub> = ${Math.round((xMatrix[i] + Number.EPSILON) * 1000) / 1000}`
            el.appendChild(ans)
        }
    }
    el.style.display = "block"
}


//whenever user changes matrix size input, udpate matrix
var el = document.getElementById("matrix-size")
el.addEventListener("input", (ev) => {
    ev.preventDefault()
    var size = parseInt(el.value)
    //only matrices between size 2x2 to 10x10 are supported
    if(isNaN(size) || size < 2 || size > 10) {
        document.getElementById("matrix-size-error").style.display = "block"
    }
    else {
        //if user has entered valid matrix size, display matrix labels and solve button
        var labels = document.getElementsByClassName("matrix-label")
        labels[0].style.display = "block"
        labels[1].style.display = "block"
        var btn = document.getElementById("solve")
        btn.style.display = "block"
        //assign global variable matrixSize to size
        matrixSize = size
        //hide matrix size error
        document.getElementById("matrix-size-error").style.display = "none"
        document.getElementById("x-matrix").style.display = "none"
        createAMatrix()
        createBMatrix()
    }
})

//click handler for solve button
var btn = document.getElementById("solve")
btn.addEventListener("click", () => {
    if(verifyMatices()) {
        document.getElementById("matrix-entries-error").style.display = "none"
        fillInMatrices()
        for(var i = 0; i < aMatrix.length-1; ++i) {
            eliminateColumn(i)
        }
        assignLU()
        permuteB()
        solve()
        showX()
    }
    else {
        document.getElementById("matrix-entries-error").style.display = "block"
    }
})