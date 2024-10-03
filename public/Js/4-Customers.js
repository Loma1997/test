let Table = document.querySelector(".Table-body")
function FetchData() {
    fetch("/USERDATA.JSON")
        .then((res) => res.json())
        .then((MainData) => { ShowCustomersOrSuppliersData(MainData) })
        .then(() => CreateArray())
    // .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customers Data And Suppliers Data 
function ShowCustomersOrSuppliersData(MainData) {
    Table.innerHTML = ""
    let FinalBalance = 0.00, TableLength = 0.00

    MainData.forEach((Customer, index) => {
        let Price = 300
        if (Customer.Plan === "Month") { Price = 300 }
        else if (Customer.Plan === "Year") { Price = 3000 }
        else { Price = 6000 }

        TableLength++
        Table.innerHTML += `<tr>
                <td>${TableLength}</td>
                <td>${Customer.Username}</td>
                <td>${Customer.Email}</td>
                <td>${Customer.Phone}</td>
                <td>${Customer.Address}</td>
                <td><div class="Plan ${Customer.Plan}">${Customer.Plan}</div></td>
                <td>${Price}</td>
                <td>${Customer.ActiveAT.slice(0, 10)}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">Activetion</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${Customer._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        FinalBalance = FinalBalance + Balance
    });
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".FinalBalance").innerText = FinalBalance.toFixed(2)
}

// GeneralData => New Collect Or Payment
function NewCollectOrPayment(id) {
    let Form = document.querySelector(".Form-Collect")
    let CustomerID = id
    let DocDate = Form.querySelector(".DocDate")
    let Total = Form.querySelector(".Total")
    let PaymentWay = Form.querySelector(".PaymentWay").value

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");

    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }

    fetch("/CollectFromCustomer" + id, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            DocDate: DocDate.value, Name: CustomerID,
            PaymentWay: PaymentWay, Total: Total.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}
// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.querySelector(".btn-Collect").id,
            Name: Row.querySelectorAll("td")[1].innerText,
            Email: Row.querySelectorAll("td")[2].innerText,
            Phone: Row.querySelectorAll("td")[3].innerText,
            Address: Row.querySelectorAll("td")[4].innerText,
            Plan: Row.querySelectorAll("td")[5].innerText,
            AmountPlan: Row.querySelectorAll("td")[6].innerText,
            LastActivetion: Row.querySelectorAll("td")[7].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "1997-09-28" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    Table.innerHTML = ""
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Email") { SearchBy = TableObj.Email }
        if (SearchBy == "Phone") { SearchBy = TableObj.Phone }
        if (SearchBy == "Address") { SearchBy = TableObj.Address }

        let index = Table.querySelectorAll("tr")
        if (TableObj.UpdatedAt >= SDate && TableObj.UpdatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Email}</td>
                <td>${TableObj.Phone}</td>
                <td>${TableObj.Address}</td>
    
                <td>${TableObj.Plan}</td>
                <td>${TableObj.AmountPlan}</td>
                <td>${TableObj.LastActivetion}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">Activetion</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${TableObj.ID}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        }
    })
}
// Function to Set Values in Input 
function FormCollect(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement

    let form = document.querySelector(".Form-Collect")
    form.classList.toggle("active")
    form.querySelectorAll("input")[1].focus()
    form.querySelector(".Name").innerText = parent.querySelectorAll("td")[1].innerText;
    form.querySelector(".Email").innerText = parent.querySelectorAll("td")[2].innerText;
    form.querySelector(".Phone").innerText = parent.querySelectorAll("td")[3].innerText
    form.querySelector(".Address").innerText = parent.querySelectorAll("td")[4].innerText;
    form.querySelector(".Type-Subscribe").innerText = parent.querySelectorAll("td")[5].innerText;
    form.querySelector(".Amount-Subscribe").innerText = parent.querySelectorAll("td")[6].innerText;
    form.querySelector(".Last-Subscribe").innerText = parent.querySelectorAll("td")[7].innerText;

    form.querySelector('.DocDate').value = ToDay
    form.querySelector('.Total').value = parent.querySelectorAll("td")[6].innerText;
    form.querySelector('.btn-Save').id = btn.id
}

