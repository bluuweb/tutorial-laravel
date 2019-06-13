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

## Proteger rutas
Para que cada ruta antes señalada esté protegida por Auth debemos agregar la siguiente línea de comandos a `NotaController`

```php
public function __construct()
{
    $this->middleware('auth');
}
```
Así al momento de montar nuestro controlador se utilizará el middleware auth.

## Leer Notas (index)
Aquí guardaremos en una variable al usuario que esté identificado, además de hacer nuestra consulta a la base de datos y pintar la siguiente vista:

Como utilizaremos el modelo Nota es fundamental agregar lo siguiente al inicio de nuestro controlador:
```php
use App\Nota;
```
Luego definir la acción index:
```php
public function index()
{
    $usuarioEmail = auth()->user()->email;
    $notas = Nota::where('usuario', $usuarioEmail)->paginate(5);
    return view('notas.lista',compact('notas'));
}
```

### Vista notas.lista
```html
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Lista de Notas para {{auth()->user()->name}}</span>
                    <a href="/notas/create" class="btn btn-primary btn-sm">Nueva Nota</a>
                </div>

                <div class="card-body">      
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($notas as $item)
                            <tr>
                                <th scope="row">{{ $item->id }}</th>
                                <td>{{ $item->nombre }}</td>
                                <td>{{ $item->descripcion }}</td>
                                <td>Acción</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    {{$notas->links()}}
                {{-- fin card body --}}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```
Estamos reutilizando el layout y secciones que se crearon automáticamente con la autenticación. Además de pintar al usuario autenticado con sus notas en específico.

Hemos creado el botón de crear notas:
```html
<a href="/notas/create" class="btn btn-primary btn-sm">Nueva Nota</a>
```

## Crear Nota (create/store)
Vamos a utilizar dos funciones de nuestro controlador `create` y `store`:
```php
public function create()
{
    return view('notas.crear');
}
```
Esta solo retornará la vista notas.crear

### Vista notas.crear
```html
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Agregar Nota</span>
                    <a href="/notas" class="btn btn-primary btn-sm">Volver a lista de notas...</a>
                </div>
                <div class="card-body">     
                  @if ( session('mensaje') )
                    <div class="alert alert-success">{{ session('mensaje') }}</div>
                  @endif
                  <form method="POST" action="/notas">
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
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```
Y en nuestro controlador:

```php
public function store(Request $request)
{

    $nota = new Nota();
    $nota->nombre = $request->nombre;
    $nota->descripcion = $request->descripcion;
    $nota->usuario = auth()->user()->email;
    $nota->save();

    return back()->with('mensaje', 'Nota Agregada!');
}
```
La única diferencia con nuestro proyecto anterior es que utilizamos la columna `usuario` para filtrar las notas para cada cliente. Por lo tanto queda como tarea resolver las siguientes acciones del CRUD.