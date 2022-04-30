const child_process = require('child_process')

let main = null

function ejecutar (archivo) {
    return new Promise((resolve) => {
        child_process.exec(`node ${archivo}`, function(err, result) {
            resolve(result)
        })
    })
}

ejecutar('contenedor-programa.js registro-conversiones txt bitcoin 2500').then((contenedorPrograma) => {
    main = contenedorPrograma
    console.log(main)
})
