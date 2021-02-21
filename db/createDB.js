const store = {};

const proxys = {};

const typeCheck = (value, def) => {
     const { type } = def;

     if (type === 'array') {
          if (!Array.isArray(value) || value.length !== def.size) {
               throw new Error(`Only Arrays with the legnth: ${def.size} allowed`);
          }
     } else if (!(typeof value === type)) {
          throw new Error(`Type must be: ${type}`);
     }

     return true;
}

const validate = (value, def) => {
     const { values, min, max, validator, msg } = def;

     if (values && !values.includes(value)) throw new Error(`Only "${values}" allowed`);
     if ((min && value < min) && (max && value > max)) throw new Error(`Value must be between ${min} and ${max}`);
     if (validator && !validator(value)) throw new Error(msg || `Custom validator failed for value: ${value}`);

     return true;
}

const dataHandler = (name, scheme) => ({
     get: (obj, prop) => {
          if (scheme.hasOwnProperty(prop)) {
               const value = obj[prop];
               if (value) {
                    return value;
               } else {
                    return false;
               }
          } else {
               return false;
          }
     },
     set: (obj, prop, value) => {
          if (scheme.hasOwnProperty(prop)) {
               typeCheck(value, scheme[prop]);
               validate(value, scheme[prop]);
               obj[prop] = value;
               return obj[prop];
          } else {
               console.log(`Field ${prop} not found in ${name} db`);
               return false;
          }
     },
})

const dbHandler = dataProxy => ({
     get: (obj, prop) => {
          if(prop === 'data') return false;

          if(obj.hasOwnProperty(prop)) {
               return obj[prop];
          } else {
               return dataProxy[prop];
          }
     },
     set: (obj, prop, value) => {
          if(obj.hasOwnProperty(prop)) return false;

          if(value instanceof Function) {
               return obj[prop] = value;
          } else {
               return dataProxy[prop] = value
          }
     }
})

const createDB = (name, scheme) => {
     if (proxys.hasOwnProperty(name)) {
          return proxy[name];
     } else {
          const db = store[name] = {
               data: {},
          };

          Object.keys(scheme).forEach(el => {
               db.data[el] = scheme[el].default || null;
          });

          db.get = () => ({...db.data});
          const dataProxy = new Proxy(db.data, dataHandler(name, scheme));
          const dbProxy = new Proxy(db, dbHandler(dataProxy));
          proxys[name] = dbProxy;

          return proxys[name];
     }
}

module.exports = createDB;