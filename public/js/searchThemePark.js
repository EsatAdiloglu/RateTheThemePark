const themeparksearch = document.getElementById('themeParkForm');
const themeparkinp = document.getElementById('themeParkInput')
const tpsearchbutton = document.getElementById('themeparksearchbutton');

themeparksearch.addEventListener('submit', async (event) => {
    const res = event.preventDefault();

    const result = await fetch("/themepark/listofthemeparks", 
        {
            method:'POST',
            headers: {
                'Content-Type': 'application/json', // Set the appropriate Content-Type
              },
            body: JSON.stringify({ themeParkInput: themeparkinp.value })})
})