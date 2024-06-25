document.getElementById("sync").addEventListener('click', async function() {
    chrome.runtime.sendMessage({ action: 'getAllTabUrls' }, async response => {
        const userId = chrome.runtime.id;

        let urls = response.urls.map(url => cleanUrl(url));
        // Send only unique URLs
        urls = [...new Set(urls)];
    
        console.log('Current tab urls =', urls);
        console.log('Total local URLs = ', urls.length);
        console.log('Unique ID = ', userId);
        
        const serverResponse = await fetch('http://localhost:4200/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ urls, userId })
        });
    
        const jsonResponse = await serverResponse.json();
        if ('error' in jsonResponse) {
            console.error('Something went wrong:', jsonResponse.error);
        }
    
        const openUrls = jsonResponse.data;
        console.log('Opening these in new tabs', openUrls);
        for (const url of openUrls) {
            chrome.tabs.create({
                url
            });
        } 
    });
});

function cleanUrl(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
        if (key.startsWith('utm_')) {
            urlObj.searchParams.delete(key);
        }
    });
    urlObj.pathname = urlObj.pathname.replace(/\/+$/, '');
    return urlObj.toString();
}
