exports.formateTime = (time = Date.now()) => (new Date(time)).toLocaleString('de-DE', {
     weekday: 'long',
     day: 'numeric',
     month: 'numeric',
     year: 'numeric',
     hour: '2-digit',
     minute: '2-digit'
 });