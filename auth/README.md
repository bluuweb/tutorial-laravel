# Autenticación
Realizar autenticaciones con Laravel 5.8 es sumamente secillo. Para este ejemplo comenzaremos con un proyecto desde cero.

[Documentación oficial Laravel 5.8](https://laravel.com/docs/5.8/authentication)

```
laravel new notas_auth
```

Luego dentro de nuestro proyecto ejecutamos el siguiente comando:

```
php artisan make:auth
```
Este comando debe usarse en aplicaciones nuevas e **instalará una vista de diseño, registro y vistas de inicio de sesión**, así como rutas para todos los puntos finales de autenticación. Un `HomeController` También se generarán para manejar las solicitudes de acceso a `post-login` de su aplicación.

Una vez completado el proceso de configuración es momento de configurar nuestra base de datos, este proceso ya lo realizamos, puede obtener [más información aquí](/bases-datos/#configurar-conexion)

## Práctica Notas con Auth
Para comprender mejor como funciona la autenticación en laravel, desarrollaremos el siguiente ejercicio:

::: tip Objetivos
Crear una aplicación web donde los usuarios puedan crear y adminitrar notas, cabe señalar que cada usuario tendrá que ver sus propias notas y no las de otros, además de agregar vistas protegidas a la administración.
:::

## Base de datos
Lo primero será crear una base de datos en nuestro PhpMyAdmin y configurar el archivo .env de nuestro proyecto:

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_auth
DB_USERNAME=root
DB_PASSWORD=
```

## AppServiceProvider
Configurar el archivo AppServiceProvider.php (app/Provides/AppServiceProvider.php)
```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

## Crear modelo y Migración
```
php artisan make:model Nota -m
```

```php
Schema::create('notas', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('nombre');
    $table->text('descripcion');
    $table->text('usuario');
    $table->timestamps();
});
```
Agregamos un campo `usuario` para poder luego hacer filtros de notas en el controlador.

## Resource Controllers
Para crear un controlador para nuestro CRUD de notas, podemos utilizar `Resource Controllers` lo cual generará todas las rutas automáticamente (No es maravillo Laravel :heart_eyes:)

[Documentación oficial](https://laravel.com/docs/5.8/controllers#resource-controllers)

Ejecutamos el siguiente comando:
```
php artisan make:controller NotaController --resource
```

Luego configuramos la siguiente ruta:
```php
Route::resource('/notas', 'NotaController');
```

Aquí una tabla con todas las rutas y acciones configuradas automáticamente:
| Verb      | URI                  | Action  |Route Name      |
| ------    |-------------         | -----   | --------       |
| GET       | `/notas`             | index   |  notas.index   |
| GET       | `/notas/create`      | create  |  notas.create  |
| POST      | `/notas`             | store   |  notas.store   |
| GET       | `/notas/{nota}`      | show    |  notas.show    |
| GET       | `/notas/{nota}/edit` | edit    |  notas.edit    |
| PUT/PATCH | `/notas/{nota}`      | update  |  notas.update  |
| DELETE    | `/notas/{nota}`      | destroy |  notas.destroy |
