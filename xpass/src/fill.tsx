import { List, Icon, ActionPanel, Action, Clipboard } from "@raycast/api";
import { getCredential, getPasswordNames } from "./pass";
import { execSync } from "child_process";

export default function Command() {
  const credentialNames = getPasswordNames();

  return (
    <List>
      {credentialNames.map((credentialName: string) => (
        <List.Item title={credentialName} icon={Icon.Lock} key={credentialName}
          actions={
            <ActionPanel>
              <Action
                title="Fill username, password and copy OTP token"
                onAction={() => fill(credentialName, { u: true, p: true, t: true })}
              />
              <Action title="Fill username"
                onAction={() => fill(credentialName, { u: true, p: false, t: false })}
                shortcut={{ modifiers: ["ctrl"], key: "u" }}
              />
              <Action title="Fill password"
                onAction={() => fill(credentialName, { u: false, p: true, t: false })}
                shortcut={{ modifiers: ["ctrl"], key: "p" }}
              />
              <Action title="Fill OTP token"
                onAction={() => fill(credentialName, { u: false, p: false, t: true })}
                shortcut={{ modifiers: ["ctrl"], key: "t" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function fill(credentialName: String, fill: { u: boolean, p: boolean, t: boolean }) {
  const credential = getCredential(credentialName);

  let commands: String[] = [];

  if (fill.t && credential.token) {
    await Clipboard.copy(credential.token);
  }

  if (fill.u && credential.username) {
    commands.push(`t:${JSON.stringify(credential.username)}`);
  }

  if (fill.p && credential.password) {
    if (fill.u && credential.username) {
      commands.push('kp:tab');
    }

    commands.push(`t:${JSON.stringify(credential.password)}`);
  }

  execSync(`cliclick kd:cmd t:w ku:cmd ${commands.join(' ')}`);
}
