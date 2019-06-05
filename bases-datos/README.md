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

## Leer un dato

<!-- <a href="http://www.youtube.com/watch?feature=player_embedded&v=z7ecV0tL1Gg
" target="_blank"><img src="http://img.youtube.com/vi/z7ecV0tL1Gg/0.jpg"
alt="Tutorrial bluuweb" width="240" height="180" border="" /></a> -->

Para traer la información de un solo dato de nuestra base de datos, debemos realizar lo siguiente:

1. Agregar un boton o enlace para que el cliente seleccione el detalle de un solo campo:

```html
<tbody>
  @foreach ($notas as $item)
  <tr>
    <th scope="row">{{ $item->id }}</th>
    <td>
      <a href="{{route('notas.detalle', $item)}}">
        {{ $item->nombre }}
      </a>
    </td>
    <td>{{ $item->descripcion }}</td>
    <td>@mdo</td>
  </tr>
  @endforeach
</tbody>
```

2. Crear la ruta `notas.detalle` en `routes/web.php` con su respectivo controlador, recuerda que estamos pasando el id en forma de parámetro, por lo tanto nuestro controlador debería recibirlo:

::: danger MODIFICACIÓN QUE NO VERÁS EN EL VIDEO
Agregué la siguiente ruta: `/detalle/{id}` esto es para que no se destruya nuestras otras vistas, en el video #10 del curso se explica esta modificación, pero recomiendo utilizarla desde ya!
:::

```php
Route::get('/detalle/{id}', 'PagesController@detalle')->name('notas.detalle');
```

3. Crear función en controlador:

```php
public function detalle($id){

    // $nota = App\Nota::find($id);

    //Aquí valida si existe sino redirije al 404
    $nota = App\Nota::findOrFail($id);

    return view('notas.detalle', compact('nota'));
}
```

4. Crear la vista detalle, en este ejemplo se creó en `views/notas/detalle.blade.php`:

```html
@section('seccion')
<h1>Nota Detalle</h1>
<hr />
<h4>Id: {{ $nota->id }}</h4>
<h4>Nombre: {{ $nota->nombre }}</h4>
<h4>Descripción: {{ $nota->descripcion }}</h4>
@endsection
```

## Agregar datos

Para agregar nuevos elementos debemos realizar los mismos procedimientos, agregar una vista, una ruta y un controlador.

#### Vista

Agregaremos el formulario para insertar nuevos datos:

```html
<form method="POST" action="{{ route('notas.crear') }}">
  @csrf
  <input
    type="text"
    name="nombre"
    placeholder="Nombre"
    class="form-control mb-2"
  />
  <input
    type="text"
    name="descripcion"
    placeholder="Descripcion"
    class="form-control mb-2"
  />
  <button class="btn btn-primary btn-block" type="submit">Agregar</button>
</form>
```

No olives utilizar el atributo name en cada uno de tus input, este debe ser el mismo campo de su base de datos. Por otro lado configuramos el método POST y la acción debe llamar a una nueva ruta.

**Protección CSRF:** Laravel facilita la protección de su aplicación de los ataques de falsificación de solicitudes entre sitios (CSRF). Las falsificaciones de solicitudes entre sitios son un tipo de explotación maliciosa en la que se realizan comandos no autorizados en nombre de un usuario autenticado.

Laravel genera automáticamente un "token" CSRF para cada sesión de usuario activa gestionada por la aplicación. Este token se usa para verificar que el usuario autenticado es el que realiza las solicitudes a la aplicación.

Por lo tanto simplemente tenemos que agregar `@csrf` directiva Blade para generar el campo de token.

[Guía oficial de CSRF Laravel 5.8](https://laravel.com/docs/5.8/csrf)

#### Rutas

Aquí veremos un nuevo método en las rutas:

```php
Route::post('/', 'PagesController@crear')->name('notas.crear');
```

#### Controlador

Aquí realizaremos toda la acción para guardar en la base de datos, utilizando el modelo `Nota` y `Request $request`, este último lo pasamos como parámetro para recibir los datos de nuestro formulario. Con Eloquent solo llamamos a la función `save()` para almacenar en nuestra base de datos.

```php

class PagesController extends Controller
{
    public function crear(Request $request){
        // return $request->all();

        $notaNueva = new App\Nota;
        $notaNueva->nombre = $request->nombre;
        $notaNueva->descripcion = $request->descripcion;

        $notaNueva->save();

        return back()->with('mensaje', 'Nota agregada');
    }
}
```

**Request \$request**: Para obtener una instancia de la solicitud HTTP actual a través de la inyección de dependencia, debe escribir la clase en el método de su controlador. La instancia de solicitud entrante será automáticamente inyectada por el contenedor de servicios: `Illuminate\Http\Request`

[Request documentación Laravel 5.8](https://laravel.com/docs/5.8/requests)

Una cosa interesante es utiliza `back()` para retroceder en la visa y `with()` para enviar un mensaje, este caso nota agregada que lo podríamos pintar con un alerta en nuestra vista:

```php
@if ( session('mensaje') )
    <div class="alert alert-success">{{ session('mensaje') }}</div>
@endif
```

[Redireccionamiento con datos](https://laravel.com/docs/5.8/redirects#redirecting-with-flashed-session-data)

Si bien nuestra aplicación web guarda los datos nos falta un paso muy importante que son las validaciones.

## Validaciones

Laravel proporciona varios enfoques diferentes para validar los datos entrantes de su aplicación. En el controlador volveremos a utilizar la variable `$request` donde pasamos `validate`, el cual recibe el nombre de nuestro campo con su respectiva validación.

```php
$request->validate([
    'nombre' => 'required',
    'descripcion' => 'required'
]);
```

[Documentación ofical Laravel 5.8](https://laravel.com/docs/5.8/validation#introduction)

En caso de detectar algún error laravel redireccionará automáticamente al usuario a su ubicación anterior. Además, todos los errores de validación se transmitirán automáticamente a la sesión, por lo tanto podríamos pintarlos en la vista de la siguiente manera:

```html
@error('nombre')
<div class="alert alert-danger alert-dismissible fade show" role="alert">
  El nombre es requerido
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
@enderror @if ($errors->has('descripcion'))
<div class="alert alert-danger alert-dismissible fade show" role="alert">
  La descripción es requerida
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
@endif
```

Aquí vemos dos ejemplos, el primero es utilizando la directiva `@error` y el segundo es utilizando la variable `$errors`, cualquiera de los dos métodos son válidos.

Para que laravel no olvides nuestros campos podemos utilizar la función `old()` dentro del atributo `value=""` en nuestro formulario:

```html
<input
    type="text" name="nombre"
    placeholder="Nombre" class="form-control mb-2"
    value="{{ old('nombre') }}">

<input
    type="text" name="descripcion"
    placeholder="Descripcion" class="form-control mb-2"
    value="{{ old('descripcion') }}">
```

## Actualizar datos
Para realizar la actualización utilizaremos algo muy similar a nuestro apartado de notas detalle:

[Documentación Laravel 5.8](https://laravel.com/docs/5.8/eloquent#updates)

1. **Agregar botón**: Dentro de nuestra tabla crearemos un botón por cada nota, enviando al nombre de la ruta `notas.editar` con el parámetro `$item`, así viajará el id de nuestra nota específica.

```html
<td>
    <a href="{{route('notas.editar', $item)}}" class="btn btn-warning btn-sm">Editar</a>
</td>
```

2. **Crear ruta:** En nuestro archivo `web.php` crearemos la siguiente ruta: 
```php
Route::get('/editar/{id}', 'PagesController@editar' )->name('notas.editar');
```

3. **Controlador editar:** El controlador editar retornará la vista con un formulario para editar la nota correspondiene. Estamos haciendo la misma petición que en detalle, utilizando el `$id`, para buscar la nota en nuestra base de datos.

```php
public function editar($id){
    $nota = App\Nota::findOrFail($id);
    return view('notas.editar', compact('nota'));
}
```

4. **Vista editar:** Aquí utilizaremos un formulario para poder editar nuestra nota:

```html
@extends('plantilla')

@section('seccion')
  <h1>Editar</h1>
  @if (session('mensaje'))
      <div class="alert alert-success">
          {{ session('mensaje') }}
      </div>
  @endif
  <form action="{{ route('notas.update', $nota->id) }}" method="POST">
    @method('PUT')
    @csrf

    @error('nombre')
        <div class="alert alert-danger">
            El nombre es obligatorio
        </div>
    @enderror

    @error('descripcion')
        <div class="alert alert-danger">
            La descripción es obligatoria
        </div>
    @enderror

    <input type="text" name="nombre" placeholder="Nombre" class="form-control mb-2" value="{{ $nota->nombre }}">
    <input type="text" name="descripcion" placeholder="Descripcion" class="form-control mb-2" 
    value="{{ $nota->descripcion }}">
    <button class="btn btn-warning btn-block" type="submit">Editar</button>
  </form>
@endsection
```
Cabe señalar que aquí estamos utilizando nuevos conceptos:

### `@method('PUT')`
HTML no puede enviar el método `PUT`, por lo tanto utilizamos la directiva de blade `@method('PUT')` la cual será oculta en nuestra aplicación pero permitirá ejecutar la actualización de un elemento.

[Documentación Laravel 5.8](https://laravel.com/docs/5.8/routing#form-method-spoofing)

### Acción de nuestro formulario
Estamos enviando el formulario a la siguiente ruta: `route('notas.update', $nota->id)`, aquí vemos como enviamos el id de la nota para posteriormente guardar la actualización.

### Value
Utilizamos `$nota->descripcion"` para capturar los datos que el cliente podrá modificar.

### Validaciones
Puedes utilizar las validaciones que vimos en la clase pasada.

5. **Ruta update:** Configuraremos la ruta update que estamos solicitando en nuestro formulario de edición:

```php
Route::put('/editar/{id}', 'PagesController@update' )->name('notas.update');
```

6. **Contralador update:** Estamos recibiendo como parámetro el id de nuestra nota por lo tanto ya podríamos ejecutar la edición:

```php
public function update(Request $request, $id){
        
    $notaActualizada = App\Nota::find($id);
    $notaActualizada->nombre = $request->nombre;
    $notaActualizada->descripcion = $request->descripcion;
    $notaActualizada->save();
    return back()->with('mensaje', 'Nota editada!');

}
```
Utilizamos nuevamente el `$request` para recibir los datos de nuestro formulario y buscamos en nuestra base de datos con el `$id` en específico. Finalmente estamos retornando a la página anterior con un mensaje de sesión `Nota editada`.

## Eliminar
Para eliminar una nota de nuestra base de datos es muy sencillo, solo debemos crear un formulario con nuestro botón de eliminar, configurar nuestra ruta y el controlador que ejecutará la acción:

Vista:
```html
<form action="{{ route('notas.eliminar', $item) }}" class="d-inline" method="POST">
    @method('DELETE')
    @csrf
    <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
</form> 
```

Ruta:
```php
Route::delete('/eliminar/{id}', 'PagesController@eliminar')->name('notas.eliminar');
```

Controlador:
```php
public function eliminar($id){

    $notaEliminar = App\Nota::findOrFail($id);
    $notaEliminar->delete();

    return back()->with('mensaje', 'Nota Eliminada');
}
```