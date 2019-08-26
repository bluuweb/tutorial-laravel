# Bases de Datos Relacionales
Las tablas de la base de datos a menudo están relacionadas entre sí. Por ejemplo, una publicación de blog puede tener muchos comentarios, o un pedido podría estar relacionado con el usuario que lo realizó. Eloquent facilita la administración y el trabajo con estas relaciones, y admite varios tipos diferentes de relaciones:

En este caso práctico realizaremos un web donde un usuario podrá agregar libros y administralos, por lo tanto tendremos las siguientes relaciones:

* Uno a muchos
* Muchos a muchos
* Tabla pivote

## Configuraciones iniciales
1. Crear proyecto con Laravel 5.8 o superior
2. Ejecutar: ``php artisan make:auth``
3. Crear base de datos
4. Configurar archivo .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombreBaseDeDatos
DB_USERNAME=root
DB_PASSWORD=
```
5. Configurar el archivo ``AppServiceProvider.php`` (app/Provides/AppServiceProvider.php)
```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

## Diseño DB
Tendremos las siguientes tablas y modelos:
* Usuario
* Libro
* Categoria
* Etiqueta
* Pivote

Nota: La tabla de usuarios ya está configurada al instalar el sistema de autenticación con Laravel 5.8

## Migraciones y Modelos
Crearemos las migraciones y modelos de libro y categoria
```
php artisan make:model Libro -m
```

Schema de la tabla Libro:
```php
public function up()
{
  Schema::create('libros', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('titulo');
      $table->mediumText('descripcion');
      $table->text('contenido');
      $table->timestamp('fecha')->nullable();
      $table->unsignedInteger('categoria_id'); // Relación con categorias
      $table->timestamps();
  });
}
```

Crear modelo y migración para Categoria:
```
php artisan make:model Categoria -m
```

## Relación uno a muchos (inverso)
[Documentación oficial](https://laravel.com/docs/5.8/eloquent-relationships#one-to-many)
Una categoría puede tener varios Libros, pero un Libro puede tener solo una categoría. Para esto abrir el modelo Libro:

```php
class Libro extends Model
{
  public function categoria(){ //$libro->categoria->nombre
      return $this->belongsTo(Categoria::class); //Pertenece a una categoría.
  }
}
```

Creamos el Schema de Categoria:
```php
public function up()
{
  Schema::create('categorias', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('nombre');
      $table->timestamps();
  });
}
```

Ejecutar migraciones:
```
php artisan migrate:refresh
```

## Relación de muchos a muchos
Un Libro puede tener varias etiquetas y una etiqueta puede tener muchos Libros.

Crear modelo y migración de Etiqueta:
```
php artisan make:model Etiqueta -m
```

En la migración:
```php
public function up()
  {
      Schema::create('etiquetas', function (Blueprint $table) {
          $table->bigIncrements('id');
          $table->string('nombre');
          $table->timestamps();
      });
  }
```

## Tabla Pivote (solo migración)
[Documentación migraciones](https://laravel.com/docs/5.8/migrations#generating-migrations)
Para hacer la relación entre Etiquetas y Libros vamos a crear una tabla pivote:

:::tip Importante
El nombre `create_etiqueta_libro_table` no es al azar, tiene que ir de orden alfabético y en singular, es por esto que colocamos primero `etiqueta` y luego `libro`
:::

```
php artisan make:migration create_etiqueta_libro_table --create=etiqueta_libro
```

Las opciones ``--table`` y ``--create`` también se pueden usar para indicar el nombre de la tabla y si la migración creará una nueva tabla. Estas opciones rellenan previamente el archivo auxiliar de migración generado con la tabla especificada.

En la migración:
```php
public function up()
{
    Schema::create('etiqueta_libro', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedInteger('libro_id');
        $table->unsignedInteger('etiqueta_id');
        $table->timestamps();
    });
}
```

Realizamos la migración:
```
php artisan migrate
```

## Modelo muchos a muchos
Ahora vamos a configurar el modelo Libro agregando la siguiente función:
```php
public function etiquetas(){
    return $this->belongsToMany(Etiqueta::class); // Muchos a muchos
}
```

## Seeder
[documentación oficial](https://laravel.com/docs/5.8/seeding#writing-seeders)
Vamos a llenar nuestra base de datos con campos ficticios para realizar pruebas, ejecutar:
```
php artisan make:seeder LibrosTableSeeder
```

Abrir archivo: ``database/seeds/DatabaseSeeder.php`` y reemplazar con:
```php
public function run()
{
    $this->call(LibrosTableSeeder::class);
}
```

Ahora abrir: ``database/seeds/LibrosTableSeeder.php``
```php
use Illuminate\Database\Seeder;
use App\Libro;
use Carbon\Carbon;
use App\Categoria;
use App\Etiqueta;

class LibrosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Categoria::truncate(); // Evita duplicar datos

        $categoria = new Categoria();
        $categoria->nombre = "Categoría 1";
        $categoria->save();

        Etiqueta::truncate(); // Evita duplicar datos

        $etiqueta = new Etiqueta();
        $etiqueta->nombre = "Etiqueta 1";
        $etiqueta->save();

        $etiqueta = new Etiqueta();
        $etiqueta->nombre = "Etiqueta 2";
        $etiqueta->save();

        Libro::truncate(); // Evita duplicar datos

        $libro = new Libro();
        $libro->titulo = "Mi primer libro";
        $libro->descripcion = "Extracto de mi primer libro";
        $libro->contenido = "<p>Resumen de mi primer libro</p>";
        $libro->fecha = Carbon::now();
        $libro->categoria_id = 1;
        $libro->save();
        
        $libro->etiquetas()->attach([1, 2]); //Relacionar el libro a dos etiquetas
        
        $libro = new Libro();
        $libro->titulo = "Mi segundo libro";
        $libro->descripcion = "Extracto de mi segundo libro";
        $libro->contenido = "<p>Resumen de mi segundo libro</p>";
        $libro->fecha = Carbon::now();
        $libro->categoria_id = 1;
        $libro->save();

        $libro->etiquetas()->attach([1]); //Relacionar el libro a una etiqueta

        $libro = new Libro();
        $libro->titulo = "Mi tercer libro";
        $libro->descripcion = "Extracto de mi tercer libro";
        $libro->contenido = "<p>Resumen de mi tercer libro</p>";
        $libro->fecha = Carbon::now();
        $libro->categoria_id = 1;
        $libro->save();

        $libro->etiquetas()->attach([2]); //Relacionar el libro a una etiqueta
        
    }
}
```

Ejecutar en terminal: 
``php artisan migrate:fresh``

``php artisan db:seed``

Para ejecutar una migración y seed puedes utilizar: ``php artisan migrate:fresh --seed``

## Pruebas en vistas
Veamos si las relaciones están bien configuradas:

En Rutas:
```php
use App\Libro;

Route::get('/', function () {
    $libros = Libro::all();
    return view('welcome', compact('libros'));
});
```

Ahora en el modelo Libro debemos configurar las fechas con Carbon:
```php
protected $dates = ['fecha']; // pasar fechas a carbon
```

Y finalmente configuramos la vista welcome.blade.php:
```php
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">

            @foreach ($libros as $item)
                <div class="card mb-3">
                    <div class="card-header">{{$item->fecha->format('d M Y')}}</div>

                    <div class="card-body">
                        <h3>{{$item->titulo}}</h3>
                        <p>Categoría: {{ $item->categoria->nombre }}</p>
                        <p>{{ $item->descripcion }}</p>
                        <div>

                            @foreach ($item->etiquetas as $tag)
                            <span class="badge badge-primary"># {{ $tag->nombre }}</span>
                            @endforeach

                        </div>
                    </div>
                </div>
            @endforeach

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
    </div>
</div>
@endsection
```

## Restricciones Base de datos
Podemos definir restricciones a nivel de bases de datos (sus relaciones), pero para este procedimiento debemos modificar la migración de categorias, libros y la tabla pivote.

**En la migración de libros**: anteponemos la creación de categorías, ya que en caso contrario no encontrará la clave foránea. 

:::danger Eliminar migración categorías
Debemos eliminiar la migración de categorías, antes de ejecutar nuevamente `php artisan migrate:fresh`
:::

```php{4-8,16-17}
public function up()
    {

        Schema::create('categorias', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('libros', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('titulo');
            $table->mediumText('descripcion');
            $table->text('contenido');
            $table->timestamp('fecha')->nullable();
            $table->unsignedBigInteger('categoria_id'); // Relación con categorias
            $table->foreign('categoria_id')->references('id')->on('categorias'); // clave foranea
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('libros');
        Schema::dropIfExists('categorias');
    }
```

En la migración de nuestra tabla pivote:
```php{5-8}
public function up()
    {
        Schema::create('etiqueta_libro', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('libro_id'); // Relación con libros
            $table->foreign('libro_id')->references('id')->on('libros'); // clave foranea
            $table->unsignedBigInteger('etiqueta_id'); // Relación con etiquetas
            $table->foreign('etiqueta_id')->references('id')->on('etiquetas'); // clave foranea
            $table->timestamps();
        });
    }
```

Finalmente en nuestro seeder: Dejar comentado los `truncate()`
```php
// Categoria::truncate(); // Evita duplicar datos
// Etiqueta::truncate(); // Evita duplicar datos
// Libro::truncate(); // Evita duplicar datos
```

Ahora ejecutar nuevamente las migraciones:
```
php artisan migrate:fresh --seed
```

:::tip En caso de algún error
Si presentan algún error lo recomendable es eliminar la base de datos (desde PhpMyAdmin) y ejecutar nuevamente las migraciones con sus respectivos seeder.
:::

El diseño debería quedar así:
<br>
<img :src="$withBase('/img/relaciones-1.PNG')" alt="relaciones base de datos" width="100%">


