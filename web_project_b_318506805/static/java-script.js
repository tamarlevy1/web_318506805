//class User in order to create users objects
class User {
  constructor(username, password, fullname, phone, birthdate, userType, experience) {
    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.phone = phone;
    this.birthdate = birthdate;
    this.userType = userType;
    this.experience = experience;
  }
}

//class Hike in order to create hikes objects
class Hike {
  constructor(
        id,
        organizer,
        hikeDate,
        area,
        numberOfParticipants,
        participantsAgeGroup,
        salary,
        details,
        status
  ) {
      this.id = id;
      this.organizer = organizer;
      this.hikeDate = hikeDate;
      this.area = area;
      this.numberOfParticipants = numberOfParticipants;
      this.participantsAgeGroup = participantsAgeGroup;
      this.salary = salary;
      this.details = details;
      this.status = status;
  }
}

//array of users objects
const users = [
    new User(
        "dcohen",
        "12345",
        "David Cohen",
        "054-188-0291",
        "02/01/1994",
        "counselor",
      "bla bla bla"
    ),
    new User(
        "rilluz",
        "12345",
        "Rafi Illuz",
        "052-102-9817",
        "09/01/1995",
        "travel-organizer",
      "asoudaosduosda asiodu asoduaso dusao duiaso uisad"
    ),
    new User(
        "srom",
        "12345",
        "Rom Sabag",
        "050-102-0992",
        "12/09/1986",
        "counselor",
      "ausdhasuid asudih asdahs 7ashd ash dashd"
    ),
    new User(
        "tcohen",
        "12345",
        "Tali Cohen",
        "054-299-2134",
        "23/08/1991",
        "travel-organizer",
      "asduias 7a9shd sa78hd8as d"
    ),
];

//array of hikes objects
const hikes = [
    new Hike(
        "ashd87hasd",
        JSON.stringify(users[1]),
        "23/01/2023",
        "North",
        "20-40",
        "50-70",
        100,
        "free text",
        "open"
    ),
    new Hike(
        "98790ju89j1",
        JSON.stringify(users[3]),
        "01/02/2023",
        "Center",
        "20-80",
        "50-70",
        250,
        "free text",
        "open"
    ),
];

// load page
function load() {
  createNavbar();
}

/*// Update users && hikes in localStorage from dummy data if no hikes and users added
if (!localStorage.getItem("USERS") && !localStorage.getItem("HIKES")) {
  localStorage.setItem("USERS", JSON.stringify(users));
  localStorage.setItem("HIKES", JSON.stringify(hikes));
}*/

// Load hikes from store and show in table
if (localStorage.getItem('HIKES')) {
  const hikes = JSON.parse(localStorage.getItem("HIKES"));
  const loggedInUser = localStorage.getItem("LOGGED_IN_USER");
  const organizerTableElem = document.getElementById("hikes-table-organizer");
  const findAHikeTableElem = document.getElementById("find-a-hike-table");
  
  //if exist logged in user
  if (loggedInUser) {
    for (let hike of hikes) {
      let hikeCounselor;
      let hikeOrganizer;
      
      //if there is a hike counselor -> save him
      if (hike.counselor) {
        hikeCounselor = JSON.parse(hike.counselor);
      }

      //if there is a hike organizer -> save him
      if (hike.organizer) {
        hikeOrganizer = JSON.parse(hike.organizer);
      }

      // adding only oraganizer's hikes to his 'My Hikes - Organizer' table
      if ((hikeOrganizer.username === JSON.parse(loggedInUser).username) && organizerTableElem) {
        let html = `
          <tr id="hike-${hike.id}">
            <td>${hike.hikeDate}</td>
            <td>${hike.area}</td>
            <td>${hike.numberOfParticipants}</td>
            <td>${hike.participantsAgeGroup}</td>
            <td>${hike.details}</td>
            <td>${hike.salary}</td>
            <td>${hikeOrganizer ? hikeOrganizer?.fullname : ''}</td>
            <td>${hikeOrganizer ? hikeOrganizer?.phone : ''}</td>
            `;

            //show registered counselor deatails if exists
            if (hikeCounselor) {
             html += `<td>
                  <strong class="show-details" onclick="showCounselor('${hikeCounselor?.username}')">${hikeCounselor?.fullname}<strong>
                </td>
              </tr>`; 
            }
            else {
              html += `<td></td></tr>`;
            }
            
            organizerTableElem.innerHTML += html;
      }

      //show hikes in the 'find a hike' table only if status is 'open' (no register counselor -> open)
      if (findAHikeTableElem && hike.status === 'open') {
          findAHikeTableElem.innerHTML += `
          <tr id="hike-${hike.id}">
            <td>${hike.hikeDate}</td>
            <td>${hike.area}</td>
            <td>${hike.numberOfParticipants}</td>
            <td>${hike.participantsAgeGroup}</td>
            <td>${hike.details}</td>
            <td>${hike.salary}</td>
            <td>${hikeOrganizer ? hikeOrganizer?.fullname : ""}</td>
            <td>${hikeOrganizer ? hikeOrganizer?.phone : ""}</td>
            <td>
              <button onclick="registerToHike('${hike.id}')">Register</button>
            </td>
          </tr>
        `;
      }
    }
  }
}

//show hikes in users 'My Hikes-Counselor' table
if (localStorage.getItem('MY_HIKES')) {
  const consulerTableElem = document.getElementById("hikes-table-counselor");

  if (consulerTableElem) {
    let myHikes = JSON.parse(localStorage.getItem("MY_HIKES"))?.filter(
        (h) =>
            JSON.parse(h.counselor)?.username ===
            JSON.parse(localStorage.getItem("LOGGED_IN_USER"))?.username
    );
    
    for (let hike of myHikes) {
        const hikeOrganizer = JSON.parse(hike.organizer);
        consulerTableElem.innerHTML += `
          <tr id="hike-${hike.id}">
            <td>${hike.hikeDate}</td>
            <td>${hike.area}</td>
            <td>${hike.numberOfParticipants}</td>
            <td>${hike.participantsAgeGroup}</td>
            <td>${hike.details}</td>
            <td>${hike.salary}</td>
            <td>${hikeOrganizer.fullname}</td>
            <td>${hikeOrganizer.phone}</td>
          </tr>`;
    }
  }
}

function registerToHike(id) {
  let hikes = localStorage.getItem("HIKES");
  if (hikes) {
      let myHikes = [];
      if (localStorage.getItem("MY_HIKES")) {
        //convert myhikes to js array
        myHikes = JSON.parse(localStorage.getItem("MY_HIKES"));
      }

      const allHikes = JSON.parse(hikes);

      //find the hike that was sent in the function 
      let hike = allHikes.find(h => h.id === id);
    
      //if the hike found 
      if (hike) {
        //change its status to closed
        hike.status = 'closed';

        //define logged in user (who registered) as the hike counselor
        hike.counselor = localStorage.getItem("LOGGED_IN_USER");
        
        //add the hike to  myHikes array
        myHikes.push(hike); 
        
        //saves new myHikes array in local storage
        localStorage.setItem("MY_HIKES", JSON.stringify(myHikes));
      
        //saves new hikes array in local storage without the registered hike 
        localStorage.setItem("HIKES", JSON.stringify([ hike, ...allHikes.filter(h => h.id !== hike.id) ] ));

        document.getElementById(`hike-${id}`).remove();
      }
  } else {
      alert("No hikes to register to");
    }
}

//function to show 'more details' on registered counselor
function showCounselor(username) {
  const user = JSON.parse(localStorage.getItem('USERS')).find(u => u.username === username);
  if (user) {
    const template = `
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h3>${user.fullname}</h3>
          <p>Phone: ${user.phone}</p>
          <p>Birth Date: ${user.birthdate}</p>
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
    navbar.innerHTML = '';
        if (localStorage.getItem("LOGGED_IN_USER")) {
            const userType = JSON.parse(
                localStorage.getItem("LOGGED_IN_USER")
            ).userType;

            let item;
          if (userType === "counselor") {
            item = document.createElement("a");
            item.href = "find-a-hike.html";
            item.innerText = "Find A Hike";
            if (
                window.location.pathname === "/find-a-hike.html"
            ) {
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
          }
          else if (userType === "travel-organizer") {
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
            item.href = "login.html";
            item.innerText = "Log Out";
            navbar.innerHTML += item.outerHTML;
        } else {
            let item;
            item = document.createElement("a");
            item.href = "login.html";
            item.innerText = "Log In";
            if (window.location.pathname === "/login.html") {
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