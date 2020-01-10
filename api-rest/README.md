# API REST
Esta guía está pensada para desarrollar una api rest (está en construcción)

## Controlador API + Model
Se puede crear fácilmente un controlador asociado a un modelo y además que este tenga las rutas ya configuradas.

```cmd
php artisan make:controller API/PhotoController --api -m Photo
```

Agregar como:
```php
Route::apiResource('/photo', 'API/PhotoController');
```