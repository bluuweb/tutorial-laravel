# Trucos con Laravel
Aquí trataré de especificar diversos trucos y conceptos varios con Laravel 5.8

## Paginación
Con laravel y Bootstrap 4 es muy fácil realizar una paginación.

[Documentación Laravel 5.8](https://laravel.com/docs/5.8/pagination#basic-usage)

**En nuestro controlador:** Estamos llamando directamente a `paginate(5)` donde el 5 representa la cantidad de elementos a mostrar.
```php
public function inicio(){

    $notas = App\Nota::paginate(5);

    return view('welcome', compact('notas'));
}
```

**En la vista:** Laravel utilizará los estilos de Bootstrap 4 para mostrar el resultado, por lo tanto solo agregamos:
```php
{{$notas->links()}}
```