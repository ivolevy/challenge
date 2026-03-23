Stop-Process -Name php -Force -ErrorAction SilentlyContinue
Add-Content "php_bin\php.ini" "extension_dir = `"ext`"`r`n"
Add-Content "php_bin\php.ini" "extension=openssl`r`n"
Start-Process -NoNewWindow -FilePath ".\php_bin\php.exe" -ArgumentList "-S localhost:8000 -t backend"
