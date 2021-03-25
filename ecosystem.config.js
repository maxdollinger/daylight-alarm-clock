module.exports = {
    apps : [
    {
      name      : "alarm_clock",
      script    : "./index.js",
      instances : "1",
      exec_mode : "fork",
      max_memory_restart:  "100M",
      watch : true,
      ignore_watch: ["node_modules"],
      post_update: ["npm install", "npm install pigpio"],
      env: {
        IPFILTER: false,
        IPV6: "",
        IPV4: '',
        NODE_ENV: "production",
        PORT: 80    
      }
    }]
}