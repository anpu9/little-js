function saveData(data) {
  localStorage.setItem("mytodolist", JSON.stringify(data)); //JS对象转换成JSON对象存进本地缓存
}
function loadData() {
  var hisTory = localStorage.getItem("mytodolist");
  if (hisTory != null) {
    return JSON.parse(hisTory); //JSON对象转换为JS对象
  } else {
    return [];
  }
}
function postAction() {
  let title = document.getElementById("title");
  if (title.value == "") {
    alert("内容不能为空");
  } else {
    let data = loadData();
    let todo = {
      title: title.value,
      done: false,
    };
    data.push(todo);
    saveData(data);
    let form = document.getElementById("form");
  form.reset();
    load(); //渲染
  }
}
function load() {
  let todolist = document.getElementById("todolist"),
    donelist = document.getElementById("donelist"),
    todoCount = document.getElementById("todocount"),
    doneCount = document.getElementById("donecount"),
    collection = localStorage.getItem("mytodolist");
  if (collection != null) {
    let data = JSON.parse(collection),
      todoString = "",
      doneString = "",
      todocount = 0,
      donecount = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i]["done"]) {
        doneString += `<li><input type="checkbox" onchange=update(${i},\"done\",false)><p id="p-${i}" onclick='edit(${i})'>${data[i].title}</p><a href='javascript:remove(${i})'>-</a></li>`;
        donecount++;
      } else {
        todoString += `<li><input type="checkbox" onchange=update(${i},\"done\",true)><p id="p-${i}" onclick='edit(${i})'>${data[i].title}</p><a href='javascript:remove(${i})'>-</a></li>`;
        todocount++;
      }
    }
    todolist.innerHTML = todoString;
    donelist.innerHTML = doneString;
    todoCount.innerHTML = todocount;
    doneCount.innerHTML = donecount;
  } else {
    todolist.innerHTML = "";
    donelist.innerHTML = "";
    todoCount.innerHTML = 0;
    doneCount.innerHTML = 0;
  }
}
function update(i, field, value) {
  let data = loadData();
  let todo = data.splice(i, 1)[0];
  todo[field] = value;
  data.splice(i, 0, todo);
  saveData(data);
  load();
}
function remove(i) {
  let data = loadData();
  let todo = data.splice(i, 1)[0];
  saveData(data);
  load();
}
function edit(i){
    let p=document.getElementById(`p-${i}`),
    originalP=p.innerHTML;
    p.innerHTML=`<input type="text" id="input-${i}" value="${originalP}"/>`;
    let inputBox=document.getElementById(`input-${i}`);
    inputBox.setSelectionRange(0,inputBox.value.length);
    inputBox.focus();
    inputBox.onblur=function(){
        if(inputBox.value.length===0){
        alert('内容不能为空！');
        p.innerHTML=originalP;
    }else{
        update(i,"title",inputBox.value)
    }
    }
    
}
function clear(){
    localStorage.clear();
    load();
}
window.onload=load;
window.addEventListener("storage",load,false);
