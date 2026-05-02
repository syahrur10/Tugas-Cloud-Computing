FROM php:8.1-apache

# Copy semua file ke server Apache
COPY . /var/www/html/

# Aktifkan mod_rewrite (optional)
RUN a2enmod rewrite

# Set permission
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80