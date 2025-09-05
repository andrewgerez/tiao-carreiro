<div align="center">
  <h3 align="center">Tiao Carreiro</h3>

  <p align="center">
    A complete music management and voting system, composed of a Laravel API and a responsive React UI.
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>


## About The Project
Full-stack application developed with Laravel and React.

### Built With

This project was developed using the following technologies:

* [![Laravel][Laravel.com]][Laravel-url]
* [![React.js][React.js]][React-url]


## Getting Started

Prerequisites for installing and running the application locally.

### Prerequisites

* composer
  ```sh
  https://getcomposer.org
  https://nodejs.org/pt
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/andrewgerez/tiao-carreiro.git
   ```
2. Install packages
   ```sh
   1. cd tiao-carreiro-backend
   2. composer install
   3. cp .env.example .env
   4. php artisan key:generate
   5. # DB_DATABASE=music_system
   6. # DB_USERNAME=user
   7. # DB_PASSWORD=password
   8. php artisan migrate
   9. php artisan db:seed
   
   1. cd tiao-carreiro-frontend
   2. npm install
   3. cp .env.example .env
   ```
3. Run the local server
   ```
   php artisan serve
   npm run dev
   ```


## Contact

Andrew Gerez - [Linkedin](https://www.linkedin.com/in/andrewgerez/) - andrewgerez18@gmail.com

Project Link: [https://github.com/andrewgerez/tiao-carreiro](https://github.com/andrewgerez/tiao-carreiro)


[product-screenshot]: src/assets/controlmoney.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
