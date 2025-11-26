import { File } from 'megajs';
import moment from 'moment';
import debug from 'debug';


const log = debug('libs.mega');

const _fileContents = (file, folder = null) => {
    const data = {
        name: file.name,
        dirname: folder ? folder.name : null,
        isfolder: !!file.type,
        modified: (file.timestamp ? moment.unix(file.timestamp) : moment())
            .format('ddd, DD MMM YYYY hh:mm:ss +0000'),
    };
    
    if (file.type) {
        // folder
        data._totalSize = 0;
        data._maxFileSize = 0;
        data.contents = [];

        if (file.children) {
            // not empty folder!
            file.children.forEach(child => {
                const childData = _fileContents(child, data);
                if (childData.isfolder) {
                    data._totalSize += childData._totalSize;
                }
                data.contents.push(childData);
            });
        }

        if (folder) {
            if (data._maxFileSize > folder._maxFileSize) {
                folder._maxFileSize = data._maxFileSize;
            }
        }
    } else {
        // file
        data.size = file.size;

        if (folder) {
            folder._totalSize += file.size;
            if (data.size > folder._maxFileSize) {
                folder._maxFileSize = data.size;
            }
        }
    }

    return data;
}

/**
 * https://mega.nz/folder/N8FgzC4T#tMxIDRC1e_6GwCQVc7kG1A
 * https://mega.nz/folder/A8t3Fara#6ZH9x2z4WpXxcJ470ORrEA
 * https://mega.nz/file/IsUQ0CZR#bl7r3GYYPGKaWl4q8Qevw_5234GwsD_TqJZNhpEt_lg
 * @param url mega URL
 * @returns {Promise<{size: *, name, modified: string, dirname: (*|null), isfolder: boolean}>}
 */
const fileContents = async (url) => {
    log('parseContent:', url);

    const file = File.fromURL(url);

    // Load file attributes
    await file.loadAttributes();

    // return _fileContents(file);
    const contents = _fileContents(file);

    if (contents._totalSize === undefined) {
        contents._totalSize = contents.size;
        contents._maxFileSize = contents.size;
    }

    return contents;
}

const fileInfo = async (url) => {
    log('isAvalable:', url);
    const file = File.fromURL(url);

    // Load file attributes
    await file.loadAttributes();

    return {
        name: file.name,
        size: file.size,
        isfolder: !!file.type,
        modified: (file.timestamp ? moment.unix(file.timestamp) : moment())
            .format('ddd, DD MMM YYYY hh:mm:ss +0000'),
    };
}

export default {
    fileInfo,
    fileContents,
};
