module.exports = {
  title: 'Laravel',
  description: 'Aprende a utilizar Laravel en tus proyectos web',
  base: '/tutorial-laravel/',
  locales:{
    '/':{
      lang: 'es-ES'
    }
  },
  themeConfig:{
    nav: [
      { text: 'Guía', link: '/' },
      // { text: 'Guia', link: '/docs/' },
      { text: 'Youtube', link: 'https://youtube.com/bluuweb' },
    ],
    sidebar:[
        '/',
        '/bases-datos/',
        '/auth/',
        '/vue/',
        '/trucos/',
        '/db-relacional/',
        '/factorias/',
        '/api-rest/'
      ]
  }
 
}