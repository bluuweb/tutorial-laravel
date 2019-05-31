# Bases de datos

El ORM de **Eloquent** incluido con Laravel proporciona una implementación de ActiveRecord simple y hermosa para trabajar con su base de datos. Cada tabla de base de datos tiene un "Modelo" correspondiente que se utiliza para interactuar con esa tabla. Los modelos le permiten consultar datos en sus tablas, así como insertar nuevos registros en la tabla.

## Configurar conexión

Abra el archivo `.env` (directorio raiz) y modifique según su conexión, en este ejemplo se detalla configuración con **XAMPP** y bases de datos **mysql** (deben crearla manualmente a través de phpMyAdmin).

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombreBaseDeDatos
DB_USERNAME=root
DB_PASSWORD=
```

## Migraciones

Una vez establecida la configuración de conexión debemos realizar las migraciones, pero antes si estás trabajando con una versión inferior de **Mysql v5.7.7** se saltará el siguiente error:

Puedes revisar la solución oficial dando [clic aquí](https://laravel-news.com/laravel-5-4-key-too-long-error)

```
[Illuminate\Database\QueryException]
SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes (SQL: alter table users add unique users_email_unique(email))

[PDOException]
SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes
```

Para evitar este error debemos configurar el archivo `AppServiceProvider.php` (app/Provides/AppServiceProvider.php)

```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

Una vez realizada la modificación utilizaremos el siguiente comando:

```
php artisan migrate
```

Esto nos creará las tablas de restablecer contraseña y usuarios que viene por defecto con Laravel, pero nosotros crearemos nuestras propias migraciones, para eso utilizaremos **Eloquent**.

## Eloquent

El ORM de Eloquent incluido con Laravel proporciona una implementación de ActiveRecord simple y hermosa para trabajar con su base de datos. Cada tabla de base de datos tiene un **"Modelo"** correspondiente que se utiliza para interactuar con esa tabla. Los modelos le permiten consultar datos en sus tablas, así como insertar nuevos registros en la tabla.

## Crear modelo y migración

Para crear un modelo con su respectiva migración utilizamos el siguiente comando:

```
php artisan make:model Nota -m
```

::: warning Muy importante:
Colocar los nombres de los modelos en singular.
:::

En la migración agregaremos los campos nombre y descripción:

```php
public function up()
    {
        Schema::create('notas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nombre');
            $table->text('descripcion');
            $table->timestamps();
        });
    }
```

Para terminar el proceso de creación de tablas utilizaremos nuevamente:

```
php artisan migrate
```

El resultado será el siguiente:

```
Migrating: 2019_05_31_203433_create_notas_table
Migrated:  2019_05_31_203433_create_notas_table
```

Agregaremos datos manuales ficticios para poder pintarlos en nuestro sitio web.

## Leer datos

Anteriormente habíamos creado un controlador para nuestras rutas, este se llama **PageController**, es aquí donde realizarmos las llamadas a la base de datos, pero esto no funciona si no tenemos nuestro modelo relacionado, el cual hicimos en la sección anterior.

Piense en cada modelo Eloquent como un potente generador de consultas que le permite consultar con fluidez la tabla de la base de datos asociada con el modelo. Por ejemplo:

```php
<?php

$flights = App\Flight::all();

foreach ($flights as $flight) {
    echo $flight->name;
}
```

Y esto aplicado a nuestro proyecto quedaría así:

```php
use App;

class PagesController extends Controller
{
    public function inicio(){

        $notas = App\Nota::all();

        return view('welcome', compact('notas'));
    }
```

Estamos enviando a la vista welcome todas las notas que creamos en nuestra base de datos utilizando una simple línea: `App\Nota::all();`, ojo que debemos agregar fuera de nuestra clase `use App;`

En la vista podemos realizar un ciclo foreach para pintar nuestros datos:

```html
<table class="table">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">Nombre</th>
        <th scope="col">Descripción</th>
        <th scope="col">Handle</th>
      </tr>
    </thead>
    <tbody>
        @foreach ($notas as $item)
        <tr>
            <th scope="row">{{ $item->id }}</th>
            <td>{{ $item->nombre }}</td>
            <td>{{ $item->descripcion }}</td>
            <td>@mdo</td>
        </tr>
        @endforeach
    </tbody>
</table>
```
