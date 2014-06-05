/**
 * @fileOverview view类
 * @author 行列
 * @version 1.1
 */
define('magix/view', function(require) {
    var Magix = require("./magix");
    var Event = require("./event");
    var Body = require("./body");
    var Router = require("./router");

    eval(Magix.include('../tmpl/view'));
    var Paths = {};
    var Suffix = '?t=' + Math.random();

    /*var ProcessObject = function(props, proto, enterObject) {
        for (var p in proto) {
            if (Magix.isObject(proto[p])) {
                if (!Has(props, p)) props[p] = {};
                ProcessObject(props[p], proto[p], 1);
            } else if (enterObject) {
                props[p] = proto[p];
            }
        }
    };*/


    var Tmpls = {}, Locker = {};
    VProto.fetchTmpl = function(path, fn) {
        var me = this;
        var hasTemplate = 'tmpl' in me;
        if (!hasTemplate) {
            if (Has(Tmpls, path)) {
                fn(Tmpls[path]);
            } else {
                var idx = path.indexOf('/');
                var name = path.substring(0, idx);
                if (!Paths[name]) {
                    Paths[name] = seajs.data.paths[name];
                }
                var file = Paths[name] + path.substring(idx + 1) + '.html';
                var l = Locker[file];
                var onload = function(tmpl) {
                    fn(Tmpls[path] = tmpl);
                };
                if (l) {
                    l.push(onload);
                } else {
                    l = Locker[file] = [onload];
                    $.ajax({
                        url: file + Suffix,
                        success: function(x) {
                            SafeExec(l, x);
                            delete Locker[file];
                        },
                        error: function(e, m) {
                            SafeExec(l, m);
                            delete Locker[file];
                        }
                    });
                }
            }
        } else {
            fn(me.tmpl);
        }
    };
    View.extend = function(props, statics, ctor) {
        var me = this;
        var BaseView = function(a) {
            me.call(this, a);
            if (ctor) {
                ctor.call(this, a);
            }
        }
        BaseView.extend = me.extend;
        return Magix.extend(BaseView, me, props, statics);
    };
    return View;
});