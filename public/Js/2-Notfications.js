let User, Timetxt = ""
function FetchNotificationsData() {
    fetch("/Notfications.JSON")
        .then((res) => res.json())
        .then((MainData) => { ShowNotificationsData(MainData) })
    // .catch((err) => { return location.href = "/Error" })
} FetchNotificationsData()
setInterval(() => { FetchNotificationsData() }, 5000);


function ShowNotificationsData(MainData) {
    User = MainData[1];
    let NotficatItems = document.querySelector(".notficat-items")
    NotficatItems.innerHTML = ""

    MainData[0].NotificationsData.sort((A, Z) => new Date(Z.CreatedAt) - new Date(A.CreatedAt))
    MainData[0].NotificationsData.forEach(Notfication => {
        let Username = '';
        if (!Notfication.Username.includes("تذكير")) {
            if (MainData[0]._id == Notfication.Username) { Username = MainData[0].Username }
            else { Username = (MainData[0].UsersData.find(User => User._id == Notfication.Username)).Username }
        } else { Username = Notfication.Username }

        TimeSince(Notfication.CreatedAt)
        NotficatItems.innerHTML += `
                    <div class="item">
                        <div class="right">
                            <img src="Img/avatar.png" alt="" srcset="">
                            <i class='bx ${Notfication.Icon}'></i>
                        </div>
                        <div class="left">
                            <div>
                                <h4>${Username}</h4>
                                <span><i class="bx bx-history"></i> ${Timetxt}</span>
                            </div>
                            <p> ${Notfication.Text} </p>
                        </div>
                    </div> `
    });
    document.querySelector(".num-not").innerText = MainData[0].NotificationsData.length

    // هنا هنعرض بيانات المحل
    if (!Title === "الاعدادات") {
        document.querySelector(".Details-Company .NameCompany").innerText = MainData[0].NameCompany
        document.querySelector(".Details-Company .TypeCompany").innerText = MainData[0].TypeCompany
        document.querySelector(".Details-Company .Address").innerText = MainData[0].CityCompany + " - " + MainData[0].AddressCompany
        let line = " - "
        if (MainData[0].PhoneCompany2 === "") { line = "" }
        document.querySelector(".Details-Company .Phone").innerText = MainData[0].PhoneCompany1 + line + MainData[0].PhoneCompany2
        // document.querySelector(".Details-Company .Logo").src = MainData[0].LogoCompany
    }
}

function TimeSince(MyDate) {
    Timetxt = ""

    var seconds = Math.floor((new Date() - new Date(MyDate)) / 1000);

    var interval = seconds / 31536000; // الاعوام
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أعوام"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " عام"; }

    interval = seconds / 2592000; // الاشهر
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أشهر"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " شهر"; }

    interval = (seconds / 86400) / 7; // اسابيع
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أسابيع"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " أسبوع"; }

    interval = seconds / 86400; // الايام
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أيام"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " يوم"; }

    interval = seconds / 3600; // الساعات
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " ساعات"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " ساعة"; }

    interval = seconds / 60; // الدقائق
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " دقائق"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " دقيقة"; }

    Timetxt = "منذ قليل";
}

// اكواد خاضة بالاشعارات
function Toast(id, txt) {
    let icon = "bell"
    if (id === "Success") { icon = "check" }
    if (id === "Error") { icon = "x" }
    let Toasts = document.querySelector(".Toasts")
    let length = Toasts.querySelectorAll(".Toast").length
    let MyToast = `
        <div class="Toast index-${length}"  id="${id}">
            <i class="bx bx-${icon}"></i>
            <div>
                <h4>${id}</h4>
                <h4 class="Toast-Txt">${txt} </h4>
            </div>
            <i onclick="CloseToast(index = ${length})" class="bx bx-x X-Toast"></i>
        </div> `
    Toasts.innerHTML += MyToast
    if (User.VoiceMessage === true) { window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt)) }
    setTimeout(() => { Toasts.querySelectorAll(".Toast")[length].classList.add("active") }, 100);
    setTimeout(() => { CloseToast(index = length) }, 5000);
}

function CloseToast(index) {
    let Toasts = document.querySelector(".Toasts")
    let Toast = Toasts.querySelector(`.index-${index}`)
    if (Toast) {
        Toast.classList.remove("active")
        setTimeout(() => { Toast.remove() }, 500);
    }
}



function ShareData() {
    if (!navigator.share) return
    navigator.share({
        title: "loma",
        text: "hello world",
        url: "https://www.facebook.com",
    })
}