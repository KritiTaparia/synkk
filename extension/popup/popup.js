document.getElementById("sync").addEventListener('click', async function() {
    const tabs = await chrome.tabs.query({});
    const urls = tabs.map(tab => tab.url);
    // const userId = ;
    console.log('Current tab urls =', urls);
    // console.log('Current user =', userId);

    const response = await fetch('http://localhost:4200/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls })
    });
    const jsonResponse = await response.json();
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
