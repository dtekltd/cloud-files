import drive from '../libs/google/drive.js';
import debug from 'debug';


const log = debug('controller:google');

const fileInfo = async (ctx) => {
    const result = {
        success: true,
        data: null,
    };

    try {
        result.data = await drive.fileInfo(ctx.query.fileId);
    } catch (e) {
        log(e.message, e);
        result.success = false;
        result.error = e.message;
    }

    ctx.body = result;
}

const fileContents = async (ctx) => {
    const result = {
        success: true,
        data: null,
    };

    try {
        result.data = await drive.fileContents(ctx.query.fileId);
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
