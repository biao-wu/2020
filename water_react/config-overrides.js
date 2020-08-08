const { override, fixBabelImports, addDecoratorsLegacy } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        style: 'css',
    }),
    //配置装饰器语法
    addDecoratorsLegacy()
);