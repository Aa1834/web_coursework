const OFFLINE_CACHE = 1;
const CACHE = 'cw-v1';
const OFFLINE_URL = 'index.html';

/*const CACHEABLE = [
    '/',
    '/webpages/offline.html'
]; */

async function prepareCache(){
    const c = await caches.open(CACHE)
    await c.add(new Request(OFFLINE_URL,{cache: "reload"}));
}