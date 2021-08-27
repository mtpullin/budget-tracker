let db;

const request = indexedDB.open('budget_tracker', 1)

request.onupgradeneeded = function(e){
    const db = e.target.result;

    db.createObjectStore('new_budget_input', {autoIncrement: true})
}
request.onsuccess = function(e){
    db = e.target.result;

    if(navigator.onLine){
        uploadBudget()
    }
}

request.onerror = function(e){
    console.log(e.target.errorCode)
}

function saveRecord(record){
    const transaction = db.transaction(['new_budget_input'], 'readwrite')

    const newBudgetStore = transaction.objectStore('new_budget_input')

    newBudgetStore.add(record)
}

function uploadBudget() {
    const transaction = db.transaction(['new_budget_input'], 'readwrite')

    const newBudgetStore = transaction.objectStore('new_budget_input')

    const getAll = newBudgetStore.getAll()

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => response.json())
              .then(serverResponse => {
                  if(serverResponse.message){
                      throw new Error(serverResponse)
                  }
                  const transaction = db.transaction(['new_budget_input'], 'readwrite')

                  const newBudgetStore = transaction.objectStore('new_budget_input')

                  newBudgetStore.clear()

                  alert('all budget adjustments have been submitted')
              })
              .catch(err => {
                  console.log(err)
              })
        }
    }
}

window.addEventListener('online', uploadBudget)