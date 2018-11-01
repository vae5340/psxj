/**
 * analyse usage 
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
      stop: impl.stop
    };
    
    return exports;
  };
});
