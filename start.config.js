module.exports = {
    apps : [
    {
      name      : "Alarm Clock",
      script    : "./index.js",
      instances : "1",
      exec_mode : "fork",
      env: {
        NODE_ENV: "production",
        PORT: 80    
      }
    }]
}