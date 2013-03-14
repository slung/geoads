GA.bind = function(fn, c) 
{
    return function() {
        return fn.apply(c || fn, arguments);
    };
};