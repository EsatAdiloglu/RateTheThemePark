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

const themeparksearch2 = document.getElementById('themeParkLocationForm');
const themeparkinp2 = document.getElementById('themeParkLocationInput')
const tpsearchbutton2 = document.getElementById('themeparklocationbutton');

themeparksearch2.addEventListener('submit', async (event) => {
    const res = event.preventDefault();
    const result = await fetch("/themepark/listofthemeparkslocation", 
        {
            method:'POST',
            headers: {
                'Content-Type': 'application/json', // Set the appropriate Content-Type
              },
            body: JSON.stringify({ themeParkInput: themeparkinp2.value })})
})

const compareForm = document.getElementById("compare_input");
const firstSelect = document.getElementById("firstPark");
const secondSelect = document.getElementById("secondPark");

compareForm.addEventListener('submit', async (event) => {
  const res = event.preventDefault();
  const result = await fetch("/themepark/comparethemeparksresults", 
      {
          method:'POST',
          headers: {
              'Content-Type': 'application/json', // Set the appropriate Content-Type
            },
          body: JSON.stringify({ parkOne : firstSelect.value , parkTwo : secondSelect.value})})
})
