# Factorías y Faker
Podemos llenar de forma aleatoria nuestra base de datos, para esto podemos mezclar las [factorías](https://laravel.com/docs/5.8/database-testing#generating-factories) con [Faker de PHP](https://github.com/fzaninotto/Faker).

Si en nuestro seeder del ejemplo anterior (bases de datos relacionales) agregamos:
```php
// Recuerda importar la clase User
 factory(User::class, 5)->create();
```

Y ahora ejecutas nuevamente los seeder:
```
php artisan migrate:fresh --seed
```

Veras que un tu base de datos se crearon registros de usuarios aleatorios.

## Crear Factory
Para crear una nueva factoria y relacionarla con un modelo podemos utilizar el siguiente comando:
```
php artisan make:factory CategoriaFactory --model=Categoria
```

Abrimos el archivo en cuestión y podemos agregar lo siguiente:
```php
$factory->define(Categoria::class, function (Faker $faker) {
    return [
        'nombre' => $faker->name
    ];
});
```

Ahora en nuestro seeder podemos reemplazar las categorías estáticas por algunas aleatorias:
```php
factory(Categoria::class, 5)->create();
```

Ejecutamos nuevamente: `php artisan migrate:fresh --seed` y revisamos nuestra base de datos.
