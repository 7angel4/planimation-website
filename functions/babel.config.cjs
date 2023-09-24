module.exports = function (api) {
    api.cache(true);
  
    const presets = [
      // Include your desired Babel presets here
      [
        "@babel/preset-env",
      ]
    ];
  
    const plugins = [
      // Include your desired Babel plugins here
    ];
  
    return {
      presets,
      plugins,
    };
};
  