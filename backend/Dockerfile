
FROM php:8.4-fpm-bookworm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Instala as extensões principais do PHP
RUN docker-php-ext-install -j1 \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Instala o driver MySQL separadamente
RUN docker-php-ext-install -j1 pdo_mysql \
    && php -r "if (!extension_loaded('pdo_mysql')) { exit(1); }"

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --prefer-dist

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
