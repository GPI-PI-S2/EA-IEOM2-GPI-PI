# EA-IEOM2-GPI
## Descripción
Este modulo define el algoritmo de análisis de sentimientos sobre un comentario de redes sociales, usando para esto un diccionario incluido en este repositorio junto con análisis de polaridad y análisis de capitalización de palabras, con esto se determinan los 17 factores emocionales de un comentario, por defecto el algoritmo se ejecuta de forma paralela usando todos los hilos de procesamiento disponible.

## Documentación técnica
Este repositorio está diseñado como un modulo utilizado dentro del sistema desarrollado, se proveen test de entrada y salida para verificar el funcionamiento del algoritmo como de test de rendimiento tanto para el caso de ser utilizado con un procesador como en el caso de ser utilizado en un entorno multiprocesador, estos tests se hacen en base a una muestra de comentarios previamente determinada (también incluida en este repositorio), esto con el fin de tener pruebas de rendimiento reproducibles.

## Diccionario
El diccionario incluido esta definido por palabras extraídas del diccionario AFINN junto con los factores emocionales asociados a dicha palabra, cabe destacar que por rendimiento las palabras en el diccionario están en forma raíz.

## Calculo de raíz
El calculo de las raíces tanto para el análisis del algoritmo como para la creación del diccionario fueron realizadas con Stemmer de Porter, implementación en la librería [Natural](https://www.npmjs.com/package/natural).

## Algoritmo
En este repositorio se incluyen las dos versiones del algoritmo desarrolladas (V1 y V2), se incluye además el diccionario en formato `.csv` con el fin de ayudar en su visualización, cabe destacar que el diccionario utilizado por el programa esta en formato `.json`.

## Tests
Para ejecutar los tests incluidos en este repositorio se deben ejecutar los siguientes comandos.
Realizar un test de entrada-salida del algoritmo.

```
npm run test
```
 
Realizar test de rendimiento usando 1 hilo de procesamiento.
```
npm run test-performance
```

Realizar test de rendimiento usando múltiples hilos de procesamiento.
```
npm run test-performance-threads
```

## Instalación
Para ejecutar las pruebas de este modulo es necesario tener instalado y actualizado [`NodeJS`](https://nodejs.org/) y [`NPM`](https://www.npmjs.com/) a sus ultimas versiones en el equipo.
Luego se debe ejecutar el siguiente comando para instalar las librerías necesarias.

```
npm install
```