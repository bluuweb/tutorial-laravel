# Introducción a Laravel

Está guía está diseñada para poder obtener el código del curso de Laravel de una forma amigable y en español.

::: warning Aviso
Esta guía está en constante actualización, podría no estar completa.
:::

## ¿Qué es Laravel?
Wiki: Laravel es un framework de código abierto para desarrollar aplicaciones y servicios web con PHP 5 y PHP 7. Su filosofía es desarrollar código PHP de forma elegante y simple, evitando el "código espagueti". Fue creado en 2011 y tiene una gran influencia de frameworks como Ruby on Rails, Sinatra y ASP.NET MVC.

Laravel propone en el desarrollo usar 'Routes with Closures', en lugar de un MVC tradicional con el objetivo de hacer el código más claro. Aun así permite el uso de MVC tradicional.

## Instalación
Te recomiendo revisar la documentación oficial para el proceso de instalación, ya que Laravel sufre de constantes actualizaciones, [Click aquí versión 5.8](https://laravel.com/docs/5.8/installation)

#### Pasos generales:
1. Recomiendo utilizar el programa [XAMPP](https://www.apachefriends.org/es/index.html) ya que contiene toda las configuraciones que requerimos: Apache + MariaDB + PHP + Perl
2. Instalar [Composer](https://getcomposer.org/) en tu computador. Descarga el archivo .exe y siguiente... siguiente... siguiente...
3. Ejecuta este comando en alguna consola: `composer global require laravel/installer`, esto instalará Laravel de forma global en tu computador.
4. Para crear un nuevo proyecto, viaja al directorio (con XAMPP) `C:\xampp\htdocs\nueva-carpeta` y ejecuta en la terminal (con la ruta antes señalada) `laravel new nombreProyecto`
5. El comando `laravel` funciona siempre y cuando tengas instalado Laravel de forma global, revisa el punto 2 y 3.
6. Abre tu proyecto en Visual Studio Code y ejecuta en la consola: `php artisan serve` y listo ya tienes andando un nuevo proyecto con Laravel 5.8

## Apuntes varios
Si estás trabajando con XAMPP y no quieres estar viajando a diferentes rutas para visualizar tu proyecto, puedes ejecutar en tu consola de Visual Studio Code (en tu proyecto) el siguiente código:

```
php artisan serve
```
Este comando iniciará un servidor de desarrollo en `http://localhost:8000`