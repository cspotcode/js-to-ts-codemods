import { parser, wrapTransformer } from '../helpers';

export {parser};
export default wrapTransformer(function({fileInfo}) {
    return fileInfo.source.replace(/\t/g, '    ');
});
