/**
 * analyse tool 
 */
define([
],function(){
  "use strict";
  return function(impl){ //return a constructor
    var exports;
    
    exports = {
      name: impl.name,
      use: impl.use,
      init: impl.init,
      cancel: impl.cancel
    };
    
    return exports;
  };
});
