/* Funcion anonima que se autoejecuta cuando el doom esta listo */
;(function() {
    /* Variables "globales" al menos dentro del ambito (scope) de la funcion
    anonima (leer linea uno)*/
    var contenedor_de_listas;  /* bloque que contiene a todas las listas */
    var creador_de_listas;  /* menu pa crear listas, contenedor del 'creador' */
    var creador;  /* boton que crea las listas */

    /* Listener para cuando la página terminom de cargar */
    window.addEventListener('load', function() {
        contenedor_de_listas = document.getElementById('contenedor-de-listas');
        creador_de_listas = document.getElementById('creador-de-listas');
        creador = document.getElementById('creador');

        creador.addEventListener('click', function () {
            var nueva_lista = crear_nueva_lista();
            var menu = agregar_menu_de_titulo_en(nueva_lista);

            var tarjeta_titulo = menu[0];
            var input_titulo = menu[1];
            var boton_guardar = menu[2];
            var boton_cancelar = menu[3];

            focus_en(input_titulo);
            guardar_titulo_de_lista_con(boton_guardar, tarjeta_titulo, input_titulo);
            cancelar_creacion_de_lista_con(boton_cancelar, nueva_lista);
        });
    });

    /* Funciones empleadas */
        /* Java script tiene la funcion insertBefore para añadir un elelemto antes
        de otro, pero no tiene un funcion insertAfter para añadir un elemenmto
        despues de otro por eso definimos nuestra propia funcion insertAfter */
        function insertAfter(nuevo_nodo, nodo_de_referencia) {
            // ubicamos el contenedor del elemento de referencia
            var contenedor = nodo_de_referencia.parentNode;

            // si el nodo de referencia es el ultimo elemento del contenedor
            if(parent.lastchild == nodo_de_referencia) {
                // añadimos el nuevo nodo al final del contenedor
                contenedor.appendChild(nuevo_nodo);
            }
            else {
                // en caso contrario, hallamos el nodo siguiente al nodo de referencia
                var nodo_siguiente = nodo_de_referencia.nextSibling;

                // y añadimos el nuevo nodo antes del nodo siguiente al nodo de refernecia
                contenedor.insertBefore(nuevo_nodo, nodo_siguiente);
            }
        };

        function crear_nueva_lista(){
            /* Agregar una nueva lista */
                var nueva_lista = document.createElement("div");

                /*
                    Las declaraciones 1 y 2 son equivalentes:

                    1) nueva_lista.setAttribute("class","lista");
                    2) nueva_lista.classList.add('lista');

                    vamos a usar la declaracion 2.
                */

                nueva_lista.classList.add('lista');

                /* añade la nueva lista antes del creador de listas,
                despues de la ultima lista creada */
                // contenedor_de_listas.insertBefore(nueva_lista, creador_de_listas);

                /* añade la nueva lista despues del creador de listas,
                antes de la ultima lista creada */
                insertAfter(nueva_lista, creador_de_listas);


                /* ocultamos el creeador de listas hasta que la nueva lista se
                haya guardado */
                creador_de_listas.classList.add('oculto');

                /* regresamos la lista creada */
                return nueva_lista;
        };

        function agregar_menu_de_titulo_en(lista){
            /* Añadimos el menu para añadir un titulo en la lista y guardar o
            borrar la lista */
                lista.innerHTML = "\
                <div class=\"tarjeta\">\
                    <input id=\"titulo\" class=\"titulo con-borde borde-gris\" type=\"text\" placeholder=\"Título...\">\
                    <div class=\"accion\">\
                    <button id=\"guardar\" class=\"boton verde-claro\">Guardar</button>\
                    <button id=\"cancelar\" class=\"boton gris\">Cancelar</button>\
                    </div>\
                </div>\
                ";

                var tarjeta_titulo = lista.querySelector('.tarjeta:first-child');
                var input_titulo = document.getElementById('titulo');
                var boton_guardar = document.getElementById('guardar');
                var boton_cancelar = document.getElementById('cancelar');

            /* retornamos un arraglo con los elementos
            'tarjeta titulo', 'input titulo', 'boton guardar' y 'boton cancelar'
            en ese orden */
                return [tarjeta_titulo, input_titulo, boton_guardar, boton_cancelar];
        };

        function focus_en(input) {
            /*
                Hacer focus en un elemento input inmediatamente despues de
                crearlo.

                Sin el timer (setTimeout) el input no funciona :( un bug en
                algunos navegadores.

                http://stackoverflow.com/a/1096938
            */
            window.setTimeout(function () {
                input.focus();
            }, 0);
        };

        function guardar_titulo_de_lista_con(boton, tarjeta, input){
            boton.addEventListener('click', function () {
                var titulo_texto = input.value;

                /* Prevenimos la creacion de una lista sin titulo */
                if(titulo_texto != "") {
                    /* rescribimos el HTML interno de la tarjeta de titulo con el
                    titulo de la nueva lista */
                    tarjeta.innerHTML = "<h1 class=\"titulo\">" + titulo_texto + "</h1>";

                    /* Cuando la nueva lista ha sido creada aparece neuvamente el
                    menu creador de listas */
                    creador_de_listas.classList.remove('oculto');

                    /* añadimos el menu creador de tarjetas */
                    lista_actual = tarjeta.parentElement;
                    actualizar_menu_creador_de_tarjetas_en(lista_actual);
                }
                /* si el titulo esta vacio añadimos un mensaje de error */
                else {
                    var error_text = tarjeta.querySelector('.error-text');
                    if(error_text == null) {
                        error_text = document.createElement('div');
                        error_text.classList.add('error-text');
                        error_text.innerText = 'Escriba algun título para esta lista antes de guardarla';
                        tarjeta.insertBefore(error_text, boton.parentElement);
                    }
                }
            })
        };

        function cancelar_creacion_de_lista_con(boton, lista){
            boton.addEventListener('click', function () {
                /* la lista se elimina */
                lista.remove();
                /* y el menu creador de listas aparece nuevamente */
                creador_de_listas.classList.remove('oculto');
            })
        };

        function actualizar_menu_creador_de_tarjetas_en(lista){
            /* El menu creador de tarjetas debe de ir en la ultima tarjeta */
            var ultima_tarjeta = lista.querySelector('.tarjeta:last-child');

            /* Creamos menu */
            var creador_de_tarjetas = document.createElement('a');
            creador_de_tarjetas.classList.add('creador-de-tarjetas');
            creador_de_tarjetas.innerText = "Añadir nueva tarjeta";

            /* Añadimos el creador de tarjetas al final de la ultima tarjeta */
            ultima_tarjeta.appendChild(creador_de_tarjetas);

            creador_de_tarjetas.addEventListener('click', function(){
                var nueva_tarjeta = crear_nueva_tarjeta_en(lista, creador_de_tarjetas);

                var menu = agregar_menu_de_contenido_en(nueva_tarjeta);
                input_texto = menu[0];
                boton_guardar = menu[1];
                boton_cancelar = menu[2];

                focus_en(input_texto);
                guardar_tarjeta_con(boton_guardar, input_texto, creador_de_tarjetas, nueva_tarjeta);
                cancelar_creacion_de_tarjeta_con(boton_cancelar, creador_de_tarjetas, nueva_tarjeta);
            });
        };

        function crear_nueva_tarjeta_en(lista, creador){
            /* ocultamos el creador */
                creador.classList.add('oculto');

            /* Agregar una nueva lista */
                var nueva_tarjeta = document.createElement('div');
                nueva_tarjeta.classList.add('tarjeta');
                lista.appendChild(nueva_tarjeta);

                /* regresamos la tarjeta creada */
                return nueva_tarjeta;
        };

        function agregar_menu_de_contenido_en(tarjeta){
            /* insertamos el HTML para el menu de contenido y para guardar o
            borrar la tarjeta,
            usamos el div con contenteditable="true" por que por alguna razon
            los 'textarea' no aceptan multiples lineas :(
            */
                tarjeta.innerHTML = "\
                <div contenteditable=\"true\" class=\"texto con-borde borde-gris\"></div>\
                <div class=\"accion\">\
                <button class=\"boton boton-guardar verde-claro\">Guardar</button>\
                <button class=\"boton boton-cancelar gris\">Cancelar</button>\
                ";

                var input_texto = tarjeta.querySelector('.texto');
                var boton_guardar = tarjeta.querySelector('.boton-guardar');
                var boton_cancelar = tarjeta.querySelector('.boton-cancelar');

            /* retornamos un arreglo con los elementos
            'input texto', 'boton guardar' y 'boton cancelar'
            en ese orden */
                return [input_texto, boton_guardar, boton_cancelar];
        };

        function guardar_tarjeta_con(boton, input, creador, tarjeta){
            boton.addEventListener('click', function () {
                /* recordemos que estamos usando un div como si fuera un textarea,
                para obtener el texto interno usamops la propiedad innerText y
                reemplazamos tydos los saltos de linea '\n' por etiqueas '<br/>',
                si al final nos queda algun '<br/>' lo reemplazamos por una cadena
                vacia.
                */
                var texto = input.innerText.replace(/\n/g, '<br/>').replace(/<br\/>*$/, "");

                /* Prevenimos la creacion de una lista sin texto */
                if(texto != "") {
                    /* rescribimos el HTML interno de la tarjeta de titulo con el
                    titulo de la nueva lista */
                    tarjeta.innerHTML = "<p class=\"texto\">" + texto + "</p>";

                    /* Cuando la nueva tarjeta ha sido creada eliminamos el menu
                    creador de tarjetas de la tarjeta actual */
                    creador.remove('oculto');

                    /* añadimos el menu creador de tarjetas */
                    lista_actual = tarjeta.parentElement;
                    actualizar_menu_creador_de_tarjetas_en(lista_actual);
                }
                /* si el titulo esta vacio añadimos un mensaje de error */
                else {
                    var error_text = tarjeta.querySelector('.error-text');
                    if(error_text == null) {
                        error_text = document.createElement('div');
                        error_text.classList.add('error-text');
                        error_text.innerText = 'Escriba algun texto para esta tarjeta antes de guardarla';
                        tarjeta.insertBefore(error_text, boton.parentElement);
                    }
                }
            })
        };

        function cancelar_creacion_de_tarjeta_con(boton, creador, tarjeta){
            boton.addEventListener('click', function () {
                /* la tarjeta se elimina */
                    tarjeta.remove();

                /* y el menu creador de tarjetas aparece nuevamente */
                    creador.classList.remove('oculto');
            })
        };
})();

/*** Antiguo JS comentado pa no perderlo ***/
    /*
    var titulo = document.getElementById("borde");
    var form = document.getElementById("formulario");

    titulo.addEventListener("click",function(){
        bloque2();
    })

    function bloque2(){

        function bloque3(){
            titulo.style.display = "none";
            form.style.display = "block";

            var input = document.getElementById("contenido");

            window.setTimeout(function () {
                input.focus();
            }, 0);
        }

        function bloque4(){
            bloque3();

            var guardar = document.getElementById("boton");

            guardar.addEventListener("click",function(e){
                e.preventDefault();

                form.style.display = "none";

                var contenido = document.createElement("span");
                contenido.setAttribute("class","spancreado");

                var input = document.getElementById("contenido");
                var valorinput = input.value;
                contenido.innerText = valorinput;

                var conten = document.getElementById("conten");
                conten.insertBefore(contenido, conten.childNodes[0]);


                var contenido2 = document.createElement("span");
                contenido2.setAttribute("class","spancreado2");
                contenido2.innerText = "añadir una tarjeta";
                conten.insertBefore(contenido2, conten.childNodes[1]);
            })
        }

        bloque4();
    }
    */
