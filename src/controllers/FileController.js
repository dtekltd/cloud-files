import drive from '../libs/google/drive.js';
import mega from '../libs/mega.js';
import debug from 'debug';


const log = debug('controller:file');

const fileInfo = async (ctx) => {
    const result = {
        success: false,
        data: null,
    };

    try {
        const url = ctx.query.url;
        if (url) {
            if (/mega/.test(url)) {
                result.data = await mega.fileInfo(url);
                result.success = true;
            } else if (/google/.test(url)) {
                const regEx = /\/(folders|file\/\w+)\/([\w\-]+)/.exec(url);
                // result.data = {regEx, url};
                if (regEx.length === 3) {
                    result.data = await drive.fileInfo(regEx[2]);
                    result.success = true;
                }
            }
        }
    } catch (e) {
        log(e.message, e);
        result.success = false;
        result.error = e.message;
    }

    ctx.body = result;
}

const fileContents = async (ctx) => {
    const result = {
        success: false,
        data: null,
    };

    try {
        const url = ctx.query.url;
        if (url) {
            if (/mega/.test(url)) {
                result.data = await mega.fileContents(url);
                result.success = true;
            } else if (/google/.test(url)) {
                const regEx = /\/(folders|file\/\w+)\/([\w\-]+)/.exec(url);
                if (regEx.length === 3) {
                    result.data = await drive.fileContents(regEx[2]);
                    result.success = true;
                }
            }
        } else {
            result.success = false;
        }
    } catch (e) {
        log(e.message, e);
        result.success = false;
        result.error = e.message;
    }

    ctx.body = result;
};

export default { 
    fileInfo,
    fileContents,
};
