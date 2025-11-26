import debug from 'debug';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

let client = null;
const log = debug('libs.google.auth');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is created
// automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), 'runtime', 'google_drive-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'runtime', 'google_drive-credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 */
const loadSavedCredentialsIfExist = () => {
    try {
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        log('loadSavedCredentialsIfExist', err.toString());
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 */
const saveCredentials = (client) => {
    try {
        const content = fs.readFileSync(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        fs.writeFileSync(TOKEN_PATH, payload);
    } catch (err) {
        log('saveCredentials', err.toString());
        return null;
    }
}

/**
 * Load or request or authorization to call APIs.
 */
const authorize = async () => {
    if (!client) {
        client = await loadSavedCredentialsIfExist();
    }
    if (!client) {
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
    }

    return client;
}

export default {
    authorize,
}
