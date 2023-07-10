// Función para obtener una imagen aleatoria entre un rango de nombres
function obtenerImagenAleatoria(nombreBase, cantidad) {
  var numeroAleatorio = Math.floor(Math.random() * cantidad) + 1;
  return 'img/' + nombreBase + numeroAleatorio + '.jpg';
}

// Función para cargar la imagen de "destiny"
function cargarImagenDestiny() {
  var destiny = document.getElementById('destiny');
  var destinyImagen = obtenerImagenAleatoria('destiny', 1);
 destiny.style.backgroundImage = "url('" + destinyImagen + "')";
}

// Función para cargar imágenes aleatorias en "heroe" y "enemy"
function cargarImagenesAleatorias() {
  var heroe = document.getElementById('heroe');
  var enemy = document.getElementById('enemy');
  var heroeImagen = obtenerImagenAleatoria('heroe', 5);
  var enemyImagen = obtenerImagenAleatoria('enemy', 70);
  heroe.style.backgroundImage = "url('" + heroeImagen + "')";
  enemy.style.backgroundImage = "url('" + enemyImagen + "')";
}

function reiniciarJuego() {
  var heroeEnergia = document.getElementById('energiaH');
  var enemyEnergia = document.getElementById('energiaE');
  var gold = document.getElementById('gold');
  heroeEnergia.style.display = 'block';
  enemyEnergia.style.display = 'block';
  heroeEnergia.getElementsByClassName('energia')[0].textContent = "Energía: 100%";
  enemyEnergia.getElementsByClassName('energia')[0].textContent = "Energía: 100%";
  
  if (parseInt(heroeEnergia.getElementsByClassName('energia')[0].textContent.slice(9, -1)) === 0) {
    gold.getElementsByClassName('gold')[0].textContent = "Gold: 0";
  }
  
  cargarImagenDestiny();
  cargarImagenesAleatorias();
  document.getElementById('gameOver').textContent = "";

  // Reiniciar el audio de batalla
  var batallaAudio = document.getElementById('batallaAudio');
  batallaAudio.play();
}

// Función para mostrar el mensaje de Game Over
function mostrarGameOver(mensaje, color) {
  var gameOverElement = document.getElementById('gameOver');
  gameOverElement.innerHTML = mensaje;
  gameOverElement.style.color = color;

  // Detener el audio de batalla y reproducir el audio correspondiente
  var batallaAudio = document.getElementById('batallaAudio');
  batallaAudio.pause();
  if (color === 'red') {
    var gameoverAudio = document.getElementById('gameoverAudio');
    gameoverAudio.play();
  } else if (color === 'blue') {
    var triunfoAudio = document.getElementById('triunfoAudio');
    triunfoAudio.play();
  }
}

// Función para voltear un círculo aleatoriamente entre 1 y 2 veces seguidas
function voltearCirculo(circulo, volteoId, mensajeId, energiaId, goldId, jugador) {
  var volteo = Math.floor(Math.random() * 2) + 1; // Genera un número aleatorio entre 1 y 2

  setTimeout(function() {
    circulo.classList.add('flipped');
    circulo.classList.add('back');
    //document.getElementById(volteoId).textContent = "Número de volteos: " + volteo;//PARA SABER EL VALOR ACTUAL DE CADA VARIABLE
    if (volteo === 1) {
      setTimeout(function() {
        circulo.classList.remove('flipped');
        // circulo.classList.remove('back');
      }, 600); // Retrasa la eliminación de las clases en 0.6 segundos
    }
  }, 100); // Retrasa el primer volteo en 100 milisegundos

  if (volteo === 2) {
    setTimeout(function() {
      circulo.classList.remove('flipped');
      circulo.classList.remove('back');
      document.getElementById(mensajeId).textContent = jugador + " ATACA!!";
      document.getElementById(mensajeId).style.color = "lightgreen";

      // Reproducir el efecto de sonido correspondiente
      if (jugador === 'Jugador 1') {
        var heroeAudio = document.getElementById('heroeAudio');
        heroeAudio.play();
      } else {
        var monsterAudio = document.getElementById('monsterAudio');
        monsterAudio.play();
      }

      // Actualizar la energía según el volteo
      if (energiaId === 'energiaH') {
        actualizarEnergia('energiaE', 20);
        var enemyEnergiaElement = document.getElementById('energiaE').getElementsByClassName('energia')[0];
        var enemyEnergia = parseInt(enemyEnergiaElement.textContent.slice(9, -1));
        if (enemyEnergia === 0) {
          mostrarGameOver("¡Jugador 1 ha ¡GANADO!<br>Pulsa sobre 'Destiny' para seguir jugando", "blue");
          document.getElementById('energiaH').style.display = 'none';
          document.getElementById('energiaE').style.display = 'none';
        }
      } else if (energiaId === 'energiaE') {
        actualizarEnergia('energiaH', 20);
        var heroeEnergiaElement = document.getElementById('energiaH').getElementsByClassName('energia')[0];
        var heroeEnergia = parseInt(heroeEnergiaElement.textContent.slice(9, -1));
        if (heroeEnergia === 0) {
          mostrarGameOver("¡Jugador 1 ha perdido<br>GAME OVER<br>Pulsa sobre el ojo de 'Destiny' para volver a jugar", "red");
          document.getElementById('energiaH').style.display = 'none';
          document.getElementById('energiaE').style.display = 'none';
        }
      }

      // Actualizar Gold según el volteo
      if (volteoId === 'volteoH' && goldId === 'gold') {
        actualizarGold(250);
      }
    }, 1100); // Retrasa el segundo volteo en 1.1 segundos
  } else {
    setTimeout(function() {
      document.getElementById(mensajeId).textContent = jugador + " pierde el turno";
      document.getElementById(mensajeId).style.color = "red";
    }, 1100); // Retrasa el segundo volteo en 1.1 segundos
  }
}

// Función para actualizar la energía
function actualizarEnergia(energiaId, porcentaje) {
  var energiaContainer = document.getElementById(energiaId);
  var energiaElement = energiaContainer.getElementsByClassName('energia')[0];
  var currentEnergia = parseInt(energiaElement.textContent.slice(9, -1));
  var newEnergia = currentEnergia - porcentaje;
  newEnergia = Math.max(newEnergia, 0); // Evitar que la energía sea menor que 0
  energiaElement.textContent = "Energía: " + newEnergia + "%";

  if (newEnergia === 0 && energiaId === 'energiaH') {
    mostrarGameOver("¡Jugador 1 ha perdido<br>GAME OVER<br>Pulsa sobre el ojo de 'Destiny' para volver a jugar", "red");
    document.getElementById('energiaH').style.display = 'none';
    document.getElementById('energiaE').style.display = 'none';

    // Reiniciar el gold a 0 cuando la energía del heroe llega a 0
    var goldContainer = document.getElementById('gold');
    var goldElement = goldContainer.getElementsByClassName('gold')[0];
    goldElement.textContent = "Gold: 0";
  }
}

// Función para actualizar el valor de Gold
function actualizarGold(cantidad) {
  var goldContainer = document.getElementById('gold');
  var goldElement = goldContainer.getElementsByClassName('gold')[0];
  var currentGold = parseInt(goldElement.textContent.slice(6));
  var newGold= currentGold + cantidad;
  goldElement.textContent = "Gold: " + newGold;
}

// Agregar el evento de clic al "heroe" y "enemy"
var heroe = document.getElementById('heroe');
var enemy = document.getElementById('enemy');

// Obtener imágenes aleatorias para "heroe", "enemy" y "destiny" al cargar la página
var heroeImagen = obtenerImagenAleatoria('heroe', 5);
var enemyImagen = obtenerImagenAleatoria('enemy', 70);
var destinyImagen = obtenerImagenAleatoria('destiny', 1);

// Establecer las imágenes aleatorias
heroe.style.backgroundImage = "url('" + heroeImagen + "')";
enemy.style.backgroundImage = "url('" + enemyImagen + "')";
document.getElementById('destiny').style.backgroundImage = "url('" + destinyImagen + "')";

// Cargar el audio de batalla y reproducirlo en bucle
var batallaAudio = document.getElementById('batallaAudio');
batallaAudio.play();

// Función para activar la función de volteo solo cuando se haga clic en "destiny"
function activarVolteo(event) {
  var target = event.target;
  if (target.id === 'destiny') {
    document.getElementById('mensajeH').textContent = "";
    document.getElementById('mensajeE').textContent = "";
    voltearCirculo(heroe, 'volteoH', 'mensajeH', 'energiaH', 'gold', 'Jugador 1');
    voltearCirculo(enemy, 'volteoE', 'mensajeE', 'energiaE', null, 'Enemigo');
  }
}

// Función para aplicar el zoom out al círculo destiny y cambiar la imagen
function aplicarZoomOut() {
  var risaAudio = new Audio('sound/risa.mp3');
  risaAudio.play();
  var destiny = document.getElementById('destiny');
  destiny.classList.add('zoom-out');
  destiny.style.backgroundImage = "url('img/destiny2.jpg')";
  
  setTimeout(function() {
    destiny.classList.remove('zoom-out');
    destiny.style.backgroundImage = "url('img/destiny1.jpg')";
    document.getElementById('mensajeH').textContent = "";
    document.getElementById('mensajeE').textContent = "";
    var gameOverElement = document.getElementById('gameOver');
    if (gameOverElement.textContent !== "") {
      reiniciarJuego();
    }
  }, 500); // Retrasa el cambio de imagen y el zoom a la normalidad en 0.5 segundos
}

// Agregar el evento de clic a "destiny"
var destiny = document.getElementById('destiny');
destiny.addEventListener('click', aplicarZoomOut);
destiny.addEventListener('click', activarVolteo);