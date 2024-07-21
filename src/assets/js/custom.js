window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    const body = document.querySelector('.home')

    loader.classList.add('loader-hidden');
    body.classList.remove('loader-hidden');

    loader.addEventListener('transitionend', () => {
        document.body.removeChild("loader")
    })

})

$(document).ready(function () {

    function toggleManuPanal() {
        const menuToggle = document.querySelector(".toggle-btn");
        const search = document.querySelector("#search-icon");
        const setting = document.querySelector("#setting-icon");

        if (window.innerWidth > 769) {

            menuToggle.addEventListener("click", function () {
                document.querySelector("#sidebar").classList.toggle("expand");
            });
            search.addEventListener("click", function () {
                document.querySelector("#sidebar").classList.add("expand");
            });
            setting.addEventListener("click", function () {
                document.querySelector("#sidebar").classList.add("expand");
            });
        } else {
            document.querySelector("#sidebar").classList.add("expand");
            document.querySelector("#searchList").classList.add("close-menu");
            document.querySelector(".sidebar-nav").classList.add("close-menu");
            menuToggle.addEventListener("click", function () {
                document.querySelector("#searchList").classList.toggle("close-menu");
                document.querySelector("#searchList").classList.toggle("open-menu");
                document.querySelector(".sidebar-nav").classList.toggle("close-menu");
                document.querySelector(".sidebar-nav").classList.toggle("open-menu");
            });
        }
    }

    toggleManuPanal()

    // let isReloaded = false
    // window.addEventListener('resize', (() => {
    //     const isSmallScreen = window.innerWidth <= 769
    //     if (isSmallScreen && !isReloaded) {
    //         document.querySelector("#sidebar").classList.add("expand");
    //         window.location.reload()
    //         isReloaded = true;
    //     }
    // }));

    // open and close map details using jquery
    $(".pointer").click(function () {
        $('.card-details').removeClass("close-details")
    })

    // delete alert
    // alert add to favorite

    $(document).on('click', '.trash', function (e) {
        Swal.fire({
            title: 'هل انت متأكد؟',
            text: "لا يمكن التراجع عن هذا",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2E619E',
            cancelButtonColor: '#A61D21',
            confirmButtonText: 'نعم اريد المسح !',
            cancelButtonText: 'الغاء',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'مسح!',
                    'تم مسح الملف.',
                    'success',
                )
            }
        })

    });


    // toggle nav sort
    $('.sort-menu').hide();
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.sort-by').length) {
            $('.sort-menu').fadeOut('fast');

        }
    });
    // filter menu
    $('.sort-by').click(function (event) {
        // event.preventDefault();
        $('.sort-menu').fadeToggle('fast');


    })

    // toggle nav filter
    // fliter menu
    $('.filter-menu').hide();
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.filter-by').length) {
            $('.filter-menu').fadeOut('fast');

        }
    });
    // filter menu
    $('.filter-by').click(function (event) {
        // event.preventDefault();
        $('.filter-menu').fadeToggle('fast');
    })

    // user status
    $('.activeUsers').click(function () {
        $('.template-kinds li').removeClass('active');
        $(this).addClass('active')
        $('.readed').parents('tr').fadeIn('slow');
        $('.not-readed').parents('tr').fadeOut('fast');

    })
    $('.deactiveUsers').click(function () {
        $('.template-kinds li').removeClass('active');
        $(this).addClass('active')
        $('.not-readed').parents('tr').fadeIn('slow');
        $('.readed').parents('tr').fadeOut('fast');
    })

    $('.all').click(function () {
        $('.template-kinds li').removeClass('active');
        $(this).addClass('active')
        $('.not-readed').parents('tr').fadeIn('fast');
        $('.readed').parents('tr').fadeIn('fast');
    })

    //add question
    let rowCounter = 1;

    function addRow() {
        rowCounter++;
        const container = document.getElementById("row-container");
        const newRow = document.createElement("div");
        newRow.classList.add("row");
        newRow.id = "question-" + rowCounter;
        newRow.innerHTML = `
        <hr>
            <div class="col-lg-6 col-12 mb-3">
                <div class="input-floating-label mb-0">
                    <input type="text" class="form-control">
                    <label>اسم الاختبار بالعربى</label>
                </div>
            </div>
            <div class="col-lg-5 col-11 mb-3" id="eng-choose-label">
                <div class="input-floating-label mb-0">
                    <input type="text" class="form-control" style="direction: ltr;">
                    <label class="eng">Choice in English</label>
                </div>
            </div>
            <div class="col-1" id="eng-choose-icon">
                <button type="button" class="trash-btn-form trash" id="delete-ques">
                    <img src="./images/trash-can-outline.png" alt="" class="trash">
                </button>
            </div>
            
        `;
        container.appendChild(newRow);
    }

    function deleteRow(btn) {
        const row = btn.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }

    $('#add-ques').click(() => {
        addRow();
    })

    // select2
    $('.form-select').select2({
        dir: 'rtl',
    })

    $('.send-company-select').select2({
        dropdownParent: $('#sendFormCompany')
    })

    $('.add-company-select').select2({
        dropdownParent: $('#addCompany')
    })

    $('.create-table-select').select2({
        dropdownParent: $('#createQuestion')
    })

    $('.email-select').select2({
        dropdownParent: $('#createMail')
    })
    $('.requestName').select2({
        dropdownParent: $('#requestName')
    })


});



