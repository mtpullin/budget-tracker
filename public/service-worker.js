const App_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = App_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "/",
    "./public/index.html",
    "./public/css/style.css",
    "./public/js/idb.js",
    "./public/js/index.js",
    "./models/transaction.js",
    "./routes/api.js"
];

self.addEventListener('fetch', function(e){
    console.log('fetch request :' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request){
            if(request){
            console.log('loading cached site : '+ e.request.url)
            return request
            } else{
                console.log('site not cached, fetching : '+e.request.url)
                return fetch(e.request)
            }
        })
    )
})

self.addEventListener('intall', function(e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('creating cache :' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList){
            let cacheKeeplist = keyList.filter(function(key){
                return key.indexOf(App_PREFIX)
            })
            cacheKeeplist.push(CACHE_NAME)

            return Promise.all(
                keyList.map(function(key, i){
                    if(cacheKeeplist.indexOf(key)=== -1){
                        console.log('deleting cache :' + keyList[i])
                        return caches.delete(keyList[i])
                    }
                })
            )
        })
    )
})