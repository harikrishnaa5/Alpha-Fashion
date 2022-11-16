function resendOtp(){
    $.ajax({
        url : '/resend-otp',
        method : 'get',
        success : (response) => {
            location.reload()
        }
    })
}

function addToWishlist(id) {
    $.ajax({
        url : '/add-to-wishlist/' + id,
        method : 'post',
        success : (response) => {
            if (response == 1) {
                swal({
                    title : 'Added to wishlist',
                    button : false,
                    timer : 500
                })
            }
            else {
                swal({
                    title : 'Already in wishlist',
                    button : false,
                    timer : 500
                })
            }
        }
    })
}

function deleteFromWishlist(id) {
    
    $.ajax({
        url : '/remove-from-wishlist/' + id,
        method : 'delete',
        success : (response) => {
            swal({
                title : 'Removed from wishlist',
                button : false,
                timer : 500
            })
         
            location.reload()
        }
    })
}

function cartCount(){
    $.ajax({
        url : '/cart-count/',
        method : 'get',
        success : (response) => {
            document.getElementById('cart-count').innerHTML = response
        },
        error :(err) => {

        }
    })
}

function addToCart(id) {
  
    $.ajax({
        url : '/add-to-cart/' + id,
        method : 'post',
        success : (response) =>{
            swal({
                title : 'Added to cart',
                button : false,
                timer : 3000
            })
            document.getElementById('cart-count').innerHTML = response
        }, error : (err) => {

        }
    })
}

function editProfile() {
    const name =document.getElementById('recipient-name').value
    const email =document.getElementById('recipient-email').value
    const mobile =document.getElementById('recipient-mobile').value
    $.ajax({
        url : '/edit-profile/',
        method : 'put',
        data:{
            name:name,
            email:email,
            mobile:mobile
        },
        success : (response) => {
          
            location.reload()
        }, error : (err) => {

        }
    })
}

function addAddress(){
    const name = document.getElementById('name').value
    const locality = document.getElementById('locality').value
    const state = document.getElementById('state').value
    const landmark = document.getElementById('landmark').value
    const pincode = document.getElementById('pincode').value
    
    $.ajax({
        url : '/add-address',
        method : 'post',
        data:{
            name:name,
            locality:locality,
            state:state,
            landmark:landmark,
            pincode:pincode

        },
        success : (response) => {
            swal({
                title : 'Address added',
                button : false,
                timer : 3000
            })
         
            location.reload()
        }
    })
}


function deleteAddress(id) {
    
    swal({
        title : "Are you sure?",
        text : "The address will be removed from your account",
        icon : "warning",
        buttons : true,
        dangerMode : true,
    })  
    .then(willDelete => {
        if(willDelete){
            $.ajax ({
                url : '/delete-address/'+ id,
                method : 'delete',
                success : (response) => {
                   location.reload()
                 
                }, error : (err) => {
                    
                    location.reload()
                }
            })
        }
        
    })
}

function changeQuantity(id, change){
    $.ajax({
        data : {
            productId : id,
            change : change
        },
        url : '/cart-count',
        method : 'put',
        success : (response) => {
        
            location.reload()
        }, error : (err) => {
            location.reload()
        }
    }) 
   
}

function deleteCartItem(id){
    swal({
        title : "Are you sure?",
        text : "The product will be removed from your cart",
        icon : "warning",
        buttons : true,
        dangerMode : true,
    })  
    .then(willDelete => {
        if(willDelete){
            $.ajax ({
                url : '/delete-from-cart/' + id,
                method : 'delete',
                success : (response) => {
                   
                    
                    location.reload()
                
                }, error : (err) => {
                    
                    location.reload()
                }
            })
        }
    })
}

function applyCoupon(){
    const enteredCode = document.getElementById('couponCode').value 
    if(enteredCode){
    $.ajax({
        url : '/apply-coupon/'+ enteredCode,
        method : 'post',
        success :(response) => {
        
            if(response.discount){
                let discountAmount = response.cartTotal * (response.discount/100)
                discountAmount = Math.floor(discountAmount)
                let finalAmount = response.cartTotal - discountAmount + 50
                document.getElementById('discountAmount').innerHTML = `₹ ${discountAmount}.00`
                document.getElementById('finalAmount').innerHTML = `₹ ${finalAmount}.00`
              
            }
            else{
              
                swal({
                    text : "Invalid coupon code",
                    icon : "warning",
                    button : false,
                    timer : 3000,
                    dangerMode : true,
                })
                location.reload
            }
        }
    })
}
}

function checkout(){
    
    
    $.ajax({
        url : '/checkout', 
        method : 'get',
        success : (response) => {
            location.reload()
        }
    })
}

function selectAddress(addressId){
    document.getElementById('hiddenAddress').value = addressId
}

function placeOrder(){
    const buttons = document.getElementsByClassName('input-radio')
    const addressId = document.getElementById('hiddenAddress').value

    let methodTicked;
    for (const button of buttons) {
        if (button.checked) {
            methodTicked = button.value;
            break;
        }
    }

if(addressId && methodTicked){
    $.ajax({
        data : {
            payment : methodTicked,
            addressId : addressId
        },
        url : '/place-order',
        method : 'post',
        success : (response) => {
            console.log(response, "response is hereeee");
        if(response.message){
            swal({
                title : 'Coupon already used',
                icon : 'warning'
            })
        }else{
            if(response.cod){ 
                console.log("response");               
                location.href = '/order-success'
            }else{
                razorpayPayment(response)
            }
        }
            
        }
    })
}else{
    if(!methodTicked && !addressId){
        swal({
            title : 'choose address and payment mode',
            icon : 'warning'
        })
    }
    else if (!methodTicked && addressId){
        swal({
            title : 'choose a payment method',
            icon : 'warning'
        })
    }
    else if(methodTicked && !addressId){
        swal ({
            title : 'choose an address',
            icon : 'warning'
        })
    }
}

}

function razorpayPayment(order) {
    var options = {
        "key": order.key, // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Alpha Fashion",
        "description": "Test Transaction",
        "image": "/user_files/images/fashion alpha logo.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, order)
        },
        "prefill": {
            "name": "Test name",
            "email": "testemail@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Test address"
        },
        "theme": {
            "color": "#E73C17"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        location.href = '/payment-failed'
    });
    rzp1.open();
}



function verifyPayment(payment, order) {
    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (res) => {
            location.href = '/order-success'
        }
    })
}


function cancelOrder(orderId) {
    swal({
        title: "Cancel this order ?",
        text: "Once cancelled, you cannot undo the cancel",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willCancel) => {
        if (willCancel) {
            $.ajax({ 
                url: '/cancel-order/' + orderId,
                method: 'delete',
                success: (res) => {
                    swal({
                        title: 'Order cancelled',
                        button: false,
                        timer: 1000,
                        icon: "success",
                    })
                   
                    location.reload()
                }
            })
        }
      });
}

