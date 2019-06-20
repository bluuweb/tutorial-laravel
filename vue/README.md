# Vue.js en Laravel
En las últimas versiones de Laravel (en este caso la versión 5.8) está preconfigurado Vue.js, por lo tanto comenzaremos de cero con un nuevo proyecto: [Documentación oficial](https://laravel.com/docs/5.8/frontend)

:::tip Requisitos:
- Tener instalado Node.js en su pc.
- Tener conocimientos de Vue.js [Revisar curso gratis aquí](https://www.youtube.com/watch?v=GAQB7Y4X5fM&list=PLPl81lqbj-4J-gfAERGDCdOQtVgRhSvIT)
:::

## Intalaciones
Crear proyecto de Laravel:
```
laravel new vue-laravel-v1
```

Viajamos dentro de la carpeta y creamos la autenticación:
```
php artisan make:auth
```

Podemos notar que en la raiz de nuestro proyecto contamos con un archivo `package.json` el cual cuenta con las siguientes dependencias:

```json
"devDependencies": {
    "axios": "^0.19",
    "bootstrap": "^4.1.0",
    "cross-env": "^5.1",
    "jquery": "^3.2",
    "laravel-mix": "^4.0.7",
    "lodash": "^4.17.5",
    "popper.js": "^1.12",
    "resolve-url-loader": "^2.3.1",
    "sass": "^1.15.2",
    "sass-loader": "^7.1.0",
    "vue": "^2.5.17"
}
```

Por lo tanto para instalar cada una de ellas solo debemos ejecutar:

```
npm i
```
Con esto ya tenemos configurado `vue.js` dentro de nuestro proyecto

## Componentes
Vue ya viene con un componente de ejemplo el cual podemos utilizar de inmediato, puedes encontrarlo en: `./resources/js/components`

Vamos a modificar la página de inicio para pintar este componente: `./resources/views/welcome.blade.php`

```html
@extends('layouts.app')

@section('content')
    <example-component></example-component>
@endsection
```

Ahora, aparte de ejecutar nuestro servidor con `php artisan serve`, necesitamos estar pendientes de los cambios en Javascript, por lo tanto también en paralelo ejecutaremos:

```
npm run watch
```


Cada vez que realizamos un cambio nos aparece un mensaje de Laravel, este lo puedes omitir agregando el siguiente código al archivo: `webpack.mix.js`

```
mix.disableNotifications();
```

## Práctica: Bases de datos
En este apartado desarrollaremos o más bien complementaremos nuestra práctica de notas con vue.js, por lo tanto configuraremos la base de datos, modelos, migraciones y controladores:

.env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_auth
DB_USERNAME=root
DB_PASSWORD=
```

AppServiceProvider
```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

Crear modelo y Migración
```
php artisan make:model Nota -m
```

```php
Schema::create('notas', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('nombre');
    $table->text('descripcion');
    $table->bigInteger('user_id')->unsigned();
    $table->foreign('user_id')->references('id')->on('users');
    $table->timestamps();
});
```
Ojo aquí estamos utilizando claves foráneas para relacionar las notas con un usuario específico. [Tutorial aquí](https://styde.net/claves-foraneas-e-integridad-referencial-de-datos-en-laravel/)

Ejecutar migraciones
```
php artisan migrate
```

Resource Controllers
```
php artisan make:controller NotaController --resource
```

web.php
```php
Route::resource('/notas', 'NotaController')->middleware('auth');
```

## CRUD Controlador
Mostrar notas:
```php
public function index(Request $request)
{   
    if($request->ajax()){
        return Nota::where('user_id', auth()->id())->get();
    }else{
        return view('home');
    }
}   
```

Guardar nueva nota:
```php
public function store(Request $request)
{
    $nota = new Nota();
    $nota->nombre = $request->nombre;
    $nota->descripcion = $request->descripcion;
    $nota->user_id = auth()->id();
    $nota->save();

    return $nota;
}  
```

Editar nota:
```php
public function update(Request $request, $id)
{
    $nota = Nota::find($id);
    $nota->nombre = $request->nombre;
    $nota->descripcion = $request->descripcion;
    $nota->save();
    return $nota;
}
```

Eliminar nota:
```php
public function destroy($id)
{
    $nota = Nota::find($id);
    $nota->delete();
}
```

## Vista Home
```html
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">App de notas</div>
                <div class="card-body">
                    <notas />
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
```

## Componente con Vue.js
TareasComponent.vue
```html
<template>
  <div>
    <form @submit.prevent="editarNota(nota)" v-if="modoEditar">
      <h3>Editar nota</h3>
      <input type="text" class="form-control mb-2" 
        placeholder="Nombre de la nota" v-model="nota.nombre">
      <input type="text" class="form-control mb-2" 
        placeholder="Descripción de la nota" v-model="nota.descripcion">
      <button class="btn btn-warning" type="submit">Editar</button>
      <button class="btn btn-danger" type="submit" 
        @click="cancelarEdicion">Cancelar</button>
    </form>
    <form @submit.prevent="agregar" v-else>
      <h3>Agregar nota</h3>
      <input type="text" class="form-control mb-2" 
        placeholder="Nombre de la nota" v-model="nota.nombre">
      <input type="text" class="form-control mb-2" 
        placeholder="Descripción de la nota" v-model="nota.descripcion">
      <button class="btn btn-primary" type="submit">Agregar</button>
    </form>
    <hr>
    <h3>Lista de notas:</h3>
    <ul class="list-group">
         <li class="list-group-item" 
            v-for="(item, index) in notas" :key="index" >
          <span class="badge badge-primary float-right">
            {{item.updated_at}}
          </span>
          <p>{{item.nombre}}</p>
          <p>{{item.descripcion}}</p>
          <p>
            <button class="btn btn-warning btn-sm" 
                @click="editarFormulario(item)">Editar</button>
            <button class="btn btn-danger btn-sm" 
                @click="eliminarNota(item, index)">Eliminar</button>
          </p>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notas: [],
      modoEditar: false,
      nota: {nombre: '', descripcion: ''}
    }
  },
  created(){
    axios.get('/notas').then(res=>{
      this.notas = res.data;
    })
  },
  methods:{
    agregar(){
      if(this.nota.nombre.trim() === '' || this.nota.descripcion.trim() === ''){
        alert('Debes completar todos los campos antes de guardar');
        return;
      }
      const notaNueva = this.nota;
      this.nota = {nombre: '', descripcion: ''};    
      axios.post('/notas', notaNueva)
        .then((res) =>{
          const notaServidor = res.data;
          this.notas.push(notaServidor);
        })
    },
    editarFormulario(item){
      this.nota.nombre = item.nombre;
      this.nota.descripcion = item.descripcion;
      this.nota.id = item.id;
      this.modoEditar = true;
    },
    editarNota(nota){
      const params = {nombre: nota.nombre, descripcion: nota.descripcion};
      axios.put(`/notas/${nota.id}`, params)
        .then(res=>{
          this.modoEditar = false;
          const index = this.notas.findIndex(item => item.id === nota.id);
          this.notas[index] = res.data;
        })
    },
    eliminarNota(nota, index){
      const confirmacion = confirm(`Eliminar nota ${nota.nombre}`);
      if(confirmacion){
        axios.delete(`/notas/${nota.id}`)
          .then(()=>{
            this.notas.splice(index, 1);
          })
      }
    },
    cancelarEdicion(){
      this.modoEditar = false;
      this.nota = {nombre: '', descripcion: ''};
    }
  }
}
</script>
```
<!-- NotasComponent.vue
```html
<template>
  <div>
    <formulario @nueva="agregarNota" />
    <hr>
    <h3>Lista de notas:</h3>
    <ul class="list-group">
      <nota v-for="(item, index) in notas" :key="index" :nota="item" 
        @editar="actualizarNota(index, ...arguments)"
        @eliminar="eliminarNota(index)" />
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notas: []
    }
  },
  created(){
    axios.get('/notas').then(res=>{
      this.notas = res.data;
      console.log(this.notas);
    })
  },
  methods:{
    agregarNota(nota){
      this.notas.push(nota);
    },
    actualizarNota(index, notaActualizada){
      this.notas[index] = notaActualizada;
    },
    eliminarNota(index){
      this.notas.splice(index, 1);
    }
  }
}
</script>
```
NotaComponent.vue
```html
<template>
  <div>
    <li class="list-group-item">
      <span class="badge badge-primary float-right">{{nota.updated_at}}</span>
      <input type="text" class="form-control mb-2" v-if="modoEditar" v-model="nota.nombre">
      <p v-else>{{nota.nombre}}</p>

      <input type="text" class="form-control mb-2" v-if="modoEditar" v-model="nota.descripcion">
      <p v-else>{{nota.descripcion}}</p>
      <p>
        <button class="btn btn-success btn-sm" v-if="modoEditar" @click="editarNota()">Guardar</button>
        <button class="btn btn-warning btn-sm" v-else @click="modoEditar = true">Editar</button>
        <button class="btn btn-danger btn-sm" @click="eliminarNota()">Eliminar</button>
      </p>
    </li>
  </div>
</template>

<script>
export default {
  props: ['nota'],
  data() {
    return {
      modoEditar: false
    }
  },
  methods:{
    editarNota(){
      const params = {nombre: this.nota.nombre, descripcion: this.nota.descripcion};
      axios.put(`/notas/${this.nota.id}`, params)
        .then(res=>{
          this.modoEditar = false;
          this.$emit('editar', res.data);
        })
    },
    eliminarNota(){
      const confirmacion = confirm(`Eliminar nota ${this.nota.nombre}`);
      if(confirmacion){
        axios.delete(`/notas/${this.nota.id}`)
          .then(()=>{
            this.$emit('eliminar');
          })
      }
    }
  }
}
</script>
```
FormularioComponent.vue
```html
<template>
  <div>
    <h3>Agregar nueva nota</h3>
    <form @submit.prevent="agregar">
      <input type="text" class="form-control mb-2" placeholder="Nombre de la nota" v-model="nota.nombre">
      <input type="text" class="form-control mb-2" placeholder="Descripción de la nota" v-model="nota.descripcion">
      <button class="btn btn-primary" type="submit">Agregar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nota: {nombre: '', descripcion: ''}
    }
  },
  methods:{
    agregar(){
      const notaNueva = this.nota;
      this.nota = {nombre: '', descripcion: ''};
      
      axios.post('/notas', notaNueva)
        .then((res) =>{
          const notaServidor = res.data;
          this.$emit('nueva', notaServidor);
        })

    }
  }
}
</script>
``` -->
## app.js
```js
require('./bootstrap');

window.Vue = require('vue');

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('tareas', require('./components/TareasComponent.vue').default);

const app = new Vue({
    el: '#app',
});
```









