module.exports = {
    apps : [
    {
      name      : "alarm_clock",
      script    : "./index.js",
      instances : "1",
      exec_mode : "fork",
      max_memory_restart:  "100M",
      watch : false,
      ignore_watch: ["node_modules"],
      post_update: ["npm install", "npm install pigpio"],
      env: {
        NODE_ENV: "production",
        PORT: 80    
      }
    }]
}