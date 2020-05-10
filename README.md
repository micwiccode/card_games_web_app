# card_games_web_app
Several popular card games in new form of web application

To start server app first install XAMPP with PHP, then Composer
(https://symfony.com/doc/current/setup.html)

Turn on Apache and MySQL in XAMPP 

Then go to server folder and type:
`composer install`
to install packages

Init database:

`php bin/console doctrine:database:create`

`php bin/console doctrine:migrations:migrate`

`php bin/console doctrine:fixtures:load`

`symfony server:start`

Database will be created in: http://localhost/phpmyadmin/index.php

To run Angular with server use proxy and type
`npm start` instead of `ng serve`

