const fs = require('fs');
const path = require('path');
const dirs = ['d:\\Pet Care', 'd:\\Pet Care\\user', 'd:\\Pet Care\\admin'];

dirs.forEach(dir => {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
      const p = path.join(dir, file);
      let content = fs.readFileSync(p, 'utf8');
      if (!content.includes('<meta name="view-transition"')) {
        content = content.replace('</head>', '  <meta name="view-transition" content="same-origin">\n</head>');
        fs.writeFileSync(p, content);
      }
    }
  });
});
console.log('Done');
