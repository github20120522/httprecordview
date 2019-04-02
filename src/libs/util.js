let util = {

};
util.title = function (title) {
    title = title ? title : 'iViewing...';
    window.document.title = title;
};

export default util;
