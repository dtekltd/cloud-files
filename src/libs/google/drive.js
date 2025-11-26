import debug from 'debug';
import { google } from 'googleapis';
import auth from './auth.js';


let drive = null;
const log = debug('libs.google.drive');

/**
 * Login and create drive instance
 */
const init = async () => {
    const client = await auth.authorize();
    drive = google.drive({version: 'v3', auth: client});

    return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 */
const listFiles = async (fileId = null) => {
    let params = {
        pageSize: 10,
        fields: 'kind, nextPageToken, incompleteSearch, files(id,name,modifiedTime,size)',
        // fields: 'kind, nextPageToken, incompleteSearch, files(id,name,mimeType,createdTime,modifiedTime,size)',
    };
    if (fileId) {
       params = {
           ...params,
           ...{
               q: `'${fileId}' in parents and trashed=false`,
               corpora: 'user',
               supportsAllDrives: true,
               includeItemsFromAllDrives: true,
           }
       }
    }

    let res;
    let listFiles = [];

    do {
        res = await drive.files.list(params);
        const files = res.data.files;

        if (files.length > 0) {
            listFiles = [...listFiles, ...res.data.files];
        } else {
            log(fileId, 'No files found.');
        }

        // next page
        params.pageToken = res.data.nextPageToken;
    } while (res.data.nextPageToken);

    return listFiles;
}

/**
 * Get a file info.
 * @param fileId
 */
const fileInfo = async (fileId) => {
    const res = await drive.files.get({
        fileId,
        fields: 'id,name,modifiedTime,size',
    });
    return {
        name: res.data.name,
        isfolder: !res.data.size,
        modified: res.data.modifiedTime,
        size: res.data.size || 0,
    };
}

/**
 * Get a file info or folder contents.
 * @param fileId
 */
const fileContents = async (fileId) => {
    const res = await drive.files.get({
        fileId,
        fields: 'id,name,modifiedTime,size',
    });

    // return _fileContents(res.data);
    const contents = await _fileContents(res.data);

    if (contents._totalSize === undefined) {
        contents._totalSize = contents.size;
        contents._maxFileSize = contents.size;
    }

    return contents;
}

const _fileContents = async (file, folder = null) => {
    const data = {
        name: file.name,
        dirname: folder ? folder.name : null,
        isfolder: !file.size,
        modified: file.modifiedTime,
    };

    if (data.isfolder) {
        // folder
        data._totalSize = 0;
        data._maxFileSize = 0;
        data.contents = [];

        const children = await listFiles(file.id);
        for (const child of children) {
            const childData = await _fileContents(child, data);
            if (childData.isfolder) {
                data._totalSize += childData._totalSize;
            }
            data.contents.push(childData);
        }

        if (folder) {
            if (data._maxFileSize > folder._maxFileSize) {
                folder._maxFileSize = data._maxFileSize;
            }
        }
    } else {
        // file
        data.size = parseInt(file.size);

        if (folder) {
            folder._totalSize += data.size;
            if (data.size > folder._maxFileSize) {
                folder._maxFileSize = data.size;
            }
        }
    }

    return data;
}

export default {
    init,
    listFiles,
    fileInfo,
    fileContents,
}
