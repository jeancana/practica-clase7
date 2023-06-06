import express from "express";

// levantado el Servidor con Express -->> esto siempre se repite asi  
const app = express()

//indicandole a Express que puede recibir archivos del Front que vengan en formato json ----> atraves de un middelware
// Nota: esto siempre va y se debe colocar 
// IMPORTANTE: los datos que vienen por URL Params y QUERY Params llegan del Front formarto String .... pero cuando viene por el BODY son enviandos en formato json
app.use(express.json())


// Luego de levantado lo pongo a correr con el siguiente comando en la terminal : node --watch src/app.js

let users = [
    { id: 1, name: 'jorge', age: 21 }, 
    { id: 2, name: 'Ana', age: 22 },
    { id: 3, name: 'Pedro', age: 28 },
    { id: 4, name: 'Cheo', age: 32 }
]

const cursos = [
    { id: 1, name: 'Backend', teacher: 'katherine' },
    { id: 1, name: 'JAVA', teacher: 'Michell' },
    { id: 1, name: 'JavaScritp', teacher: 'Juliany' },
    { id: 1, name: 'SQL', teacher: 'Jean' }
]

// 1. --------------- APREDIENDO LOS CODIGOS DE ESTADO (SON PARTE DE LA RESPUESTA DEL SERVIDOR) ---------//
// Se puede consulta en internet como "http status code cats" (uno muy bueno con ejemplo de gatitos ayuda mucho)

// Express cuando yo como desarrollador backend no le indico nada a Express  el siempre va a reponder por defecto codigo  200:ok (se le debe indicar agregando el endpoint --->  res.status('aca va el codigo) y lo demas ....

// NOTA IMPORTANTE ES NUESTRA RESPONSABILIDAD COLOCAR EL CODIGO DE ESTADO SIEMPRE

// ......................--------------- (1) APLICANDO EL METODO GET (del CRUD es el Read ) ------------------.........// 

// 1.1 http://localhost:8080 --> endpoint Ruta Raiz + codigo de estatus + usando la comunicacion por APIREST que es JSON no se usa el .send('ok') sino .json({ message: 'Server Ok'})

app.get('/', (req, res) => res.status(200).json({ message: 'Server OK' }))
    
// 1.2 http://localhost:8080/users --> endpoint RUTA users - para que me devuelva los usuario de la BD 
app.get('/users', (req, res) => { 
     res.status(200).json({ users })
})
 
// 1.3 http://localhost:8080/cursos --> endpoint RUTA cursos - para que me devuelva la lista de cursos de la BD 
app.get('/cursos', (req, res) => {
    res.status(200).json({ cursos })
})

// 1.4 http://localhost:8080/users2 --> endpoint RUTA users2 - para que me devuelva los usuario de la BD hasta el Limit que yo asigne usando la HOF '.Slice' 
app.get('/users2', (req, res) => {
    const limit = req.query.limit
    if (limit > users.length) {
        // siempre poner el return para que la terminal no explote 
        return res.status(400).json({ error: 'limit is invalid'})
    } 
    res.status(200).json({ users: users.slice(0, limit) })
})

// 2. --------------- Descargando el "thunderclient" ---------//
// fuimos a las aplicaciones de VS CODE y descargamos el thunderclient - ahora utilizamos esta aplicacion y necesitamos usar mas el browser para verificar los endpoints

// Para cortar y que el servidor para de funcionar escribir en teclado : "control + c" (la terminal lo entiende y corta el servidor)


// 3. --------------- DISEÑANDO UNA API(GESTOR DE CONSULTAS) DEL TIPO 'REST' ----> APIREST ---------//

// 3.1---  METODOS QUE SE SIEMRPE SE USARAN EN UN API DEL TIPO REST (APIREST) -----

// 3.1.1 METODO GET = SE USA PARA LEER/CONSULTAR INFO EN LA BD/VER --> en CRUD es el READ ----> ejemplo: consultar el catalogo de productos/leer la lista de usuarios en la BD 

// 3.1.2 METODO POST = SE USA PARA CREAR/REGISTRAR/GRABAR INFO EN LA BD --> en CRUD es el CREATE ----> ejemplo: registrarme en una base datos/ crear un usuario en una aplicacion 
// NOTA IMPORTANTE: nunca usar el metodo POST para que el cliente haga consultas a la BD  // ---- MALO MALO NO HACERLO -- es mala practica  

// 3.1.3 METODO PUT = SE USA PARA ACTUALIZAR INFO EN LA BD --> en CRUD es el UPDATE 

// 3.1.3 METODO DELETE = SE USA PARA BORRAR LA INFO EN LA BD --> en CRUD es el DELETE


// .............--------------- (4) APLICANDO EL METODO POST (del CRUD es el Create)  -------------------.........// 


// 4.1 Reciendo los Datos SIMULANDO UN FORMULARIO y Agregando un Nuevo usuario a la BD a traves del metodo POST
// --- los datos llegan en formato json 

// RECIBIENDO LOS DATOS DE LA FORMA CORRECTA QUE A TRAVES DEL .body y NO por query params y No por URL params
//NOTA: LA BUENA PRACTICA es recibirlo por el .body cuando es un POST  

// POST > http://localhost:8080/users -- agrengando nuevo usuario 
app.post('/users', (req, res) => {
    
    // para recibir los datos por body
    const { id, name, age } = req.body

    // HACIENDO LA VALIDACION -->  en caso no recibir los datos completos en el json enviado del front 
    if (!id || !name || !age) {
        return res.status(400).json({ error: 'some fields are required'})
    }
    // parsenado el "id:" y el "Age:" para que puedan ser grabados como Enteros y no como String al momento de hacer el POST
    const usersCreated = { id: parseInt(id), name, age: parseInt(age)}
    // Haciendo Push (HOF) y ingresando el nuevo usuario al array de objetos " const users" 
    users.push(usersCreated)

    // generando la respuesta del metodo Post userCreated con su status code
    res.status(201).json({ message: 'User Created!', data: usersCreated })
})

// ---- IMPORTANTE ESTO ES LA MALA PRACTICA -- RECIBIR LOS DATOS DE UN POST POR QUERY PARAMS 
//http://localhost:8080/users2?id=5&name=NuevoUsuario&age=45 --> endpoint RUTA users - Agregando un Nuevo usuario a la BD a traves del metodo "POST"


// .............--------------- (5) APLICANDO EL METODO PUT (del CRUD es el Update)  -------------------.........// 

// 5.1 Actualizando un usuario de la base de datos
// Para actualizar se necesitan 2 datos (1- A quien voy a actualizar "'/users/:id'" y que cosa voy actualizar                " const newData = req.body" )

app.put('/users/:id', (req, res) => { 
    
    // Validando que el ID exista dentro del Array -recibiendo el id a traves de URL params - esto es A quien voy a actualizar "'/users/:id'"
    const id = req.params.id

    // esto es  que cosa voy actualizar - " const newData = req.body"
    const newData = req.body
    // Encontrando el usuario que quiero actualizar a traves de ID usando la HOF .find
    const user = users.find(item => item.id == id)
    
    // NO ENTIENDO BIEN PARA QUE SER USA EL FINDINDEX EN ESTE CASO TENGO QUE ESTUDIARLO 
    const userIndex = users.findIndex(item => item.id == id)
    // Usan el Spread Operator HOF para hacer las actualizaciones del objeto (el objeto es el usuario ) dentro del array users 
    user[userIndex] = {
        ...user,
        ...newData
    } 
    res.status(200).json({ message: 'User Update! por Url + body ' })
})

// .............--------------- (6) APLICANDO EL METODO DELETE (del CRUD es el Delete)  -------------------.........// 


// 6.1 Borrando un usuario de la base de datos a traves de su id 
// El id para el Metodo DELETE se recibe por URL params ----- ESTA ES LA BUENA PRACTICA ------ http://localhost:8080/users/2

app.delete('/users/:id', (req, res) => { 

    // Nota: se deben hacer las validaciones necesarias para que el codigo no se rompa -- Ejemplo : el id debe existir en el array para poder borrarlo etc ...
    const id = req.params.id 
    // meto todo dentro de la variable 'users' uso la HOF .filter para la borrar el usurio de la base de datos 
    users = users.filter(item => item.id != id)
    console.log(users)
    // generando la respuesta del metodo Delete con su status code
    res.status(200).json({ message: 'User Deleted! por Url ' })
})

// 6.2 Borrando un usuario de la base de datos a traves de su id  -- http://localhost:8080/users?id=2
// El id para el Metodo DELETE se recibe por Query params

app.delete('/users', (req, res) => {

    // Igualmente se debe hacer la validaciones necesesarias -----
    const id = req.query.id
    // meto todo dentro de la variable 'users' uso la HOF .filter para la borrar el usurio de la base de datos 
    users = users.filter(item => item.id != id)
    console.log(users)
    // generando la respuesta del metodo Delete con su status code
    res.status(200).json({ message: 'User Deleted! por query' })
})

// 6.3 Borrando un usuario de la base de datos a traves de su id 
// El id para el Metodo DELETE se recibe por BODY 

app.delete('/users', (req, res) => {

    // Igualmente se debe hacer la validaciones necesesarias -----  por body { "id": 4 }
    // Se desestructura con { id } para recibirlo por BODY
    const {id} = req.body
    // meto todo dentro de la variable 'users' uso la HOF .filter para la borrar el usurio de la base de datos 
    users = users.filter(item => item.id != id)
    console.log(users)
    // generando la respuesta del metodo Delete con su status code
    res.status(200).json({ message: 'User Deleted! por body' })
}) 


// ----- despues reviso en el browser si funciona usando la siguiente sentencia: localhost:8080 --> con esto verifico si funciona la ruta RAIZ
app.listen(8080, () => console.log('Server Up'))

/*

Buenas Practicas para GET/POST/PUT/DELETE

1. Cuando es GET los datos se reciben del cliente por QUERY o URL params
2. Cuando es POST los datos se reciben del cliente por BODY
3. Cuando es PUT los datos se reciben del cliente por "URL params + BODY" -- ambos juntos 
4. Cuando es DELETE los datos se reciben del cliente por URL params

*/