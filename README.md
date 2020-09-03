# Development server

- ### Set environment variables

  - `cp .env.example .env`

- ### Copy example image to needed directories

  - `cp server/server/example_pic.jpg server/server/media/gallery/example_pic.jpg`

  - `cp server/server/example_pic.jpg server/server/media/avatars/example_pic.jpg`

- ### Build docker

  - `docker-compose build`

- ### Install node modules

  - `docker-compose run client yarn`

- ### Run python migrations

  - `docker-compose run server python manage.py migrate`

- ### Run docker

  - `docker-compose up`

- ### Create superuser

  - `docker-compose run server python manage.py createsuperuser`

- ### Formatting python code
  - `docker-compose run server black server/`
