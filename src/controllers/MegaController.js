import mega from '../libs/mega.js';
import debug from 'debug';


const log = debug('controller:mega');

const fileInfo = async (ctx) => {
    const result = {
        success: true,
        data: null,
    };

    try {
        result.data = await mega.fileInfo(ctx.query.url);
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
        result.data = await mega.fileContents(ctx.query.url);
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
