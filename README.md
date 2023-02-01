# Freemove

Acontinuación, se mostrarán los pasos para que demás desarrolladores puedan ejecutar el proyecto desde sus computadores.

1. Clonar el repositorio

```
git clone https://github.com/iancarlosortega/freeMove.git
```

2. Instalar las dependencias del proyecto

```
npm install
```

3. Conectar firebase con la aplicación en los archivos en la carpeta **environments** y la variable **firebaseConfig**

```
firebaseConfig: {
    apiKey: 'AIzaS9127389127jasedkalshd1239',
    authDomain: 'freemove-aa0c5.firebaseapp.com',
    projectId: 'freemove-aa0c5',
    storageBucket: 'freemove-aa0c5.appspot.com',
    messagingSenderId: '215553764121',
    appId: '1:215553764121:web:asdasdasdasasd',
    measurementId: 'G-K8TEWYS6WE',
}
```

4. Establecer el token de la librería de MapboxGL JS en los archivos en la carpeta **environments** y la variable **mapboxToken**
5. Ejecutar el proyecto en desarrollo con el siguiente comando:

```
ng serve -o
```

## **Desplegar el proyecto a producción**

1. Revisar que la aplicación no tenga ningún error en desarollo.
2. Contruir el bundle de la aplicación con el siguiente comando:

```
ng build
```

3. Iniciar sesión con firebase desde la paleta de comandos con:

```
firebase login
```

4. Seleccionar el proyecto de Freemove
5. Ejecutar el siguiente comando para desplegar la aplicación.

```
firebase deploy
```
