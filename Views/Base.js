module.exports = function(response, template) {
    this.response = response;
    this.template = template;
};
module.exports.prototype = {
    extend: function(properties) {
        let Child = module.exports;
        Child.prototype = module.exports.prototype;
        for(let key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    render: function(data) {
        if(this.response && this.template) {
            this.response.render(this.template, data);
        } else {
            this.response.render('404page', {});
        }
    }
};
