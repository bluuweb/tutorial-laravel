# DB Relacionales
Este es el primer capítulo de nuestra primera API REST con Laravel 5.8, donde iremos diseñando nuestra base de datos con campos relacionales.

1. Crear proyecto con Laravel 5.8 o superior
2. Ejecutar: `php artisan make:auth`

## Diseño DB
Generalmente para un blog tendremos las siguientes tablas con los siguientes campos:

|USUARIOS           |POST       |CATEGORIES   | TAG         |PIVOTE     |
|--------           |----       |----         |----         |----       |
|id                 |id         |id           |id           |id         |
|name               |title      |name         |name         |post_id    |
|email              |excerpt    |created_at   |created_at   |tag_id     |
|email_verified_at  |body       |updated_at   |updated_at   |created_at |
|password           |created_at |             |             |updated_at |
|created_at         |updated_at |
|updated_at         |
|remember_token     |

## Crear base de datos
Ya hemos revisado en los capítulos anteriores como configurar nuestra base de datos, aquí detallo los pasos:
1. Abrir PhpMyAdmin y crear una base de datos
2. Configurar archivo .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombreBaseDeDatos
DB_USERNAME=root
DB_PASSWORD=
```
3. Configurar el archivo `AppServiceProvider.php` (app/Provides/AppServiceProvider.php)

```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

## Migraciones y modelos
Crear modelo y migración para Post:

```
php artisan make:model Post -m
```

Definir el Schema de la tabla Post:
```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('title');
        $table->mediumText('excerpt');
        $table->text('body');
        $table->timestamp('published_at')->nullable();
        $table->unsignedInteger('category_id'); // Relación con categorias
        $table->timestamps();
    });
}
```

Crear modelo y migración para Category:
```
php artisan make:model Category -m
```
## Relación uno a muchos
Una categoría puede tener varios Post, pero un Post puede tener solo una categoría. Para esto abrir el modelo Post:

```php
class Post extends Model
{
  public function category(){ //$post->category->name
      return $this->belongsTo(Category::class); //Pertenece a una categoría.
  }
}
```

Creamos el Schema de Category:
```php
public function up()
  {
      Schema::create('categories', function (Blueprint $table) {
          $table->bigIncrements('id');
          $table->string('name');
          $table->timestamps();
      });
  }
```

Ejecutar migraciones:
```
php artisan migrate:refresh
```

## Seeder
Vamos a llenar nuestra base de datos con campos ficticios para realizar pruebas, ejecutar:
```
php artisan make:seeder PostsTableSeeder
```

Abrir archivo: `database/seeds/DatabaseSeeder.php` y reemplazar con:
```php
public function run()
{
    $this->call(PostsTableSeeder::class);
}
```
Ahora abrir: `database/seeds/PostsTableSeeder.php`
```php
use Illuminate\Database\Seeder;
use App\Post;
use Carbon\Carbon;
use App\Category;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Category::truncate(); // Evita duplicar datos

        $category = new Category();
        $category->name = "Categoría 1";
        $category->save();

        Post::truncate(); // Evita duplicar datos

        $post = new Post();
        $post->title = "Mi primer post";
        $post->excerpt = "Extracto de mi primer post";
        $post->body = "<p>Resumen de mi primer post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();

        $post = new Post();
        $post->title = "Mi segundo post";
        $post->excerpt = "Extracto de mi segundo post";
        $post->body = "<p>Resumen de mi segundo post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();

        $post = new Post();
        $post->title = "Mi tercer post";
        $post->excerpt = "Extracto de mi tercer post";
        $post->body = "<p>Resumen de mi tercer post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();
    }
}

```

Ejecutar en terminal: `php artisan db:seed`

Para ejecutar una migración y seed puedes utilizar: `php atisan migrate:refresh --seed`

## Relación de muchos a muchos
Un Post puede tener varias etiquetas y una etiqueta puede tener muchos Posts.

Crear modelo y migración de Tag
```
php artisan make:model Tag -m
```
En la migración:
```php
public function up()
{
  Schema::create('tags', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name');
      $table->timestamps();
  });
}
```

## Tabla Pivote
Para hacer la relación entre Tags y Posts vamos a crear una tabla pivote:
```
php artisan make:migration create_post_tag_table --create=post_tag
```

En la migración:
```php
public function up()
{
    Schema::create('post_tag', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedInteger('post_id');
        $table->unsignedInteger('tag_id');
        $table->timestamps();
    });
}
```

Realizamos la migración:
```
php artisan migrate
```

## Modelo muchos a muchos
Ahora vamos a configurar el modelo Post agregando la siguiente función:
```php
public function tags(){
    return $this->belongsToMany(Tag::class); // Muchos a muchos
}
```

En los seeder debermos agregar los datos si desean, quedando así:
```php
use Illuminate\Database\Seeder;
use App\Post;
use Carbon\Carbon;
use App\Category;
use App\Tag;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Category::truncate(); // Evita duplicar datos

        $category = new Category();
        $category->name = "Categoría 1";
        $category->save();

        Tag::truncate(); // Evita duplicar datos

        $tag = new Tag();
        $tag->name = "Tag 1";
        $tag->save();

        $tag = new Tag();
        $tag->name = "Tag 2";
        $tag->save();

        Post::truncate(); // Evita duplicar datos

        $post = new Post();
        $post->title = "Mi primer post";
        $post->excerpt = "Extracto de mi primer post";
        $post->body = "<p>Resumen de mi primer post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();
        
        $post->tags()->attach([1, 2]); //Relacionar el post a dos etiquetas
        
        $post = new Post();
        $post->title = "Mi segundo post";
        $post->excerpt = "Extracto de mi segundo post";
        $post->body = "<p>Resumen de mi segundo post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();

        $post->tags()->attach([1]); //Relacionar el post a una etiqueta

        $post = new Post();
        $post->title = "Mi tercer post";
        $post->excerpt = "Extracto de mi tercer post";
        $post->body = "<p>Resumen de mi tercer post</p>";
        $post->published_at = Carbon::now();
        $post->category_id = 1;
        $post->save();

        $post->tags()->attach([2]); //Relacionar el post a una etiqueta
        
    }
}

```

## Práctica
Ahora vamos a utilizar estas relaciones, primero en en las rutas nos podemos traer todos los posts:

```php
Route::get('/', function () {
    $posts = Post::all();
    return view('welcome', compact('posts'));
});
```

Ahora en el modelo Post debemos configurar las fechas con Carbon:
```php
protected $dates = ['published_at']; // pasar fechas a carbon
```

Y finalmente configuramos la vista welcome.blade.php:
```html
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">

            @foreach ($posts as $item)
                <div class="card mb-3">
                    <div class="card-header">{{$item->published_at->format('d M Y')}}</div>

                    <div class="card-body">
                        <h3>{{$item->title}}</h3>
                        <p>Categoría: {{ $item->category->name }}</p>
                        <p>{{ $item->excerpt }}</p>
                        <div>

                            @foreach ($item->tags as $tag)
                            <span class="badge badge-primary"># {{ $tag->name }}</span>
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






