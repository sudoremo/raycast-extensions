import { resolve as resolvePath } from 'path';
import { globSync } from 'glob';
import { execSync } from 'child_process';

const rootPath = resolvePath('/Users/rfritzsche/.password-store/');
const prefixExp = new RegExp(rootPath);

export function getPasswordNames() : string[] {
  return globSync('/**/*.gpg', { root: rootPath, dotRelative: true }).map((file: String) => {
    return file.replace(/\.gpg$/, '').replace(prefixExp, '').replace(/^\//, '');
  });
}

interface Credential {
  username?: string,
  password?: string,
  token?: string
}

export function getCredential(name: String): Credential {
  let output = execSync(`pass show ${name}`);
  let [password, username, tokenURL] = output.toString().split(/\r?\n/);

  username = username.replace(/^Username:\s+/, '');
  let token = undefined;

  if (tokenURL && tokenURL != '') {
    token = execSync(`pass otp ${name}`, { shell: '/bin/zsh' }).toString();
  }

  return { username, password, token };
}
