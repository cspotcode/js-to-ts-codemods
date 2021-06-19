import { wrapTransformer, parser } from '../helpers';

// Tell jscodeshift/recast to use the right parser
export {parser};

export default wrapTransformer(({fileInfo}) => {
    return fileInfo.source.replace(/\r\n?/g, '\n');
});
