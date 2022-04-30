const args = process.argv
const fs = require('fs')
const http = require("https")

const nombreArchivo = args[2]
const extensionArchivo = args[3]
const indicadorConvertir = args[4]
const dineroConvertir = args[5]

const crearArchivo = (plantilla) => {
    fs.readFile('registro-conversiones.txt', 'utf8', (err, data) => {
        fs.writeFile(`${nombreArchivo}.${extensionArchivo}`, data + plantilla, 'utf8', () => {
            console.log(`El detalle de su archivo creado es: \n ${nombreArchivo}.${extensionArchivo}` + plantilla)
        })
    })
}

const consumirApi = async () => {
    return new Promise ((resolve, reject) => {
        const options = {
            "method": "GET",
            "hostname": "mindicador.cl",
            "port": null,
            "path": "/api",
            "headers": {
                "Content-Length": "0"
            }
        }

        const req = http.request(options, function (res) {
            const chunks = []
        
            res.on("data", function (chunk) {
                chunks.push(chunk)
            });
            
            res.on("end", function () {
                const respuestaApi = Buffer.concat(chunks)
                resolve(JSON.parse(respuestaApi))
            })
        })
        req.end()
    })
}

const main = async () => {

    // llamar a la api
    const respuestaApi = await consumirApi()
    // crear const a partir de esos valores 
    const valoresIndicador = respuestaApi[indicadorConvertir]
    const fecha = valoresIndicador.fecha
    const valor = valoresIndicador.valor
    const nombre = valoresIndicador.nombre
    
    // Hacer calculo de valor final de la conversión
    const resultado = dineroConvertir * valor

    // Si el llamado es exitoso, crear plantilla
    const plantilla = `\n A la fecha: ${fecha} \n Fue realizada la cotización con los siguientes datos: \n Cantidad de pesos a convertir: ${dineroConvertir} \n Convertido a ${nombre}, dando un total de: ${resultado} \n`

    // Llamando a la función que crea la plantilla
    crearArchivo(plantilla)
}

main().then(() => {
    console.log('¡Conversión registrada con éxito!')
}).catch(() => {
    console.log(err)
})
