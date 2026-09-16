import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../assets/stack/', import.meta.url));
const entries = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (const entry of entries) {
  let mark;
  if (entry.format === 'png') {
    const png = fs.readFileSync(path.join(root, 'sources', entry.id + '.png'));
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    mark = '<svg viewBox="0 0 ' + width + ' ' + height + '"><image width="' + width + '" height="' + height + '" href="data:image/png;base64,' + png.toString('base64') + '"/></svg>';
  } else {
    mark = fs.readFileSync(path.join(root, 'sources', entry.id + '.svg'), 'utf8');
  }
  mark = mark.slice(mark.indexOf('<svg')).replace(/<\?xml[^>]*\?>/g, '');
  if (entry.color) mark = mark.replace('<svg ', '<svg fill="#' + entry.color + '" ');
  if (!mark.match(/viewBox="([^"]+)"/)) {
    const width = mark.match(/\bwidth="([\d.]+)"/)?.[1];
    const height = mark.match(/\bheight="([\d.]+)"/)?.[1];
    if (!width || !height) throw new Error('Missing dimensions: ' + entry.id);
    mark = mark.replace('<svg', '<svg viewBox="0 0 ' + width + ' ' + height + '"');
  }
  const iconSize = entry.iconSize || 18;
  mark = mark.replace(/<svg\b[^>]*>/, match => match
    .replace(/\s(?:width|height|x|y)="[^"]*"/g, '')
    .replace('<svg', '<svg x="' + (19 - iconSize / 2) + '" y="' + (16 - iconSize / 2) + '" width="' + iconSize + '" height="' + iconSize + '"'));
  // Widths reserve room for the original mark and a 13px system-font label
  const width = Math.ceil(47 + [...entry.label].reduce((sum, char) => sum + (/[MW]/.test(char) ? 10 : /[il.]/.test(char) ? 3.5 : 7.4), 0));
  for (const mode of ['light', 'dark']) {
    const dark = mode === 'dark';
    const tile = entry.tile ? '<rect x="8" y="5" width="22" height="22" rx="4" fill="#' + entry.tile + '"/>' : '';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="32" viewBox="0 0 ' + width + ' 32" role="img" aria-label="' + escape(entry.label) + '"><title>' + escape(entry.label) + '</title><rect x=".5" y=".5" width="' + (width-1) + '" height="31" rx="7" fill="' + (dark ? '#161b22' : '#ffffff') + '" stroke="' + (dark ? '#30363d' : '#d0d7de') + '"/>' + tile + mark + '<text x="37" y="20.5" fill="' + (dark ? '#e6edf3' : '#24292f') + '" font-family="Arial, sans-serif" font-size="13" font-weight="500">' + escape(entry.label) + '</text></svg>\n';
    fs.writeFileSync(path.join(root, entry.id + '-' + mode + '.svg'), svg);
  }
}
console.log('Generated ' + entries.length * 2 + ' stack badges');
