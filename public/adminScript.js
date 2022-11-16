function deleteProduct(id) {
    swal({
        title: "Are you sure?",
     
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if(willDelete){
                $.ajax({
                    url: "/admin/delete-product/" + id,
                    method: "get",
                    success: (response) => {
                        if(response.active){
                            swal("Added to active products!", {
                                icon: "success",
                            });
                            $("#refresh").load(location.href + " #refresh");
                        }else{
                            swal("Deleted successfully!", {
                                icon: "success",
                            });
                            $("#refresh").load(location.href + " #refresh");
                        }
                        
                    }, error: (err) => {
                        swal("Cancelled")
                    }
                })
            }else{
                swal("Cancelled")
            }

        }).catch((err) => {
            swal("Something went wrong", err, {
                icon: 'error'
            })
        })
}

function addCategory(){
    const category = document.getElementById('addCategoryInput').value
    $.ajax({
        data : {
            category : category
        },
        url : '/admin/category',
        method : 'post',
        success : (response) => {
            if(response == 1){
                swal({
                    title : 'Category added successfully',
                    button : false,
                    icon : "success",
                    timer : 2000

                }) 
               
                location.reload() 
            }
            else{
                swal({
                    title : 'This category already exists',
                    button : false,
                    icon : "error",
                    timer : 2000
                })
            }
        }
    })
}

function editCategory(id){
    const category = document.getElementById(id).value
    $.ajax({
        data : {
            category : category
        },
        url : '/admin/edit-category/' + id,
        method : 'post',
        success : (response) => {
            if(response == 1){
                swal({
                    title : "Category updated successfully",
                    button : false,
                    icon : "success",
                    timer : 2000
                })
                location.reload() 
            } 
            else{
                swal({
                    title : "Category does not exist",
                    button : false,
                    icon : "error",
                    timer : 2000
                })
            }
        }

    })
}


//==============  ADD NEW COUPON ==============//
function addCoupon(){
    const code = document.getElementById('addCouponInput').value   
    const discount = document.getElementById('addDiscountInput').value  
    if(code && discount){
        $.ajax({
            data : {
                code : code,
                discount : discount
            },
            url : '/admin/coupon',
            method : 'post',
            success : (response) => {
               
                if(response == 1){
             
               
                    swal({
                        title : "Coupon added successfully",
                        button : false,
                        icon : "success",
                        timer : 2000
                    })
                    location.reload() 
                }
                else if(response == 0){
                    swal({
                        title: 'Coupon already exists',
                        button: false,
                        timer: 2000,
                        icon: "error"
                    })
                    location.reload() 
                }
            }
            }) 
        }
    
        else{
                swal({
                    title : "Enter coupon code",
                    button : false,
                    icon : "error",
                    timer : 2000
                })
                location.reload() 
               
            }
}
    

//============== DELETE COUPON ==============//
function deleteCoupon(id){
    
    swal({
        title: "Are you sure ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/admin/delete-coupon/' + id,
                    method: 'delete',
                    success: (res) => {
                        swal({
                            title: 'Product deleted',
                            button: false,
                            timer: 4000,
                            icon: "success",
                        })
                        location.reload()
                    }
                })
            }
        });
}

//============== DELETE BANNER ==============//
function deleteBanner(id){
     
    swal({
        title: "Are you sure ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })   
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/delete-banner/' + id,
                method: 'delete',
                success: (res) => {
                    swal({
                        title: 'Product deleted',
                        button: false,
                        timer: 4000,
                        icon: "success",
                    })
                    location.reload()
                }
            })
        }
    });
}

function packOrder(orderId) {
    swal({
        title: "Pack this order ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/pack-order/' + orderId,
                method: 'patch',
                success: (response) => {
                    swal("Order packed & is waiting for shipping", {
                        icon: "success",
                      });
                      location.reload()
                }
            })
        }
      });
}

function shipOrder(orderId) {
    swal({
        title: "Ship this order ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/ship-order/' + orderId,
                method: 'patch',
                success: (response) => {
                    swal("Order shipped successfully", {
                        icon: "success",
                      });
                      location.reload()
                }
            })
        }
      });
}

function deliverOrder(orderId) {
    swal({
        title: "Deliver this order ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/deliver-order/' + orderId,
                method: 'patch',
                success: (response) => {
                    swal("Order delivered & payment collected", {
                        icon: "success",
                      });
                   location.reload()
                }
            })
        }
      });
}