import debug from 'debug';

const log = debug('controller:test');

const welcome = async (ctx) => {
    log('Welcome!');
    ctx.body = 'Welcome!';
};

export default { welcome };
