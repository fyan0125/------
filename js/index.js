let add = document.querySelector("form button");
let sortBtn = document.querySelector(".sort button");
let section = document.querySelector("section");

loadData();

add.addEventListener("click", (e) => {
  e.preventDefault();
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDay = form.children[2].value;
  let check = false;

  if (todoText == "") {
    alert("Please enter something.");
    return;
  }

  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todoText");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("time");
  time.innerText = todoMonth + " / " + todoDay;

  let completeBtn = document.createElement("button");
  completeBtn.classList.add("completeBtn");
  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
  completeBtn.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    xt = todoItem.children[0].innerText;
    let ary = JSON.parse(localStorage.getItem("list"));
    ary.forEach((item, index) => {
      if (item.todoText == text.innerText) {
        item.check = !item.check;
        localStorage.setItem("list", JSON.stringify(ary));
      }
    });
    todoItem.classList.toggle("done");
  });

  let trashBtn = document.createElement("button");
  trashBtn.classList.add("trashBtn");
  trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
  trashBtn.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", (e) => {
      text = todoItem.children[0].innerText;
      let ary = JSON.parse(localStorage.getItem("list"));
      ary.forEach((item, index) => {
        if (item.todoText == text) {
          ary.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(ary));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(text);
  todo.appendChild(time);
  todo.appendChild(completeBtn);
  todo.appendChild(trashBtn);
  todo.style.animation = "scaleUp 0.3s forwards";

  let task = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDay: todoDay,
    check: check,
  };
  let list = localStorage.getItem("list");
  if (list == null) {
    localStorage.setItem("list", JSON.stringify([task]));
  } else {
    let ary = JSON.parse(list);
    ary.push(task);
    localStorage.setItem("list", JSON.stringify(ary));
  }

  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";
  section.appendChild(todo);
});

sortBtn.addEventListener("click", (e) => {
  let sortAry = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortAry));

  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }
  loadData();
});

function loadData() {
  let list = localStorage.getItem("list");
  if (list != null) {
    let ary = JSON.parse(list);
    ary.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todoText");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("time");
      time.innerText = item.todoMonth + " / " + item.todoDay;

      completeBtn = document.createElement("button");
      completeBtn.classList.add("completeBtn");
      completeBtn.innerHTML = '<i class="fas fa-check"></i>';
      completeBtn.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        text = todoItem.children[0].innerText;
        ary.forEach((item, index) => {
          if (item.todoText == text) {
            item.check = !item.check;
            localStorage.setItem("list", JSON.stringify(ary));
          }
        });
        todoItem.classList.toggle("done");
      });

      trashBtn = document.createElement("button");
      trashBtn.classList.add("trashBtn");
      trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
      trashBtn.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", (e) => {
          text = todoItem.children[0].innerText;
          ary.forEach((item, index) => {
            if (item.todoText == text) {
              ary.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(ary));
            }
          });
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      todo.appendChild(text);
      todo.appendChild(time);
      todo.appendChild(completeBtn);
      todo.appendChild(trashBtn);
      section.appendChild(todo);
    });
  }
}

function merge(ary1, ary2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < ary1.length && j < ary2.length) {
    if (Number(ary1[i].todoMonth) > Number(ary2[j].todoMonth)) {
      result.push(ary2[j]);
      j++;
    } else if (Number(ary1[i].todoMonth) < Number(ary2[j].todoMonth)) {
      result.push(ary1[i]);
      i++;
    } else if (Number(ary1[i].todoMonth) == Number(ary2[j].todoMonth)) {
      if (Number(ary1[i].todoDay) > Number(ary2[j].todoDay)) {
        result.push(ary2[j]);
        j++;
      } else {
        result.push(ary1[i]);
        i++;
      }
    }
  }
  while (i < ary1.length) {
    result.push(ary1[i]);
    i++;
  }
  while (j < ary2.length) {
    result.push(ary2[j]);
    j++;
  }
  return result;
}

function mergeSort(ary) {
  if (ary.length == 1) {
    return ary;
  } else {
    let middle = Math.floor(ary.length / 2);
    let left = ary.slice(0, middle);
    let right = ary.slice(middle, ary.length);
    return merge(mergeSort(left), mergeSort(right));
  }
}
