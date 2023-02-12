// load page
async function load() {
    createNavbar();
    if (sessionStorage.getItem("LOGGED_IN_USER")) { //if logged in user exists - load users and hikes
        await loadUsers();
        await loadHikes();
        loadMyHikes();
    }
}

//load users 
async function loadUsers() {
    fetch(`http://localhost:3000/api/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((users) => {
            sessionStorage.setItem("USERS", JSON.stringify(users)); //DEFINE OBJECT USERS 
        });
}

//load hike
async function loadHikes() {
    const organizerTableElem = document.getElementById("hikes-table-organizer");
    const findAHikeTableElem = document.getElementById("find-a-hike-table");

    fetch(`http://localhost:3000/api/hikes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((hikes) => {
            sessionStorage.setItem("HIKES", JSON.stringify(hikes)); //DEFINE OBJECT HIKES 
            const loggedInUser = sessionStorage.getItem("LOGGED_IN_USER");
            const sessionUsers = sessionStorage.getItem("USERS");
            const myHikes = [];

            if (loggedInUser && sessionUsers) {
                const user = JSON.parse(loggedInUser);
                const users = JSON.parse(sessionUsers);

                for (let hike of hikes) {
                    let hike_counselor;
                    let hike_organizer;

                    if (hike.counselor_id) {
                        hike_counselor = users.find(
                            (user) => user.id === hike.counselor_id
                        );
                        if (
                            hike_counselor.id === user.id &&
                            user.user_type === "counselor"
                        ) {
                            myHikes.push(hike);
                        }
                    }

                    if (hike.organizer_id) {
                        hike_organizer = users.find(
                            (user) => user.id === hike.organizer_id
                        );
                        if (
                            hike_organizer.id === user.id &&
                            user.user_type === "travel-organizer"
                        ) {
                            myHikes.push(hike);
                        }
                    }

                    // adding only oraganizer's hikes to his 'My Hikes - Organizer' table
                    if (
                        hike_organizer?.username === user.username &&
                        organizerTableElem
                    ) {
                        let html = `
          <tr id="hike-${hike.id}">
            <td>${formatDate(hike.hike_date)}</td>
            <td>${hike.area}</td>
            <td>${hike.num_of_participants}</td>
            <td>${hike.participants_age_group}</td>
            <td>${hike.hike_details}</td>
            <td>${hike.salary}</td>
            <td>${hike_organizer ? hike_organizer?.fullname : ""}</td>
            <td>${hike_organizer ? hike_organizer?.phone : ""}</td>
            `;

                        //show registered counselor deatails if exists
                        if (hike_counselor) {
                            html += `<td>
                  <strong class="show-details" onclick="showCounselor('${hike_counselor?.username}')">${hike_counselor?.fullname}<strong>
                </td>`;
                        } else {
                            html += `<td></td>`;
                        }
                        html += `<td><button onclick="removeHike('${hike.id}')">Remove</button></td></tr>`;

                        organizerTableElem.innerHTML += html;
                    }

                    //show hikes in the 'find a hike' table only if status is 'open' (no register counselor -> open)
                    if (findAHikeTableElem && hike.status === "open") {
                        findAHikeTableElem.innerHTML += `
          <tr id="hike-${hike.id}">
            <td>${formatDate(hike.hike_date)}</td>
            <td>${hike.area}</td>
            <td>${hike.num_of_participants}</td>
            <td>${hike.participants_age_group}</td>
            <td>${hike.hike_details}</td>
            <td>${hike.salary}</td>
            <td>${hike_organizer ? hike_organizer?.fullname : ""}</td>
            <td>${hike_organizer ? hike_organizer?.phone : ""}</td>
            <td>
              <button onclick="registerToHike('${hike.id}')">Register</button>
            </td>
          </tr>
        `;
                    }
                }

                sessionStorage.setItem("MY_HIKES", JSON.stringify(myHikes));
            }
        });
}

//lode my hikes
function loadMyHikes() {
    //show hikes in users 'My Hikes-Counselor' table
    if (sessionStorage.getItem("MY_HIKES")) {
        const users = JSON.parse(sessionStorage.getItem("USERS"));
        const user = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));
        const hikes = JSON.parse(sessionStorage.getItem("MY_HIKES"));
        const consulerTableElem = document.getElementById(
            "hikes-table-counselor"
        );

        if (consulerTableElem) {
            let myHikes = hikes?.filter((h) => h.counselor_id === user.id);

            for (let hike of myHikes) {
                const hike_organizer = users.find(u => u.id === hike.organizer_id);
                consulerTableElem.innerHTML += `
          <tr id="hike-${hike.id}">
            <td>${formatDate(hike.hike_date)}</td>
            <td>${hike.area}</td>
            <td>${hike.num_of_participants}</td>
            <td>${hike.participants_age_group}</td>
            <td>${hike.hike_details}</td>
            <td>${hike.salary}</td>
            <td>${hike_organizer.fullname}</td>
            <td>${hike_organizer.phone}</td>
          </tr>`;
            }
        }
    }
}

//format date function
function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
}

function registerToHike(id) {
    //define logged in user (who registered) as the hike counselor
    const loggedInUser = JSON.parse(sessionStorage.getItem("LOGGED_IN_USER"));

    fetch(`http://localhost:3000/api/hikes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "closed",
            counselor_id: loggedInUser.id,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.affectedRows === 1 || response.changedRows === 1) {
                alert("You just have registered to this hike! well done :)");
                window.location.reload();
            } else {
                console.log(response);
                alert("Sorry there was a problem during register to this hike");
            }
        });
}

//remove hike function 
function removeHike(id) {
    fetch(`http://localhost:3000/api/hikes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.affectedRows === 1 || response.changedRows === 1) {
                alert("You just have deleted this hike! well done :)");
                window.location.reload();
            } else {
                console.log(response);
                alert("Sorry there was a problem during removing this hike");
            }
        });
}

//function to show 'more details' on registered counselor
function showCounselor(username) {
    const user = JSON.parse(sessionStorage.getItem("USERS")).find(
        (u) => u.username === username
    );
    if (user) {
        const template = `
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h3>${user.fullname}</h3>
          <p>Phone: ${user.phone}</p>
          <p>Birth Date: ${formatDate(user.birthdate)}</p>
          <p>Experience: ${user.experience}</p>
        </div>
      </div>
    `;
        document.body.innerHTML += template;

        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
}

//navBar that change according to the type of logged-in user
function createNavbar() {
    // Navbar
    const navbar = document.getElementById("navBar");

    if (navbar) {
        navbar.innerHTML = "";
        if (sessionStorage.getItem("LOGGED_IN_USER")) {
            const userType = JSON.parse(
                sessionStorage.getItem("LOGGED_IN_USER")
            ).user_type;

            let item;
            if (userType === "counselor") {
                item = document.createElement("a");
                item.href = "find-a-hike.html";
                item.innerText = "Find A Hike";
                if (window.location.pathname === "/find-a-hike.html") {
                    item.classList.add("active");
                }
                navbar.innerHTML += item.outerHTML;

                item = document.createElement("a");
                item.href = "my-hikes-counselor.html";
                item.innerText = "My Hikes";
                if (window.location.pathname === "/my-hikes-counselor.html") {
                    item.classList.add("active");
                }
                navbar.innerHTML += item.outerHTML;
            } else if (userType === "travel-organizer") {
                item = document.createElement("a");
                item.href = "my-hikes-organizer.html";
                item.innerText = "My Hikes";
                if (window.location.pathname === "/my-hikes-organizer.html") {
                    item.classList.add("active");
                }
                navbar.innerHTML += item.outerHTML;

                item = document.createElement("a");
                item.href = "add-hike.html";
                item.innerText = "Add Hikes";
                if (window.location.pathname === "/add-hike.html") {
                    item.classList.add("active");
                }
                navbar.innerHTML += item.outerHTML;
            }

            item = document.createElement("a");
            item.href = "index.html";
            item.innerText = "Log Out";
            navbar.innerHTML += item.outerHTML;
        } else {
            let item;
            item = document.createElement("a");
            item.href = "index.html";
            item.innerText = "Log In";
            if (window.location.pathname === "/index.html") {
                item.classList.add("active");
            }
            navbar.innerHTML += item.outerHTML;

            item = document.createElement("a");
            item.href = "create-new-account.html";
            item.innerText = "Create New Account";
            if (window.location.pathname === "/create-new-account.html") {
                item.classList.add("active");
            }
            navbar.innerHTML += item.outerHTML;
        }
    }
}
