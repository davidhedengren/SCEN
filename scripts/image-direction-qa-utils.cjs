const path = require('node:path');

function resolveServedPath(root, urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(String(urlPath || '')); }
  catch { return null; }
  if (decoded.includes('\0')) return null;
  const relativeRequest = decoded.replace(/^[/\\]+/, '');
  const file = path.resolve(root, relativeRequest);
  const relative = path.relative(root, file);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) return null;
  return file;
}

module.exports = { resolveServedPath };
