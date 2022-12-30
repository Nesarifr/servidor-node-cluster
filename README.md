# servidor-node-cluster
Desarrollo de servidor con cluster y fork

## :scroll: Consigna:

Tomando con base el proyecto que vamos realizando, agregar un argumento más en la ruta de comando que permita ejecutar al servidor en modo fork o cluster. 
Dicho argumento será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no pasarlo, el servidor iniciará en modo fork por defecto.

Ejecutar el servidor (con los parámetros adecuados: modo FORK) utilizando PM2 en sus modos fork y cluster. Listar los procesos por PM2 y por sistema operativo.
Tanto en Forever como en PM2 permitir el modo escucha, para que la actualización del código del servidor se vea reflejado inmediatamente en todos los procesos.
Hacer pruebas de finalización de procesos fork y cluster en los casos que corresponda.


# Ejecucion y pruebas:

## Ejecucion:
Una vez clonado el repositorio e instalado los modulos, habria que ejecutar el Script.

Adjunto informacion de los scripts en el package.json: 

<pre><code>{
"scripts": {
    "dev": "nodemon ./server.js -p 8080",
    "dev-cluster": "nodemon ./server.js -p 8080 -m CLUSTER",
    "create": "node ./src/scripts/createTable.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "babel-node": "babel ./server.js -o ./index.js",
    "start": "node ./server.js",
    "pm2-fork": "pm2 start index.js",
    "pm2-cluster": "pm2 start index.js -i 0"
  }
}</code></pre>


### :computer: Herramientas utilizadas:
:ballot_box_with_check: Express
:ballot_box_with_check: Pm2
:ballot_box_with_check: VScode
:ballot_box_with_check: Handlebars
:ballot_box_with_check: MariaDB
:ballot_box_with_check: Babel
