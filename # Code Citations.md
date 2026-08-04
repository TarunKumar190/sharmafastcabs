# Code Citations

## License: unknown
https://github.com/CassieRan/CassieRan.github.io/blob/65e3fa72a917a4c3fbbee3a29f2001d6067ff5ce/_posts/2018-07-09-how-to-config-apache-server-for-spa.md

```
**For the dev server** (running `npm run dev`), the config above now includes `historyApiFallback: true`, which will serve `index.html` for routes that don't match actual files.

**For production** (`https://sharmafastcabs.com`), you'll need to configure your server/hosting to redirect all routes to `index.html`. What platform is hosting your app? Here are the most common solutions:

**Node.js/Express Server:**
```javascript
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

**Netlify:** Add a `_redirects` file in your `public/` folder:
```
/* /index.html 200
```

**Vercel:** The routing is automatic for SPA apps

**Apache Server (`.htaccess` in root):**
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
```


## License: unknown
https://github.com/CassieRan/CassieRan.github.io/blob/65e3fa72a917a4c3fbbee3a29f2001d6067ff5ce/_posts/2018-07-09-how-to-config-apache-server-for-spa.md

```
**For the dev server** (running `npm run dev`), the config above now includes `historyApiFallback: true`, which will serve `index.html` for routes that don't match actual files.

**For production** (`https://sharmafastcabs.com`), you'll need to configure your server/hosting to redirect all routes to `index.html`. What platform is hosting your app? Here are the most common solutions:

**Node.js/Express Server:**
```javascript
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

**Netlify:** Add a `_redirects` file in your `public/` folder:
```
/* /index.html 200
```

**Vercel:** The routing is automatic for SPA apps

**Apache Server (`.htaccess` in root):**
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
```


## License: unknown
https://github.com/CassieRan/CassieRan.github.io/blob/65e3fa72a917a4c3fbbee3a29f2001d6067ff5ce/_posts/2018-07-09-how-to-config-apache-server-for-spa.md

```
**For the dev server** (running `npm run dev`), the config above now includes `historyApiFallback: true`, which will serve `index.html` for routes that don't match actual files.

**For production** (`https://sharmafastcabs.com`), you'll need to configure your server/hosting to redirect all routes to `index.html`. What platform is hosting your app? Here are the most common solutions:

**Node.js/Express Server:**
```javascript
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

**Netlify:** Add a `_redirects` file in your `public/` folder:
```
/* /index.html 200
```

**Vercel:** The routing is automatic for SPA apps

**Apache Server (`.htaccess` in root):**
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
```


## License: unknown
https://github.com/CassieRan/CassieRan.github.io/blob/65e3fa72a917a4c3fbbee3a29f2001d6067ff5ce/_posts/2018-07-09-how-to-config-apache-server-for-spa.md

```
**For the dev server** (running `npm run dev`), the config above now includes `historyApiFallback: true`, which will serve `index.html` for routes that don't match actual files.

**For production** (`https://sharmafastcabs.com`), you'll need to configure your server/hosting to redirect all routes to `index.html`. What platform is hosting your app? Here are the most common solutions:

**Node.js/Express Server:**
```javascript
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

**Netlify:** Add a `_redirects` file in your `public/` folder:
```
/* /index.html 200
```

**Vercel:** The routing is automatic for SPA apps

**Apache Server (`.htaccess` in root):**
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
```

