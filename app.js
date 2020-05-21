var firebaseConfig = {
    apiKey: "AIzaSyCLri6ridbq9bp99EZWEztmjckw5HSSGQc",
    authDomain: "chatjs-c9f92.firebaseapp.com",
    databaseURL: "https://chatjs-c9f92.firebaseio.com",
    projectId: "chatjs-c9f92",
    storageBucket: "chatjs-c9f92.appspot.com",
    messagingSenderId: "203082738921",
    appId: "1:203082738921:web:bfe20927f4b55884e19478"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const botones = document.querySelector('#botones');
const nombreUsuario = document.querySelector('#nombreUsuario');
const contenidoProtegido = document.querySelector('#contenidoProtegido');
const formulario = document.querySelector('#formulario');
const inputChat = document.querySelector('#inputChat');

//si esta logeado y si no esta loegado

firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

        //esta logeado
        console.log(user);
        botones.innerHTML = `
        <button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesión</button>
        `;

        nombreUsuario.innerHTML = user.displayName;

        cerrarSesion();


        formulario.classList = 'input-group  py-3 fixed-bottom container';

        contenidoChat(user);


    } else {

        //no esta logeado
        console.log('no existe user');

        botones.innerHTML = `
        <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>
        `;


        iniciarSesion();
        nombreUsuario.innerHTML = 'Chat-js';

        contenidoProtegido.innerHTML = `
        <p class="text-center lead mt-5">Deber iniciar sesión</p>
        `;

        //no se muestra el formulario o barra de enviar mensaje

        formulario.classList = 'input-group  py-3 fixed-bottom container d-none';
    }
});


const contenidoChat = (user) => {


    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(inputChat.value);
        //limpia los espacios vacios
        if (!inputChat.value.trim()) {
            console.log('input vacio');
            return;
        }

        //guardar en la foreccion database de firebase
        firebase.firestore().collection('chat').add({
                texto: inputChat.value,
                uid: user.uid,
                fecha: Date.now()

            })
            .then(res => { console.log('mensaje guardado') })
            .catch(e => console.log(e))

        inputChat.value = '';


    });



    //leer mensajes de la base de datos

    //recorrer base de datos
    firebase.firestore().collection('chat').orderBy('fecha').onSnapshot(query => {
        //para que no se dupliquen los mensajes y toca limpiar
        contenidoProtegido.innerHTML = '';

        query.forEach(doc => {
            //documento de firebase = al id de usuario
            if (doc.data().uid === user.uid) {

                //mostramos en pantalla los mensajes guardados en firebase
                contenidoProtegido.innerHTML += `
                <div class="d-flex justify-content-end">
                <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                </div>
            `;
            } else {
                contenidoProtegido.innerHTML += `
                
                        <div class="d-flex justify-content-start">
                        <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
                        </div>
                
                `;
            }

            //el top es igual al alto de todo el scroll
            contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;


        })
    })



}


const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut();

    });
}

const iniciarSesion = () => {
    //dar click en el boton acceder
    const btnAcceder = document.querySelector('#btnAcceder');
    btnAcceder.addEventListener('click', async() => {

        console.log('click acceder');
        try {
            //habilitar popup de google
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);

        } catch (error) {
            console.log(error);
        }

    });
}