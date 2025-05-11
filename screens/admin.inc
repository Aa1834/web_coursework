<h1> Admin Screen </h1>
<button id='my-button'>Start Timer</button>
<button id='stop-timer'>Stop</button>
<button id='clear-results'>Reset</button>
<button id = 'marshals-button'>Count</button>
<article id = 'timer-display'>00:00:00:00</article>
<section id = 'table-display'></section> <!-- Added section for the table display-->
<table id = 'table-display'>
    <thead>
        <tr>
            <th>Position</th>
            <th>Time Recorded</th>
            <th>Racer</th>
        </tr>
    </thead>
    <tbody id = "results-body">
        <tr>
            <td>
                <form id = "racer-form">
                    <input type = "text" name = "shirtNumber" placeholder = "Enter Shirt Number" />
                </form>
            </td>
        </tr>

    </tbody>
</table> <!-- End of added table html code today-->
<ol id='runners-results'></ol>

<dialog id="favDialog">
    <form>
        <p>
            <label>
                Server Address/Name :
                <input type="text" id="serverName"/>
            </label>
        </p>
        <div>
            <button value="cancel" formmethod="dialog">Cancel</button>
            <button id="confirmBtn" value="default">Confirm</button>
        </div>
    </form>
</dialog>
<p>
    <button id="showDialog">Settings</button>
</p>
<output></output>