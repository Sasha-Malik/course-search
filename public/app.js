let socket = io();
const labels = [
    'Workload',
    'Grading',
    'Exams',
    'Content',
    'Professor',
];

const chartdata = {
    labels: labels,
    datasets: [{
        label: ["Ignore"],
        data: [0, 0, 0, 0, 0],
        backgroundColor:
            [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
        ],
        borderWidth: 1
    }]
};


const start = () => {
    setTimeout(function () {
        confetti.start()
    },
        1000);
};

const stop = () => {
    setTimeout(function () {
        confetti.stop()
    },
        3000);
};


function spawnconfetti() {
    start();
    stop();
}


const config = {
    type: 'bar',
    data: chartdata,
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Student Votes',
                borderColor: '#ffff'
            }

        },

        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};


socket.on('connect', function () {
    console.log("Connected");
});

let myChart;
let courseName = "";

window.addEventListener('load', () => {

    scrollToTop();

    let globalText = "";

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };

    let chart = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(
        chart,
        config
    );

    socket.on('sdata', (data) => {
        if (data.comment == globalText) {
            addMyMessage(data.comment,data.profName);
        }

        else {
            addMessage(data.comment,data.profName);
        }
    });
    //myChart.defaults.global.legend.display = false

    fetch('/courses')
        .then(res => res.json())
        .then(data => {

            let container = document.querySelector(".courseWindow");

            data.courseArray.forEach(e => {

                //adding majors 
                let child = document.createElement('button');
                child.classList.add("course");
                //first entry is the major name
                child.innerHTML = e[0];
                let firstName = e[0];

                child.addEventListener('click', () => {

                    scrollToTop();

                    //removing the majors
                    let remChild = container.lastElementChild;
                    while (remChild) {
                        container.removeChild(remChild);
                        remChild = container.lastElementChild;
                    }

                    //each course in a major
                    e.forEach(course => {

                        //first name is the major name
                        if (course != firstName) {
                            let childCourses = document.createElement('button');
                            childCourses.classList.add("course");
                            childCourses.innerHTML = course;
                            container.appendChild(childCourses);
                            //go to childs comment page
                            childCourses.addEventListener('click', () => {
                                courseName = childCourses.innerHTML;
                                showComments(courseName);
                                showPoll(courseName);
                                scrollToTop();
                            });
                        }
                    })

                })

                /*child.addEventListener('click', () => {

                    courseName = child.innerHTML;
                    showComments(courseName);
                    showPoll(courseName);

                });*/

                container.appendChild(child);

            });

        });

    let form = document.getElementById("form");
    form.addEventListener('submit', handleForm);

    let formComment = document.getElementById("formComment");
    formComment.addEventListener('submit', handleForm);

    function handleForm(event) { event.preventDefault(); }


    let btn = document.querySelector(".btn");

    btn.addEventListener("click", () => {


        let textVal = document.getElementById("textVal");

        courseName = textVal.value;
        showComments(courseName);
        showPoll(courseName);

    });


    let button = document.querySelector('.btnComment');
    button.addEventListener('click', () => {

        updateScroll();

        let text = document.getElementById("textValComment");
        let prof = document.getElementById("prof");
        console.log(prof.value);

        if(prof.value == "")
            prof.value = "Prof : " + "unspecified";

        else
            prof.value = "Prof : " + prof.value;

        if (text.value != "") {
            globalText = text.value;

            let commentObj = {
                "courseName": courseName,
                "comment": text.value,
                "profName": prof.value,
                "updateAt": new Date()
            };

            socket.emit('data', commentObj);
        }

        text.value = "";
        prof.value = "";
    });


    let pollsubmit = document.querySelector('.pollsubmitbtn');
    pollsubmit.addEventListener('click', () => {

        let wpoll = document.getElementById("workload").value;
        let gpoll = document.getElementById("grading").value;
        let epoll = document.getElementById("exams").value;
        let cpoll = document.getElementById("content").value;
        let ppoll = document.getElementById("professor").value;

        let pollObj = {
            "courseName": courseName,
            "polldata": [wpoll, gpoll, epoll, cpoll, ppoll],
            "updateAt": new Date()
        };

        let pollobjJSON = JSON.stringify(pollObj);
        socket.emit('poll', pollObj);
        console.log(pollobjJSON);
        showPoll(courseName);
        spawnconfetti();
        openpopup();
        closeslidercontainer();
    })

    let popupclosebtn = document.querySelector('.popupclosebtn');
    let pollsliderscontainer = document.querySelector('.sliderscontainer');
    let pollopenbutton = document.querySelector('.callpollpopup');

    let crossbutton = document.querySelector('.closeButton');

    popupclosebtn.addEventListener('click', () => {
        closepopup();
    })
    pollopenbutton.addEventListener('click', () => {
        openslidercontainer();
    })
    crossbutton.addEventListener('click', () => {
        closeslidercontainer();
    })

});

function addMessage(message, profName) {

    let elem = document.createElement('div');
    elem.classList.add('comment');

    let prof = document.createElement('p');
    let comment = document.createElement('p');

    prof.classList.add('profName');
    prof.innerHTML = profName;

    comment.classList.add('commentValue');
    comment.innerHTML = message;

    elem.appendChild(prof);
    elem.appendChild(comment);

    let container = document.querySelector('.commentContainer');
    container.appendChild(elem);
}

function addMyMessage(message,profName) {

    let elem = document.createElement('div');
    elem.classList.add('comment1');

    let prof = document.createElement('p');
    let comment = document.createElement('p');

    prof.classList.add('profName');
    prof.innerHTML = profName;

    comment.classList.add('commentValue');
    comment.innerHTML = message;

    elem.appendChild(prof);
    elem.appendChild(comment);

    let container = document.querySelector('.commentContainer');
    container.appendChild(elem);

}

function removeMessages() {

    let container = document.querySelector('.commentContainer');
    let child = container.lastElementChild;

    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }

}

function showComments(courseName) {

    removeMessages();

    let courseWindow = document.querySelector('.courseContainer');
    courseWindow.style.display = "none";

    let eachContainer = document.querySelector('.eachContainer');
    eachContainer.style.display = "flex";


    let courseHeading = document.querySelector('.courseHeading');
    courseHeading.innerHTML = courseName;

    let url = "/comments?selectedCourse=" + courseName;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            let arr = data.comments;
            console.log(arr);

            arr.forEach(e => {
                addMessage(e.comment,e.profName);
            });

        })
}

function showPoll(courseName) {

    let url2 = "/polls?selectedCourse=" + courseName;
    fetch(url2)
        .then(res => res.json())
        .then(data => {


            let pollsarray = data.poll; // Gets all the poll for the courses
            let t_wpoll = 0;     // Total Workload
            let t_gpoll = 0;     // Total Grading
            let t_epoll = 0;     // Total Exams
            let t_cpoll = 0;     // Total Content
            let t_ppoll = 0;     // Total professor     
            let totaluserpoll = 0;


            let a_wpoll = 0;     // Average Workload
            let a_gpoll = 0;     // Average Grading
            let a_epoll = 0;     // Average Exams
            let a_cpoll = 0;     // Average Content
            let a_ppoll = 0;     // Average Professor



            pollsarray.forEach(e => {
                t_wpoll += parseInt(e.polldata[0]);
                t_gpoll += parseInt(e.polldata[1]);
                t_epoll += parseInt(e.polldata[2]);
                t_cpoll += parseInt(e.polldata[3]);
                t_ppoll += parseInt(e.polldata[4]);
                totaluserpoll++;
            });

            a_wpoll = t_wpoll / totaluserpoll;
            a_gpoll = t_gpoll / totaluserpoll;
            a_epoll = t_epoll / totaluserpoll;
            a_cpoll = t_cpoll / totaluserpoll;
            a_ppoll = t_ppoll / totaluserpoll;


            average_data = [a_wpoll, a_gpoll, a_epoll, a_cpoll, a_ppoll];
            chartdata.datasets[0].data = average_data;
            document.querySelector('.votecounter').innerHTML = totaluserpoll + " students voted";

            myChart.update();

        })
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

function openpopup() {
    let popupwindow = document.querySelector('.Thankyoupopup');
    popupwindow.classList.add("open-popup");

}

function closepopup() {
    let popupwindow = document.querySelector('.Thankyoupopup');
    popupwindow.classList.remove("open-popup");
}


function openslidercontainer() {
    let sliderspopup = document.querySelector('.sliderscontainer');
    sliderspopup.classList.add("sliderscontainer-open");

}

function closeslidercontainer() {
    let sliderspopup = document.querySelector('.sliderscontainer');
    sliderspopup.classList.remove("sliderscontainer-open");
}

function updateScroll() {
    var element = document.getElementById("containerID");
    element.scrollTop = element.scrollHeight;
}


let id = "";

let myVideo;
let allVideos = [];

let vidWidth = 300;
let vidHeight = 250;

function setup() {
    const canvas = createCanvas(1400, 750);
    canvas.parent("video");
}

function gotMineConnectOthers(myStream) {

    let p5l = new p5LiveMedia(
        this,
        "CAPTURE",
        myStream,
        courseName
    );

    p5l.on('stream', gotOtherStream);

}


function draw() {
    background(36,38,41);
    stroke(255);

    let row = 0; //for making a grid
    let col = 0;


    let count = 0;

    for (const i in allVideos) {
        if (allVideos[i]) {
            count++;
        }
    }

    let pad = 50;

    if (count == 1) {
        vidHeight = 550;
        vidWidth = 800;
        pad = 300;
        let endCall = document.querySelector(".buttonContainer");
        endCall.style.marginTop = "-150px";
    }

    else if (count == 2) {
        vidHeight = 430;
        vidWidth = 600;
        pad = 80;
        let endCall = document.querySelector(".buttonContainer");
        endCall.style.marginTop = "-210px";
    }

    else if (count == 3)
    {
        vidHeight = 300;
        vidWidth = 400;
        let endCall = document.querySelector(".buttonContainer");
        endCall.style.marginTop = "-210px";
    }
    else {
        vidHeight = 300;
        vidWidth = 400;
        let endCall = document.querySelector(".buttonContainer");
        endCall.style.marginTop = "-60px";
    }


    for (const i in allVideos) {
        if (allVideos[i]) {

            image(allVideos[i], col * vidWidth + pad * (col + 1), row * vidHeight + pad * (row), vidWidth, vidHeight);
            col++;
            if (col >= 3) {
                col = 0;
                row++;
            }
        }
    }
}


// We got a new stream!
function gotOtherStream(stream, id) {

    // This is just like a video/stream from createCapture(VIDEO)
    otherVideo = stream;
    otherVideo.size(vidWidth, vidHeight);
    allVideos[id] = otherVideo;
    otherVideo.hide();
    //otherVideo.id and id are the same and unique identifiers
}

function gotDisconnect(id) {
    delete allVideos[id];
}

window.addEventListener('load', () => {

    let joinBtn = document.getElementById('joinRoom');

    joinBtn.addEventListener('click', showVideo);

    function showVideo() {

        window.scrollTo(0, 255);

        let endCall = document.querySelector(".endCall");
        endCall.addEventListener('click',() =>{
            window.location.reload(true);
        });

        let eachContainer = document.querySelector('.eachContainer');
        eachContainer.style.display = "none";

        let searchContainer = document.querySelector('.search');
        searchContainer.style.display = "none";

        let videoContainer = document.querySelector('.videoContainer');
        videoContainer.style.display = "flex";

        let video = document.querySelector('#video');
        video.style.display = "flex";

        let courseHeading = document.querySelector('.courseHeadingVideo');
        courseHeading.innerHTML = "Study Room : " + courseName;

        let constraints = {audio: true, video: true};
        myVideo = createCapture(constraints, function (stream) {
            let p5l = new p5LiveMedia(this, "CAPTURE", stream, courseName)


            let mute = document.querySelector('.mute');
            let voice = document.querySelector('.voice');

            mute.addEventListener('click',()=>{
                voice.style.display = "flex";
                mute.style.display = "none"; 
                let audio = stream.getTracks().find(track=>track.kind=="audio");
                audio.enabled = true;
            })
        
            voice.addEventListener('click',()=>{
                mute.style.display = "flex";
                voice.style.display = "none";
                console.log(stream);
                let audio = stream.getTracks().find(track=>track.kind=="audio");
                audio.enabled = false;
            })

     
            id = stream.id;
            p5l.on('stream', gotOtherStream);
            p5l.on('disconnect', gotDisconnect);
        }
        
        );

           
        myVideo.elt.muted = true;
        myVideo.size(vidWidth, vidHeight);
        myVideo.hide();
        allVideos['Me'] = myVideo;
    }

});




// This is a test of the p5LiveMedia webrtc library and associated service.
// Open this sketch up 9 times to send video back and forth

