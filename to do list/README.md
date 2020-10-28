# to do list

## 涉及的知识点

- ### **存储**（对象数组）LocalStorage

  - 得到json对象并转为js对象：

    ```
    function loadData(){
    let objList=localStorage.getItem("name");
    	if(objList!==null){//检查是否为空
    		return JSON.parse(objList)
    	}else{
    		return [];//为空则返回空数组
    	}
    }
    ```

    

  - 把js对象转换为json并储存：

    ```
    function saveData(data){
    	localStorage.setItem("name",JSON.stringify(data));
    }
    ```

    ------

    

- ### css网页布局 **移动端适配**

  -  `<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>`

  - 媒体查询`@media screen and (min-width:)//pc端`

    ​               `@media screen and (max-width:)//移动端`

  - 表单无聚焦边框：

    ```
    input:focus{
    	outline-width:0;
    }
    ```

  - 双重边框`border-style:double;`

  - 需要居中的元素使用`margin:0 auto`,再修改块级元素的宽度即可

    

- ### form控件的`action`属性可以传输数据到php文件等 这里是到js文件里

  - `form.reset()`重置列表

  - enter时自动提交表单 这时需要新建一个**对象**放置新的*待办事项*

    ```
    function postAction(){
    	if(title.value=''){
    		alert('不能为空');
    	}else{
    		let item={
    			title:title.value,//属性名不加双引号！
    			done:false
    		}	
    	}
    	let data=loadData();//获取到原有的数据
    	data.push(item);//加入数组
    	saveData(data);
    	//再重置表单
    	load();//重新渲染页面
    }
    
    ```

    

- ### **DOM动态操作**！最重要的知识点！

  - **渲染**
    **页面加载后即渲染`window.onload=load`

    ```
    function load(){//不需要传入数据，因为数据是从json文件里的来的
     let todolist = document.getElementById("todolist"),
        donelist = document.getElementById("donelist"),
        todoCount = document.getElementById("todocount"),
        doneCount = document.getElementById("donecount"),
        collection = localStorage.getItem("mytodolist");
      if (collection != null) {
        let data = JSON.parse(collection),//注意转成js对象
          todoString = "",//最重要的节点内容
          doneString = "",
          todocount = 0,
          donecount = 0;
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i]["done"]) {//不同的节点属性函数是不一样的！
          //所有DOM的节点都是根据json对象转换成的js对象的属性值生成的！这一点很重要！
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
    ```

  - ### 移除

    ```
    function remove(i){//传入了索引值，取得相应的li
      //直接从json文件里移出该对象，然后重新渲染即可，而不是直接删除其html
      data=loadData();
      let obj=data.splice(i,1)[0]//这就改变了原数组
      saveData(data);
      load();
    }
    ```

  - ### 编辑内容

    首先想一下！编辑内容需要什么？

    ​                                ——input呀！

    想想li里的结构`<li><input type="checkbox"/><p id="p-${i}"></p><a></a></li>`

    改变p为input?

    可以改变一个思路，把p变成父元素，在p里面放input,用innerHTML很容易做到

    input里面原来是有内容的，是p的内容，所以要先把p的innerHTML获取到赋给input.value

    还要设置选中区域的位置，用到`input.setSelectionRange(0,length)`

    最后input失焦时需要干什么？

    input要消失，p的值改变

    同样的 改变json对象的值，再渲染

    而这里因为改变对象属性有两种情况：1.选中与否 2.内容

    为了代码的可复用性和优雅，再把这一部分逻辑剥离出来写一个函数update

    ```
    function edit(i){
        let p=document.getElementById(`p-${i}`),
        originalP=p.innerHTML;
        p.innerHTML=`<input type="text" id="input-${i}" value="${originalP}"/>`;
        let inputBox=document.getElementById(`input-${i}`);
        inputBox.setSelectionRange(0,inputBox.value.length);//设置选中区域的位置
        inputBox.focus();
        inputBox.onblur=function(){input要消失，p的值改变
            if(inputBox.value.length===0){
            alert('内容不能为空！');
            p.innerHTML=originalP;
        }else{
            update(i,"title",inputBox.value)
        }
        }
        
    }
    ```

  - ### 改变li状态的函数update
  
    首先想 li需要改变什么？
  
    1.选中的状态变了，他所在的栏不一样
  
    2.修改Li的innerHTML值，其实是json对象的todo的value改变了
  
    所以这个函数的参数需要（i，field,value) 分别是该对象的索引值，修改的属性，修改后的值
  
    ```
    function update(i, field, value) {
      let data = loadData();
      let todo = data.splice(i, 1)[0];//把这个需要修改的对象拎出来
      todo[field] = value;
      data.splice(i, 0, todo);//修改后再放回去
      saveData(data);
      load();
    }
    ```
  
  - ### 全部清空
  
    需要用到localStorage.clear()
  
    ```
    function clear(){
        localStorage.clear();
        load();
    }
    ```
  
    

