//JavaScript

var zoomInIcon = '<img src="./images/zoomin.png" width="19px">';

var zoomOutIcon = '<img src="./images/zoomout.png" width="19px">';

var fitIcon = '<svg style="display: block;cursor: pointer;" width="30px" height="30px"><path stroke-width="1" fill="none" stroke="#133C8B" d="M4,11 L4,4 L11,4"></path><path stroke-width="1" fill="none" stroke="" d="M28,11 L28,4 L21,4"></path><path stroke-width="1" fill="none" stroke="#133C8B" d="M28,21 L28,28 L21,28"></path><path stroke-width="1" fill="none" stroke="#133C8B" d="M4,21 L4,28 L11,28"></path><circle cx="16" cy="16" r="5" fill="#133C8B" stroke="#133C8B"></circle></svg>'
 
var fullScreenIcon = '<svg style="display: block;cursor: pointer;" width="30px" height="30px"><path stroke-width="1" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="1" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="1" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="1" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><line x1="5" y1="5" x2="27" y2="27" stroke-width="1" stroke="#757575"></line><line x1="5" y1="27" x2="27" y2="5" stroke-width="3" stroke="#757575"></line></svg>'

OrgChart.templates.itTemplate = Object.assign({}, OrgChart.templates.olivia);
OrgChart.templates.itTemplate.nodeMenuButton = "";
OrgChart.toolbarUI.zoomInIcon = zoomInIcon;
OrgChart.toolbarUI.zoomOutIcon = zoomOutIcon;
OrgChart.toolbarUI.fitIcon = fitIcon;
OrgChart.toolbarUI.ffullScreenIcon = fullScreenIcon;


OrgChart.templates.itTemplate.size = [220, 150];

// Start Main Box Node 
OrgChart.templates.itTemplate.node = '<rect filter="url(#cool-shadow)"  x="0" y="0" height="120" width="220" fill="#ffffff" stroke-width="1" stroke="#eeeeee" rx="10" ry="10" style="position:relative" ></rect><rect stroke="#E7E7E8" stroke-width="1" x="0" y="110" width="220" fill="#F5F6FA" rx="0" ry="30" height="30"></rect>';
// chart box img 
OrgChart.templates.itTemplate.img_0 = '<clipPath id="{randId}"><rect   stroke-width="0" x="100" y="20" rx="0" ry="0" width="100" height="100" ></rect></clipPath><image preserveAspectRatio="xMidYMid " clip-path="url(#{randId})" xlink:href="{val}" x="100" y="20"  width="28" height="35"></image><rect fill="none" stroke="" stroke-width="0" x="0" y="0" rx="10" ry="10" width="80" height="100"></rect>';

// chart box title 
OrgChart.templates.itTemplate.field_0 = '<text id="chartTitle"  style="font-size: 15px;font-weight:bold;text-align:center;display:block;font-family:Din-Text;" fill="#000" x="110" y="80"  text-anchor="middle" data-width="170" data-text-overflow="multiline">{val}</text>';

// create Table 
OrgChart.templates.itTemplate.field_1 = '<g class="createTable"><rect style="overflow:hidden;"  x="70" y="108" width="120" height="30" fill="none" stroke-width="1" stroke="" text-anchor="end"></rect>'+ '<text class="create-text" style="font-size: 12px;font-family:Din-Text;cursor: pointer;z-index=-1;" fill="#7B7890" width="120" height="30" x="185" y="130" text-anchor="end" data-width="90"  data-text-overflow="ellipsis">{val}</text></g>';
// create Table img
OrgChart.templates.itTemplate.field_1img = '<g class="createTable"><rect  x="120" y="110" width="100" height="30" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{createId}"><rect   stroke-width="0" x="190" y="116" rx="0" ry="0" width="18" height="19" ></rect></clipPath><image preserveAspectRatio="xMidYMid " clip-path="url(#{createId})" xlink:href="{val}" x="190" y="116"  width="18" height="19" style="cursor: pointer;"></image></g>'
// create Dep 
OrgChart.templates.itTemplate.field_2 = '<g class="createDep"><rect style="overflow:hidden;"  x="70" y="108" width="120" height="30" fill="none" stroke-width="1" stroke="" text-anchor="end"></rect>'+ '<text class="create-text" style="font-size: 12px;font-family:Din-Text;cursor: pointer;z-index=-1;" fill="#7B7890" width="120" height="30" x="185" y="130" text-anchor="end" data-width="90"  data-text-overflow="ellipsis">{val}</text></g>';
// create Dep img
OrgChart.templates.itTemplate.field_Depimg = '<g class="createDep"><rect  x="120" y="110" width="100" height="30" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{createId}"><rect   stroke-width="0" x="190" y="116" rx="0" ry="0" width="18" height="19" ></rect></clipPath><image preserveAspectRatio="xMidYMid " clip-path="url(#{createId})" xlink:href="{val}" x="190" y="116"  width="18" height="19" style="cursor: pointer;"></image></g>'
// edit box 
OrgChart.templates.itTemplate.field_2img = '<g  class="editBox"><rect  x="10" y="110" width="19" height="18" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{editId}"><rect stroke-width="0" x="10" y="116" rx="0" ry="0" width="19" height="18" ></rect></clipPath><image style="ob" preserveAspectRatio="xMidYMid " clip-path="url(#{editId})" xlink:href="{val}" x="10" y="116"  width="15" height="15" style="cursor: pointer;"></image></g>'

// delete box 
OrgChart.templates.itTemplate.field_3img = '<g  class="deleteBox"><rect  x="29" y="110" width="19" height="18" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{deleteId}"><rect stroke-width="0" x="29" y="116" rx="0" ry="0" width="19" height="18" ></rect></clipPath><image style="ob" preserveAspectRatio="xMidYMid " clip-path="url(#{deleteId})" xlink:href="{val}" x="29" y="116"  width="15" height="15" style="cursor: pointer;"></image></g>'

// view box 
OrgChart.templates.itTemplate.field_4img = '<g  class="viewBox"><rect  x="48" y="110" width="19" height="18" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{viewId}"><rect stroke-width="0" x="48" y="116" rx="0" ry="0" width="19" height="18" ></rect></clipPath><image style="ob" preserveAspectRatio="xMidYMid " clip-path="url(#{viewId})" xlink:href="{val}" x="48" y="116"  width="15" height="15" style="cursor: pointer;"></image></g>'

// ask question box 
OrgChart.templates.itTemplate.field_5img = '<g  class="askBox"><rect  x="48" y="110" width="19" height="18" fill="none" stroke-width="1" stroke=""></rect>'+'<clipPath id="{askId}"><rect stroke-width="0" x="48" y="116" rx="0" ry="0" width="19" height="18" ></rect></clipPath><image style="ob" preserveAspectRatio="xMidYMid " clip-path="url(#{askId})" xlink:href="{val}" x="48" y="116"  width="15" height="15" style="cursor: pointer;"></image></g>'

var chart = new OrgChart(document.getElementById("tree"), {
    mouseScrool: OrgChart.action.ctrlZoom,
    template: "itTemplate",
    enableDragDrop: true,
    align: OrgChart.align.center,
    nodeMouseClick: OrgChart.action.pan, 
    scaleInitial: OrgChart.match.height,
    mouseScrool: OrgChart.action.zoom,
    enableSearch: false,
  
    padding: 0 ,
    toolbar: {
        fullScreen: false,
        zoom: true,
        fit: true,
        expandAll: false
    },
    
    nodeBinding: {
        field_0: "name",
        field_1: "title",
        img_0: "img",
        field_1img: "createTable",
        field_2img: "edit",
        field_3img: "delete",
        field_4img: "view",
        field_5img:'askQa',
        field_2: "createDep",
        field_Depimg: "depImg",
    },

});

chart.load([
    { id: 1, name: "  استمارة ربعية"   , title: "انشاء جدول", img: "./images/file-document-orange.png",createTable:'./images/create-table.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'./images/eye-outline.png' },
    { id: 2, name: "  استمارة سنوية"   , title: "انشاء جدول", img: "./images/file-document-outline.png",createTable:'./images/create-table.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'./images/eye-outline.png' },
  
    { id: 3, pid:2 , name: "جدول رقم 2"   , createDep: "انشاء قسم", img: "./images/table-large.png",depImg:'./images/create-dep.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'' },
    { id: 4, pid:2 , name: "جدول رقم 1"   , createDep: "انشاء قسم", img: "./images/table-large.png",depImg:'./images/create-dep.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'' },

    { id: 5, pid:1 , name: "جدول رقم 2"   , createDep: "انشاء قسم", img: "./images/table-large-purple.png",depImg:'./images/create-dep.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'' },
    { id: 6, pid:1 , name: "جدول رقم 1"   , createDep: "انشاء قسم", img: "./images/table-large-purple.png",depImg:'./images/create-dep.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', view:'' },   
    
    { id: 7, pid:3 , name: " اجمالي الصادرات من السلع "   , createDep: "  انشاء قسم  فرعى "  , img: "./images/tab.png",depImg:'./images/text-box-multiple-outline.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', askQa:'./images/file-question-outline.png' },

    { id: 8, pid:4 , name: " اجمالي الواردات من السلع "   , createDep: "  انشاء قسم  فرعى "  , img: "./images/tab.png",depImg:'./images/text-box-multiple-outline.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', askQa:'./images/file-question-outline.png' },
    { id: 9, pid:4 , name: " اجمالي الصادرات من السلع "   , createDep: "  انشاء قسم  فرعى "  , img: "./images/tab.png",depImg:'./images/text-box-multiple-outline.png', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', askQa:'./images/file-question-outline.png' },

    { id: 10, pid:9 , name: "الى اخرين غير مقيمين"  , title: " "  , img: "",createTable:'', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', askQa:'' },
    { id: 11, pid:9 , name: "الى مستثمر مباشر من أطراف تابعة"  , title: " "  , img: "",createTable:'', edit :'./images/pencil-outline.png', delete: './images/trash-can-outline.png', askQa:'' },
    

]);
chart.on('redraw', function () {
    var btns = document.querySelectorAll('.svg-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        alert("My logic goes here for node with id: " + this.parentNode.getAttribute('data-n-id'));

      })
    }
  });
// edit 

window.addEventListener('resize', (() => {
    // chart.config.scaleInitial.match.boundary
    }));


        
// create new table 

    chart.on('redraw', function () {
        var btn = document.querySelectorAll('.createTable');   
        for (var i=0; i < btn.length; i++) {
            btn[i].setAttribute('data-bs-toggle', 'modal')          
                btn[i].setAttribute('data-bs-target', '#createTable')

         
        }
      

        })  
        // create new departmnet 

    chart.on('redraw', function () {
        var btn = document.querySelectorAll('.createDep');   
        for (var i=0; i < btn.length; i++) {
            btn[i].setAttribute('data-bs-toggle', 'modal')          
                btn[i].setAttribute('data-bs-target', '#createDept')

         
        }
      

        })  
 // ask btn 

    chart.on('redraw', function () {
        var btn = document.querySelectorAll('.askBox');   
        for (var i=0; i < btn.length; i++) {
            btn[i].setAttribute('data-bs-toggle', 'modal')
        btn[i].setAttribute('data-bs-target', '#createQuestion')
        }
      

        })    
// view btn 

    chart.on('redraw', function () {
        $('.viewBox').click(function(){
            window.location.href = './projection.html'
        })
           
        
      
      

        })    
// delete 

chart.on('redraw', function () {
    var btn = document.querySelectorAll('.deleteBox');   
    for (var i=0; i < btn.length; i++){
        btn[i].addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        
                Swal.fire({
                    title: 'هل انت متأكد؟',
                    text: "لا يمكن التراجع عن هذا",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2E619E',
                    cancelButtonColor: '#A61D21',
                    confirmButtonText: 'نعم !',
                    cancelButtonText: 'الغاء',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            "",
                            'تم الحذف!',
                            'success',
                        )
                    }
                })
        
            
          })
    }
    
    })    
        
