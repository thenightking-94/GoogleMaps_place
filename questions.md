1. Took me 6-7 hours to complete integrating login-logout feature with the dashboard, taking in invoice data.

2. Reluctance to work with static data prompted me to not develop any search feature, since our app is not connected to any database. It is not adept to storing user data in simple localStorage, as that would not be a good practice.A better approach would be to fetch the data entered by the user, and feed the data to a database server; so that further features like search functionality could have been designed.

3. An smart feature designed is activating the "generate-pdf" button with the help of computed react-hooks state only when user has entered details in all of the required fields. This has been achieved by simply checking the data stored as value in the input DOM elements.
Attaching a code snippet of the method :

/*switch button to activate pdf generation, when all the data fields have been filled up*/



    const calvalue = () => {
        var el = document.querySelectorAll("input[id='data']");
        var valuedata = [];
        if (el) {
            for (var i = 0; i < el.length; i++) {
                if (el[i].value) {
                    valuedata = [...valuedata, el[i].value];
                }
            }
        }
        var area = document.getElementById('item_des');
        if (area)
            if (area.value)
                valuedata.splice(1, 0, area.value);

        // console.log(valuedata)
        var counter = 0;
        for (var i = 0; i < valuedata.length; i++) {
            if (valuedata[i].length >= 1)
                counter++;
        }
        if (counter == 7)
            setdata(valuedata)

        else
            setdata(null);
    }

4. Any performance issue in production can be tracked using test-scripts, Network recording the API data fetch timing. QA team is responsible of such measures.
5. Libraries used in addition to react---> Redux , Material-UI (to make device responsiveness), react-to-pdf (pdf generation).

Deployed link : https://invoice-generator-pdf.vercel.app