FROM php:8.3-fpm

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client

# Limpar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Copiar arquivos do composer
COPY composer.json composer.lock ./

# Instalar dependências PHP (sem scripts)
RUN composer install --no-dev --no-scripts --no-interaction

# Copiar código da aplicação
COPY . .

# Executar scripts do composer e otimizar autoload
RUN composer dump-autoload --optimize && php artisan package:discover --ansi

# Definir permissões
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expor porta
EXPOSE 8000

# Comando padrão
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]