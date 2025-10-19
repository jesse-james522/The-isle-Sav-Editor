#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

const KEY = Buffer.from('31525b282e0cad9bd5d297d32486e58b', 'utf8');
// Terminator sequence "EL@$@!"
const LNTERM = Buffer.from([69, 76, 64, 36, 64, 33]);
const BLOCK_SIZE = 16;

function getTerminatorPos(data) {
  for (let i = data.length - LNTERM.length; i >= 0; i--) {
    if (data.slice(i, i + LNTERM.length).equals(LNTERM)) return i;
  }
  return -1;
}

// Decrypt ASCII-hex .sav → JS object
function decryptSav(buffer) {
  const hex = buffer.toString('utf8').trim();
  const ciphertext = Buffer.from(hex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ecb', KEY, null);
  decipher.setAutoPadding(false);
  const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  for (let i = 0; i < dec.length; i++) dec[i] = (dec[i] + 1) & 0xFF;
  let end = getTerminatorPos(dec);
  if (end === -1) end = dec.indexOf(0) !== -1 ? dec.indexOf(0) : dec.length;
  const jsonText = dec.slice(0, end).toString('utf8');
  return JSON.parse(jsonText);
}

// Encrypt JS object or JSON text → ASCII-hex .sav
function encryptSav(input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  let buf = Buffer.from(text, 'utf8');
  buf = Buffer.concat([buf, LNTERM]);
  for (let i = 0; i < buf.length; i++) buf[i] = (buf[i] - 1) & 0xFF;
  const pad = (BLOCK_SIZE - (buf.length % BLOCK_SIZE)) % BLOCK_SIZE;
  if (pad) buf = Buffer.concat([buf, Buffer.alloc(pad, 0)]);
  const cipher = crypto.createCipheriv('aes-256-ecb', KEY, null);
  cipher.setAutoPadding(false);
  const out = Buffer.concat([cipher.update(buf), cipher.final()]);
  return out.toString('hex').toUpperCase();
}

function usage() {
  console.log('Usage:');
  console.log('  decrypt: node isle_sav_tool.js decrypt <in.sav> [out.json]');
  console.log('  encrypt: node isle_sav_tool.js encrypt <in.json> [out.sav]');
}

function main() {
  const [mode, inPath, outPath] = process.argv.slice(2);
  if (!mode || !inPath) return usage();
  try {
    const data = fs.readFileSync(inPath);
    if (mode === 'decrypt') {
      const obj = decryptSav(data);
      const out = outPath || inPath.replace(/\.sav$/i, '.json');
      fs.writeFileSync(out, JSON.stringify(obj, null, 2));
      console.log('Decrypted →', out);
    } else if (mode === 'encrypt') {
      const text = data.toString('utf8');
      const hex = encryptSav(text.trim().startsWith('{') ? JSON.parse(text) : text);
      const out = outPath || inPath.replace(/\.json$/i, '.sav');
      fs.writeFileSync(out, hex);
      console.log('Encrypted →', out);
    } else {
      usage();
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

if (require.main === module) main();
